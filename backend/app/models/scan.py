from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class MessageAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Message text to analyze")
    user_id: Optional[str] = "demo_user"

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, description="URL string to analyze")
    user_id: Optional[str] = "demo_user"

class DetectedIndicator(BaseModel):
    category: str
    label: str
    severity: str  # low, medium, high
    description: str

class ScanResponse(BaseModel):
    id: str
    scan_type: str  # message, url, image
    input: str
    prediction: str  # SAFE, SUSPICIOUS, SCAM
    risk_score: int  # 0 to 100
    risk_level: str  # LOW RISK, SUSPICIOUS / MEDIUM RISK, HIGH RISK
    confidence: int  # 0 to 100 percentage
    reasons: List[str]
    indicators: List[DetectedIndicator]
    recommendation: str
    created_at: str

class DashboardStatsResponse(BaseModel):
    total_scans: int
    scam_detections: int
    suspicious_detections: int
    safe_detections: int
    recent_scans: List[ScanResponse]
