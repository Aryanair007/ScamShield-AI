from fastapi import APIRouter, HTTPException, File, UploadFile
from backend.app.models.scan import MessageAnalysisRequest, UrlAnalysisRequest, ScanResponse
from backend.app.services.risk_scorer import risk_scorer
from backend.app.services.ocr_service import ocr_service
from backend.app.database.connection import db_repository

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("/message", response_model=ScanResponse)
def analyze_message(payload: MessageAnalysisRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Message text cannot be empty.")

    analysis = risk_scorer.analyze_message(payload.text)
    scan_doc = {
        "scan_type": "message",
        "input": payload.text,
        "prediction": analysis["prediction"],
        "risk_score": analysis["risk_score"],
        "risk_level": analysis["risk_level"],
        "confidence": analysis["confidence"],
        "reasons": analysis["reasons"],
        "indicators": analysis["indicators"],
        "recommendation": analysis["recommendation"]
    }

    saved = db_repository.save_scan(scan_doc)
    return saved

@router.post("/url", response_model=ScanResponse)
def analyze_url(payload: UrlAnalysisRequest):
    if not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL input cannot be empty.")

    analysis = risk_scorer.analyze_url(payload.url)
    scan_doc = {
        "scan_type": "url",
        "input": payload.url,
        "prediction": analysis["prediction"],
        "risk_score": analysis["risk_score"],
        "risk_level": analysis["risk_level"],
        "confidence": analysis["confidence"],
        "reasons": analysis["reasons"],
        "indicators": analysis["indicators"],
        "recommendation": analysis["recommendation"]
    }

    saved = db_repository.save_scan(scan_doc)
    return saved

@router.post("/image", response_model=ScanResponse)
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    analysis = ocr_service.extract_and_analyze(contents)
    scan_doc = {
        "scan_type": "image",
        "input": analysis.get("extracted_text", file.filename),
        "prediction": analysis["prediction"],
        "risk_score": analysis["risk_score"],
        "risk_level": analysis["risk_level"],
        "confidence": analysis["confidence"],
        "reasons": analysis["reasons"],
        "indicators": analysis.get("indicators", []),
        "recommendation": analysis["recommendation"]
    }

    saved = db_repository.save_scan(scan_doc)
    return saved
