import os
import joblib
from backend.app.utils.text_cleaner import clean_text

class MLPredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
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
            try:
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                self.is_loaded = True
                print(f"[ML Engine] Model & TF-IDF Vectorizer loaded successfully.")
            except Exception as e:
                print(f"[ML Engine Error] Failed to load trained model: {e}")
        else:
            print(f"[ML Engine Warning] Saved model files not found at {model_path}. Using heuristic fallback.")

    def predict(self, text: str) -> dict:
        """
        Runs ML prediction on input text.
        Returns dictionary with scam_probability (0.0 to 1.0) and safe_probability (0.0 to 1.0).
        """
        if not self.is_loaded or self.model is None or self.vectorizer is None:
            # Fallback estimation if model file is unavailable
            return {"scam_probability": 0.5, "safe_probability": 0.5, "fallback": True}

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

ml_predictor = MLPredictor()
