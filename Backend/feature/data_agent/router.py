from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List, Dict, Any
import pandas as pd
import io
from service.database import get_db
from .schemas import UploadResponse, BatchHealth, ErrorBreakdown, BatchSummary, SystemStats
from collections import defaultdict
import uuid
import datetime
import re

router = APIRouter(prefix="/api/data-agent", tags=["data-agent"])

# Table mapping with batch columns
TABLE_MAPPING = {
    "cdr": {
        "pk": "cdr_id",
        "cols": [
            "cdr_id", "customer_id", "msisdn", "imsi", "imei", "event_type", 
            "call_type", "direction", "event_start_time", "event_end_time", 
            "event_date", "event_hour", "duration_seconds", "data_volume_uplink_bytes", 
            "data_volume_downlink_bytes", "sms_count", "destination_number", 
            "network_type", "roaming_flag", "cell_id", "location_area", "switch_id", 
            "apn", "qos_class", "session_id", "source_system", "record_status", 
            "checksum", "inter_operator_flag", "batch_id", "error_reason"
        ]
    },
    "sms_detail": {
        "pk": "sms_detail_id",
        "cols": [
            "sms_detail_id", "cdr_id", "customer_id", "sms_type", "destination_msisdn",
            "sms_category", "is_premium_sms", "segment_count", "delivery_status",
            "operator_charge", "created_at", "record_status", "batch_id", "error_reason"
        ]
    },
    "data_session": {
        "pk": "session_detail_id",
        "cols": [
            "session_detail_id", "cdr_id", "customer_id", "session_id", "upload_bytes",
            "download_bytes", "total_bytes", "session_mb", "normal_mb", "overage_mb",
            "apn", "network_type", "qos_class", "fup_triggered", "throttled_flag",
            "session_start_time", "session_end_time", "cell_id", "created_at", "record_status",
            "batch_id", "error_reason"
        ]
    }
}

def generate_next_batch_id(db):
    cur = db.cursor()
    # Find the latest ID that matches our new format
    cur.execute("SELECT batch_id FROM data_agent_batches WHERE batch_id LIKE 'Batch-%' ORDER BY created_at DESC LIMIT 1")
    row = cur.fetchone()
    cur.close()
    
    if not row:
        return "Batch-01"
    
    last_id = row[0]
    # Extract the number and increment
    try:
        current_num = int(last_id.split('-')[1])
        return f"Batch-{current_num + 1:02d}"
    except (IndexError, ValueError):
        return "Batch-01"

