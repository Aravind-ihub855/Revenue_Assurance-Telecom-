from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class CustomerResponse(BaseModel):
    customer_id: str
    msisdn: str
    name: str
    email: str
    gender: str
    account_type: str
    location_telecom_circle: str
    device_type: str
    billing_cycle_day: int
    credit_limit: Optional[float]
    plan_id: str
    account_status: str
    activation_date: str
    deactivation_date: Optional[str]
    created_at: str

    class Config:
        from_attributes = True
