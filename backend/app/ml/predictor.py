import os
from backend.app.utils.text_cleaner import clean_text

class MLPredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        try:
            import joblib
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(current_dir, "scam_model.pkl")
            vectorizer_path = os.path.join(current_dir, "tfidf_vectorizer.pkl")

            # Fallback locations
            alt_model_path = os.path.join(current_dir, "..", "..", "..", "ml", "saved_model", "scam_model.pkl")
            alt_vec_path = os.path.join(current_dir, "..", "..", "..", "ml", "saved_model", "tfidf_vectorizer.pkl")

            api_model_path = os.path.join(current_dir, "..", "..", "..", "api", "scam_model.pkl")
            api_vec_path = os.path.join(current_dir, "..", "..", "..", "api", "tfidf_vectorizer.pkl")

            if not os.path.exists(model_path):
                if os.path.exists(alt_model_path):
                    model_path = alt_model_path
                    vectorizer_path = alt_vec_path
                elif os.path.exists(api_model_path):
                    model_path = api_model_path
                    vectorizer_path = api_vec_path

            if os.path.exists(model_path) and os.path.exists(vectorizer_path):
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                self.is_loaded = True
                print(f"[ML Engine] Model & TF-IDF Vectorizer loaded successfully.")
            else:
                print(f"[ML Engine Warning] Saved model files not found. Using heuristic fallback.")
        except Exception as e:
            print(f"[ML Engine Warning] Heavy ML libraries unavailable in serverless environment ({e}). Using security engine fallback.")
            self.is_loaded = False

    def predict(self, text: str) -> dict:
        """
        Runs ML prediction on input text.
        Returns dictionary with scam_probability (0.0 to 1.0) and safe_probability (0.0 to 1.0).
        """
        if not self.is_loaded or self.model is None or self.vectorizer is None:
            # Fallback estimation based on text features
            cleaned = clean_text(text)
            scam_kw = ["urgent", "won", "prize", "bank", "kyc", "otp", "blocked", "claim", "reward", "lottery", "fee", "wire", "deposit", "password", "deactivated"]
            matches = sum(1 for kw in scam_kw if kw in cleaned)
            estimated_scam = min(0.95, max(0.05, 0.2 + (matches * 0.25)))
            return {
                "scam_probability": float(estimated_scam),
                "safe_probability": float(1.0 - estimated_scam),
                "fallback": True
            }

        try:
            normalized_text = clean_text(text)
            features = self.vectorizer.transform([normalized_text])
            probabilities = self.model.predict_proba(features)[0]

            safe_prob = float(probabilities[0])
            scam_prob = float(probabilities[1])

            return {
                "scam_probability": scam_prob,
                "safe_probability": safe_prob,
                "fallback": False
            }
        except Exception:
            return {"scam_probability": 0.5, "safe_probability": 0.5, "fallback": True}

ml_predictor = MLPredictor()
