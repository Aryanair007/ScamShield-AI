from fastapi import APIRouter
from backend.app.models.scan import DashboardStatsResponse
from backend.app.database.connection import db_repository

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats():
    stats = db_repository.get_stats()
    return stats