@router.post("/upload", response_model=UploadResponse)
async def upload_data_batch(
    target_type: str = Form(...),
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    if target_type not in TABLE_MAPPING:
        raise HTTPException(status_code=400, detail="Invalid target_type.")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {e}")
        
    df = df.where(pd.notnull(df), None)
    table_info = TABLE_MAPPING[target_type]
    cols, pk = table_info["cols"], table_info["pk"]
    
    cur = db.cursor()
    # PRE-FETCH METADATA
    cur.execute("SELECT customer_id FROM customers")
    valid_customer_ids = {row[0] for row in cur.fetchall()}
    cur.execute(f"SELECT {pk} FROM {target_type}")
    existing_pks = {row[0] for row in cur.fetchall()}
    
    batch_id = generate_next_batch_id(db)
    
    # COUNTERS
    stats = {"VALID": 0, "REJECTED": 0, "DUPLICATE": 0, "TOTAL": len(df)}
    error_breakdown = defaultdict(int)
    
    records_to_insert = []
    seen_in_batch = set()
    
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        row_pk = str(row_dict.get(pk)) if row_dict.get(pk) else None
        
        errors = []
        status = "VALID"
        
        # 1. MANDATORY CHECKS
        if not row_dict.get("msisdn") and target_type == "cdr":
            errors.append("Missing MSISDN")
        if not row_dict.get("event_start_time") and target_type == "cdr":
            errors.append("Missing Start Time")
            
        # 2. TYPE/RANGE CHECKS
        for num_col in ["duration_seconds", "data_volume_uplink_bytes", "upload_bytes"]:
            val = row_dict.get(num_col)
            if val is not None:
                try:
                    if float(val) < 0: errors.append(f"Negative {num_col}")
                except: errors.append(f"Invalid {num_col} format")
                
        # 3. LOGICAL CHECKS
        s_time = row_dict.get("event_start_time") or row_dict.get("session_start_time")
        e_time = row_dict.get("event_end_time") or row_dict.get("session_end_time")
        if s_time and e_time:
            try:
                # Basic string compare if not parsed, but here we just flag if end < start
                if str(e_time) < str(s_time): errors.append("End Time < Start Time")
            except: pass
            
        # 4. REFERENTIAL INTEGRITY
        c_id = row_dict.get("customer_id")
        if c_id and c_id not in valid_customer_ids:
            errors.append("Customer ID not in master")
            
        # 5. DUPLICATE DETECTION
        if row_pk:
            if row_pk in existing_pks or row_pk in seen_in_batch:
                status = "DUPLICATE"
                errors.append("Duplicate ID")
            else:
                seen_in_batch.add(row_pk)
        else:
            errors.append("Missing Primary Key")
            status = "REJECTED"

        if status != "DUPLICATE" and errors:
            status = "REJECTED"
            
        # Finalize status mapping for record
        stats[status] += 1
        for e in errors: error_breakdown[e] += 1
        
        row_dict["record_status"] = status
        row_dict["batch_id"] = batch_id
        row_dict["error_reason"] = "; ".join(errors) if errors else None
        
        # Ensure PK is handled for duplicates (UPSERT-like or unique)
        if status == "DUPLICATE":
            row_dict[pk] = f"DUP-{uuid.uuid4().hex[:8]}" 

        records_to_insert.append(tuple(row_dict.get(col) for col in cols))
        
    # BATCH INSERT
    try:
        placeholders = ", ".join(["%s"] * len(cols))
        cur.executemany(f"INSERT INTO {target_type} ({', '.join(cols)}) VALUES ({placeholders})", records_to_insert)
        
        # LOG METADATA
        v_perc = round((stats["VALID"] / stats["TOTAL"]) * 100, 2) if stats["TOTAL"] > 0 else 0
        cur.execute("""
            INSERT INTO data_agent_batches 
            (batch_id, target_type, file_name, total_records, valid_records, rejected_records, duplicate_records, valid_percentage)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (batch_id, target_type, file.filename, stats["TOTAL"], stats["VALID"], stats["REJECTED"], stats["DUPLICATE"], v_perc))
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cur.close()

    # FORM RESPONSE
    return UploadResponse(
        status="success",
        message=f"Batch {batch_id} processed successfully.",
        batch_health=BatchHealth(
            total_records=stats["TOTAL"],
            valid_records=stats["VALID"],
            rejected_records=stats["REJECTED"],
            duplicate_records=stats["DUPLICATE"],
            valid_percentage=v_perc
        ),
        error_breakdown=[ErrorBreakdown(error_type=k, affected_count=v, severity="High", action="Audit") for k, v in error_breakdown.items()]
    )

@router.get("/stats", response_model=SystemStats)
async def get_system_stats(db=Depends(get_db)):
    cur = db.cursor()
    try:
        cur.execute("SELECT COUNT(*), AVG(valid_percentage), SUM(total_records), SUM(rejected_records) FROM data_agent_batches")
        row = cur.fetchone()
        
        cur.execute("""
            SELECT batch_id, target_type, total_records, valid_records, rejected_records, valid_percentage, created_at 
            FROM data_agent_batches ORDER BY created_at DESC LIMIT 10
        """)
        trend = [BatchSummary(batch_id=r[0], target_type=r[1], total=r[2], valid=r[3], rejected=r[4], percentage=float(r[5]), timestamp=r[6].strftime("%Y-%m-%d %H:%M")) for r in cur.fetchall()]
        
        return SystemStats(
            total_batches=row[0] or 0,
            overall_health=round(float(row[1] or 0), 2),
            total_volume=int(row[2] or 0),
            critical_alerts=int(row[3] or 0),
            historical_trend=trend[::-1],
            error_distribution=[{"name": "Missing Data", "value": 40}, {"name": "Logical Error", "value": 30}, {"name": "Ref Integrity", "value": 30}]
        )
    finally:
        cur.close()
