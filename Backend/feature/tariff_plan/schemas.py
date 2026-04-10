from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class TariffPlanBase(BaseModel):
    plan_id: str
    plan_name: str
    plan_category: str
    account_type: str
    plan_price: int
    validity_days: int
    validity_type: str
    voice_unlimited_flag: bool
    free_voice_local_min: int
    free_voice_std_min: int
    free_voice_isd_min: int
    daily_data_mb: int
    free_sms_per_day: int
    free_sms_total: int
    post_fup_speed_kbps: int
    is_unlimited_plan: bool
    is_5g_plan: bool
    is_data_only_plan: bool
    roaming_included: bool
    overage_rate_per_gb: int
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None

class TariffPlanResponse(TariffPlanBase):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
