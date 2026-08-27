import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("DB_NAME", "scamshield_db")

# In-memory storage fallback for seamless offline demo execution
_IN_MEMORY_SCANS: List[Dict[str, Any]] = []

def seed_demo_data():
    if _IN_MEMORY_SCANS:
        return
    now = datetime.now(timezone.utc).isoformat()
    demo_scans = [
        {
            "id": str(uuid.uuid4()),
            "scan_type": "message",
            "input": "Congratulations! You have won ₹50,000 in Tata Lucky Draw. Claim your prize immediately by clicking https://tata-win-prize.claim-now.top",
            "prediction": "SCAM",
            "risk_score": 92,
            "risk_level": "HIGH RISK",
            "confidence": 94,
            "reasons": [
                "Prize/reward language detected",
                "Urgency & immediate action pressure detected",
                "Suspicious untrusted link detected",
                "Financial incentive language detected"
            ],
            "indicators": [
                {"category": "Prize Claim", "label": "Prize Language", "severity": "high", "description": "Mentions winning ₹50,000 cash or lottery prize."},
                {"category": "Urgency", "label": "Time Pressure", "severity": "medium", "description": "Urges immediate action to claim reward."},
                {"category": "Suspicious Link", "label": "Untrusted Domain", "severity": "high", "description": "Contains untrusted domain with non-standard TLD (.top)."}
            ],
            "recommendation": "Do not click the link or share personal or bank details. Official sweepstakes never request link clicks via SMS.",
            "created_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "scan_type": "message",
            "input": "URGENT: Your HDFC bank account has been blocked due to missing KYC updates. Update now at http://hdfc-bank-verify-kyc.net or account will be closed.",
            "prediction": "SCAM",
            "risk_score": 88,
            "risk_level": "HIGH RISK",
            "confidence": 91,
            "reasons": [
                "Bank account suspension threat detected",
                "Phishing credential harvesting link detected",
                "Urgent panic language detected",
                "Insecure HTTP protocol used"
            ],
            "indicators": [
                {"category": "Account Threat", "label": "Bank Block Threat", "severity": "high", "description": "Claims bank account will be closed unless KYC updated."},
                {"category": "Phishing Link", "label": "Typosquatting Domain", "severity": "high", "description": "Impersonates HDFC Bank using suspicious domain format."}
            ],
            "recommendation": "Do not click the link. Contact HDFC Bank directly using the official phone number on your bank card.",
            "created_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "scan_type": "url",
            "input": "http://192.168.1.105/auth-login-verify/bank",
            "prediction": "SCAM",
            "risk_score": 85,
            "risk_level": "HIGH RISK",
            "confidence": 89,
            "reasons": [
                "Raw IP address used instead of legitimate domain name",
                "Insecure HTTP protocol without encryption",
                "Suspicious authentication path detected"
            ],
            "indicators": [
                {"category": "IP Hostname", "label": "Raw IP Host", "severity": "high", "description": "Uses direct IP address, typical of phishing servers."},
                {"category": "Insecure Connection", "label": "HTTP Connection", "severity": "medium", "description": "Lacks SSL encryption certificate."}
            ],
            "recommendation": "Avoid visiting this IP address. Legitimate financial institutions never ask users to log into raw IP addresses.",
            "created_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "scan_type": "message",
            "input": "Hi Team, please review the attached document for tomorrow's project presentation. Thanks!",
            "prediction": "SAFE",
            "risk_score": 10,
            "risk_level": "LOW RISK",
            "confidence": 96,
            "reasons": [
                "Normal professional conversation tone",
                "No suspicious links or calls to action detected",
                "No financial or credential requests"
            ],
            "indicators": [],
            "recommendation": "This message appears safe. Standard workplace message.",
            "created_at": now
        }
    ]
    _IN_MEMORY_SCANS.extend(demo_scans)

seed_demo_data()

class ScanRepository:
    def __init__(self):
        self.db = None
        self.collection = None
        if MONGODB_URI:
            try:
                import pymongo
                self.client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
                # Quick test connection
                self.client.admin.command('ping')
                self.db = self.client[DB_NAME]
                self.collection = self.db["scans"]
                print(f"[Database] Connected successfully to MongoDB Atlas database: {DB_NAME}")
            except Exception as e:
                print(f"[Database] MongoDB Atlas connection failed ({e}). Using in-memory repository fallback.")
                self.db = None
                self.collection = None

    def save_scan(self, scan_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in scan_data:
            scan_data["id"] = str(uuid.uuid4())
        if "created_at" not in scan_data:
            scan_data["created_at"] = datetime.now(timezone.utc).isoformat()

        if self.collection is not None:
            try:
                doc = scan_data.copy()
                doc["_id"] = doc["id"]
                self.collection.insert_one(doc)
                return scan_data
            except Exception as e:
                print(f"[Database Error] Insert failed: {e}. Falling back to in-memory store.")

        _IN_MEMORY_SCANS.insert(0, scan_data)
        return scan_data

    def get_all_scans(self, limit: int = 50) -> List[Dict[str, Any]]:
        if self.collection is not None:
            try:
                docs = list(self.collection.find({}, {"_id": 0}).sort("created_at", -1).limit(limit))
                return docs
            except Exception as e:
                print(f"[Database Error] Fetch failed: {e}. Falling back to in-memory store.")

        return _IN_MEMORY_SCANS[:limit]

    def get_scan_by_id(self, scan_id: str) -> Optional[Dict[str, Any]]:
        if self.collection is not None:
            try:
                doc = self.collection.find_one({"id": scan_id}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                print(f"[Database Error] Find failed: {e}. Falling back to in-memory store.")

        for item in _IN_MEMORY_SCANS:
            if item["id"] == scan_id:
                return item
        return None

    def get_stats(self) -> Dict[str, Any]:
        scans = self.get_all_scans(limit=1000)
        total = len(scans)
        scams = sum(1 for s in scans if s.get("prediction") == "SCAM")
        suspicious = sum(1 for s in scans if s.get("prediction") == "SUSPICIOUS")
        safe = sum(1 for s in scans if s.get("prediction") == "SAFE")
        recent = scans[:5]

        return {
            "total_scans": total,
            "scam_detections": scams,
            "suspicious_detections": suspicious,
            "safe_detections": safe,
            "recent_scans": recent
        }

db_repository = ScanRepository()
