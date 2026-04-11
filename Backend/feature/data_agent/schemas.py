from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ErrorBreakdown(BaseModel):
    error_type: str
    affected_count: int
    severity: str
    action: str

class BatchHealth(BaseModel):
    total_records: int
    valid_records: int
    rejected_records: int
    duplicate_records: int
    valid_percentage: float

class UploadResponse(BaseModel):
    status: str
    message: str
    batch_health: BatchHealth
    error_breakdown: List[ErrorBreakdown]

class BatchSummary(BaseModel):
    batch_id: str
    target_type: str
    total: int
    valid: int
    rejected: int
    percentage: float
    timestamp: str

class SystemStats(BaseModel):
    total_batches: int
    overall_health: float
    total_volume: int
    critical_alerts: int
    historical_trend: List[BatchSummary]
    error_distribution: List[Dict[str, Any]]
