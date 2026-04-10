from fastapi import APIRouter, Depends, HTTPException
from typing import List
from service.database import get_db
from .schemas import CustomerResponse

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/", response_model=List[CustomerResponse])
def get_customers(db=Depends(get_db)):
    """Fetch all customers from the customers table."""
    cur = db.cursor()
    try:
        cur.execute("""
            SELECT 
                customer_id, msisdn, name, email, gender, account_type, 
                location_telecom_circle, device_type, billing_cycle_day, 
                credit_limit, plan_id, account_status, activation_date, 
                deactivation_date, created_at
            FROM customers
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        
        customers = []
        for row in rows:
            customers.append({
                "customer_id": row[0],
                "msisdn": str(row[1]),
                "name": row[2],
                "email": row[3],
                "gender": row[4],
                "account_type": row[5],
                "location_telecom_circle": row[6],
                "device_type": row[7],
                "billing_cycle_day": row[8],
                "credit_limit": row[9],
                "plan_id": row[10],
                "account_status": row[11],
                "activation_date": row[12],
                "deactivation_date": row[13],
                "created_at": row[14]
            })
        return customers
    except Exception as e:
        print(f"Error fetching customers: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str, db=Depends(get_db)):
    """Fetch a specific customer by ID."""
    cur = db.cursor()
    try:
        cur.execute("""
            SELECT 
                customer_id, msisdn, name, email, gender, account_type, 
                location_telecom_circle, device_type, billing_cycle_day, 
                credit_limit, plan_id, account_status, activation_date, 
                deactivation_date, created_at
            FROM customers
            WHERE customer_id = %s
        """, (customer_id,))
        row = cur.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Customer not found")
            
        return {
            "customer_id": row[0],
            "msisdn": str(row[1]),
            "name": row[2],
            "email": row[3],
            "gender": row[4],
            "account_type": row[5],
            "location_telecom_circle": row[6],
            "device_type": row[7],
            "billing_cycle_day": row[8],
            "credit_limit": row[9],
            "plan_id": row[10],
            "account_status": row[11],
            "activation_date": row[12],
            "deactivation_date": row[13],
            "created_at": row[14]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching customer {customer_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
