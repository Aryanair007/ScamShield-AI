from typing import List
from fastapi import APIRouter, HTTPException
from backend.app.models.scan import ScanResponse
from backend.app.database.connection import db_repository

router = APIRouter(prefix="/api/scans", tags=["Scans"])

@router.get("", response_model=List[ScanResponse])
def get_scans(limit: int = 50):
    scans = db_repository.get_all_scans(limit=limit)
    return scans

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan_by_id(scan_id: str):
    scan = db_repository.get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return scan
