from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import analyze, scans, stats

app = FastAPI(
    title="ScamShield AI API",
    description="AI-Powered Scam & Phishing Detection System API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analyze.router)
app.include_router(scans.router)
app.include_router(stats.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "ScamShield AI",
        "version": "1.0.0",
        "tagline": "Know before you click.",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
