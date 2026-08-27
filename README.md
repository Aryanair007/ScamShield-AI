# ScamShield AI — AI-Powered Scam & Phishing Detection System

> **Tagline**: *Know before you click.*  
> **Target Audience**: College Technical Event Demonstration & Consumer Digital Security Defense

---

## 1. Problem Statement & Motivation
Digital social engineering attacks across SMS, WhatsApp, and email platforms continue to deceive millions of users worldwide. Scammers leverage psychological pressure—such as artificial urgency, fake lottery rewards, unauthorized bank blockage threats, and fake job offers—to trick victims into clicking malicious phishing links or disclosing OTPs and credentials.

**ScamShield AI** serves as an intelligent **digital second opinion**, evaluating suspicious content using a hybrid AI engine (NLP Machine Learning + Heuristic Security Rules + URL Inspection) before users click links or respond.

---

## 2. System Architecture Flow

```
   User Input (Message / URL / Image)
                 ↓
      React + Vite Frontend (UI)
                 ↓
     FastAPI Backend (REST API)
                 ↓
     NLP Processing & Vectorization
                 ↓
 ┌───────────────────────────────────────┐
 │   Hybrid Risk Evaluation Engine       │
 │ ├─ TF-IDF + Logistic Regression Model │
 │ ├─ Security Rule Engine (8 Signals)   │
 │ └─ URL Technical Risk Inspector       │
 └───────────────────────────────────────┘
                 ↓
    Risk Score Calculation (0 – 100)
                 ↓
 Explainable Result + Recommendations
                 ↓
 MongoDB Atlas / Fallback Store
                 ↓
   Live Dashboard & Scan History
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Custom Vanilla CSS (Minimal, Light Neutral Fintech Aesthetic)
- **HTTP Client**: Axios
- **Routing**: React Router DOM (`v6`)
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.11 + FastAPI
- **Server**: Uvicorn
- **Validation**: Pydantic `v2`
- **Data & ML**: `scikit-learn`, `pandas`, `numpy`, `joblib`
- **Database Driver**: `pymongo` (MongoDB Atlas + In-Memory Fallback Repository)
- **OCR / Image**: Pillow (PIL)

---

## 4. Project Structure

```
ScamShield-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   ├── SecurityVisual.jsx
│   │   │   └── SampleLoader.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analyze.jsx
│   │   │   ├── History.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── connection.py
│   │   ├── models/
│   │   │   └── scan.py
│   │   ├── ml/
│   │   │   ├── predictor.py
│   │   │   ├── scam_model.pkl
│   │   │   └── tfidf_vectorizer.pkl
│   │   ├── services/
│   │   │   ├── rule_engine.py
│   │   │   ├── url_analyzer.py
│   │   │   ├── risk_scorer.py
│   │   │   └── ocr_service.py
│   │   ├── routes/
│   │   │   ├── analyze.py
│   │   │   ├── scans.py
│   │   │   └── stats.py
│   │   ├── utils/
│   │   │   └── text_cleaner.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
├── ml/
│   ├── dataset/
│   │   └── scam_dataset.csv
│   ├── train_model.py
│   ├── predict.py
│   └── saved_model/
└── README.md
```

---

## 5. Machine Learning & Risk Scoring Engine

### ML Methodology
1. **Preprocessing**: Case normalization, whitespace stripping, token cleaning.
2. **Feature Extraction**: TF-IDF Vectorization (`ngram_range=(1, 2)`, `max_features=2500`, `stop_words='english'`).
3. **Classification**: Logistic Regression (`C=2.0`, `max_iter=500`).
4. **Serialization**: Pipeline saved using `joblib` into `.pkl` binaries.

### Security Rule Engine Signals
- **Urgency & Pressure**: Detects high-pressure keywords (`URGENT`, `immediately`, `within 2 hours`).
- **Prize & Reward Language**: Identifies sweepstakes/lottery claims (`won ₹50,000`, `lucky draw`).
- **Bank & Account Freeze Threats**: Detects fake KYC update demands and deactivation threats.
- **Credential & OTP Harvesting**: Flags requests for PINs, passwords, netbanking credentials, and OTPs.
- **Upfront Payment Demands**: Flags registration fees, delivery charges, or bitcoin deposits.
- **Unrealistic Financial Offers**: Flags guaranteed 500% returns or instant 0% loans.

### Transparent Risk Score Formula (0 – 100)
$$\text{Risk Score} = (\text{ML Scam Prob} \times 45) + (\text{Rule Engine Score} \times 0.40) + (\text{URL Risk Score} \times 0.15)$$

- **0 – 30**: **LOW RISK** (`SAFE`)
- **31 – 60**: **SUSPICIOUS** (`MEDIUM RISK`)
- **61 – 100**: **HIGH RISK** (`SCAM`)

---

## 6. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/analyze/message` | Analyzes SMS/WhatsApp/Email text |
| `POST` | `/api/analyze/url` | Analyzes URL hostname, protocol, and TLD |
| `POST` | `/api/analyze/image` | Extracts text from screenshot via OCR and analyzes |
| `GET` | `/api/scans` | Retrieves historical scan logs |
| `GET` | `/api/scans/{id}` | Retrieves full details for a specific scan record |
| `GET` | `/api/dashboard/stats` | Calculates total, scam, suspicious, and safe statistics |

---

## 7. Installation & Running Instructions

### Prerequisites
- Node.js (v18+) & npm
- Python 3.11+

### 1. Train the Machine Learning Model
```bash
python ml/train_model.py
```

### 2. Run FastAPI Backend Server
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --port 8000 --reload
```
*Backend interactive API documentation: `http://127.0.0.1:8000/docs`*

### 3. Run React Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend web application: `http://localhost:5173/`*

---

## 8. Safety & Academic Disclaimer
ScamShield AI generates automated risk scores based on machine learning probability models and security rule evaluation heuristics. Output results serve as an educational risk assessment tool and do not constitute a legal or absolute guarantee of fraud.
