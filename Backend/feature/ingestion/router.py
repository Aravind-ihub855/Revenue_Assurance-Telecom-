from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
import pandas as pd
import io
import json
from service.database import get_db
from .schemas import IngestionPreviewResponse

router = APIRouter(prefix="/api/ingest", tags=["ingestion"])

REQUIRED_COLUMNS = {
    "customer_plan_history": ["plan_history_id"],
    "billing_cycle": ["cycle_id"]
}

TABLE_COLUMNS = {
    "customer_plan_history": [
        "plan_history_id", "customer_id", "plan_id", "activation_date", 
        "expiry_date", "plan_status", "change_type", "previous_plan_id", 
        "auto_renewal_flag", "recharge_amount", "recharge_type", 
        "source_channel", "is_current_plan", "created_at", "updated_at"
    ],
    "billing_cycle": [
        "cycle_id", "customer_id", "billing_cycle_day", "cycle_start_date", 
        "cycle_end_date", "bill_generation_date", "billing_status", 
        "total_amount", "due_date", "payment_status", "payment_date", 
        "late_fee", "adjustment_amount", "created_at", "updated_at"
    ]
}

@router.post("/preview", response_model=IngestionPreviewResponse)
async def preview_ingestion(table_name: str, file: UploadFile = File(...)):
    if table_name not in TABLE_COLUMNS:
        raise HTTPException(status_code=400, detail="Invalid table name")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")
    
    # Pre-process: replace NaN with None for consistent JSON/DB handling
    df = df.where(pd.notnull(df), None)
    
    headers = df.columns.tolist()
    expected_cols = TABLE_COLUMNS[table_name]
    required_cols = REQUIRED_COLUMNS[table_name]
    
    validation_errors = []
    
    # 1. Match Columns check
    missing_required = [col for col in required_cols if col not in headers]
    if missing_required:
        validation_errors.append(f"CRITICAL: Missing required ID columns: {', '.join(missing_required)}")
    
    # 2. Null Checks for ID columns
    for col in required_cols:
        if col in headers:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                validation_errors.append(f"Column '{col}' (Identifier) has {null_count} null values. These rows will be skipped.")
            
            # Check for duplicate IDs in the file
            duplicate_count = df[col].duplicated().sum()
            if duplicate_count > 0:
                validation_errors.append(f"WARNING: Found {duplicate_count} duplicate values in '{col}'. Due to UPSERT logic, only the last occurrence of each ID will be preserved in the database.")

    # 3. Data Preview (first 10 rows)
    preview_df = df.head(10)
    preview_data = preview_df.to_dict(orient="records")
    
    return {
        "table_name": table_name,
        "headers": headers,
        "preview_data": preview_data,
        "total_rows": len(df),
        "validation_errors": validation_errors,
        "is_valid": len(missing_required) == 0  # Only critical missing columns make it invalid
    }

@router.post("/commit")
async def commit_ingestion(table_name: str, file: UploadFile = File(...), db=Depends(get_db)):
    if table_name not in TABLE_COLUMNS:
        raise HTTPException(status_code=400, detail="Invalid table name")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")
    
    cols = TABLE_COLUMNS[table_name]
    pk = "plan_history_id" if table_name == "customer_plan_history" else "cycle_id"
    
    # 1. Robust Type Conversions
    # Handle Boolean strings
    bool_cols = ["auto_renewal_flag", "is_current_plan"] if table_name == "customer_plan_history" else []
    for col in bool_cols:
        if col in df.columns:
            df[col] = df[col].map({'true': True, 'false': False, 'TRUE': True, 'FALSE': False, 1: True, 0: False, True: True, False: False})

    # Handle numeric columns with potential NaN or string commas
    numeric_cols = ["recharge_amount", "total_amount", "late_fee", "adjustment_amount", "billing_cycle_day"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col].replace('[\$,]', '', regex=True), errors='coerce')

    # Handle Date/Time
    date_cols = ["activation_date", "expiry_date", "cycle_start_date", "cycle_end_date", "bill_generation_date", "due_date", "payment_date", "created_at", "updated_at"]
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            # Convert to None if NaT (pandas null date)
            df[col] = df[col].apply(lambda x: None if pd.isnull(x) else x.strftime('%Y-%m-%d %H:%M:%S') if 'at' in col else x.strftime('%Y-%m-%d'))

    # Final replacement of NaNs with None for psycopg2
    df = df.where(pd.notnull(df), None)
    
    # 2. Skip rows only if PK is null
    initial_count = len(df)
    df = df.dropna(subset=[pk])
    skipped_count = initial_count - len(df)
    
    cur = db.cursor()
    try:
        # Build query
        update_set = ", ".join([f"{col} = EXCLUDED.{col}" for col in cols if col != pk])
        columns_str = ", ".join(cols)
        placeholders = ", ".join(["%s"] * len(cols))
        
        query = f"""
            INSERT INTO {table_name} ({columns_str})
            VALUES ({placeholders})
            ON CONFLICT ({pk}) DO UPDATE SET {update_set}
        """
        
        tuple_list = []
        headers = df.columns.tolist()
        import uuid
        
        # Track seen IDs in this batch to prevent unintended overwrites
        seen_ids = set()
        
        for _, row in df.iterrows():
            vals = []
            row_id = str(row[pk]) if pk in headers and row[pk] is not None else None
            
            # If ID is missing, a placeholder, or a duplicate in THIS batch, generate a unique one
            # unless the user specifically wants UPSERT on a real ID.
            # We treat '00000000-000' as a placeholder signal for auto-gen.
            if not row_id or row_id in ['00000000-000', 'NULL', 'null', 'None', ''] or row_id in seen_ids:
                row_id = f"{'PH' if table_name == 'customer_plan_history' else 'BC'}-{uuid.uuid4().hex[:10]}"
            
            seen_ids.add(row_id)
            
            for col in cols:
                if col == pk:
                    vals.append(row_id)
                else:
                    val = row[col] if col in headers else None
                    vals.append(val)
            tuple_list.append(tuple(vals))
            
        cur.executemany(query, tuple_list)
        db.commit()
        
        return {
            "status": "success", 
            "rows_processed": len(df),
            "rows_skipped_null_pk": skipped_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error during batch ingestion: {e}")
    finally:
        cur.close()
