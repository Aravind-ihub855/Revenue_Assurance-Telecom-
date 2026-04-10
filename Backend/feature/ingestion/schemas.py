from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List

class PlanHistoryIngest(BaseModel):
    plan_history_id: str
    customer_id: str
    plan_id: str
    activation_date: Optional[date] = None
    expiry_date: Optional[date] = None
    plan_status: Optional[str] = None
    change_type: Optional[str] = None
    previous_plan_id: Optional[str] = None
    auto_renewal_flag: Optional[bool] = None
    recharge_amount: Optional[float] = None
    recharge_type: Optional[str] = None
    source_channel: Optional[str] = None
    is_current_plan: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class BillingCycleIngest(BaseModel):
    cycle_id: str
    customer_id: str
    billing_cycle_day: Optional[int] = None
    cycle_start_date: Optional[date] = None
    cycle_end_date: Optional[date] = None
    bill_generation_date: Optional[date] = None
    billing_status: Optional[str] = None
    total_amount: Optional[float] = None
    due_date: Optional[date] = None
    payment_status: Optional[str] = None
    payment_date: Optional[date] = None
    late_fee: Optional[float] = None
    adjustment_amount: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class IngestionPreviewResponse(BaseModel):
    table_name: str
    headers: List[str]
    preview_data: List[dict]
    total_rows: int
    validation_errors: List[str]
    is_valid: bool
