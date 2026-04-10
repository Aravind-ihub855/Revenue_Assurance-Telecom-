from fastapi import APIRouter, Depends, HTTPException, status
import psycopg2.extras
from typing import List

from service.database import get_db
import feature.tariff_plan.schemas as schemas

router = APIRouter(prefix="/api/tariffs", tags=["Tariff Plans"])

@router.get("/", response_model=List[schemas.TariffPlanResponse])
def get_all_tariffs(conn=Depends(get_db)):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT * FROM tariff_plan ORDER BY plan_id ASC")
        plans = cur.fetchall()
        return plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()

@router.get("/{plan_id}", response_model=schemas.TariffPlanResponse)
def get_tariff_detail(plan_id: str, conn=Depends(get_db)):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT * FROM tariff_plan WHERE plan_id = %s", (plan_id,))
        plan = cur.fetchone()
        if not plan:
            raise HTTPException(status_code=404, detail="Tariff plan not found")
        return plan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
