import os
import sys
import joblib

def predict_message(text: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "saved_model", "scam_model.pkl")
    vectorizer_path = os.path.join(script_dir, "saved_model", "tfidf_vectorizer.pkl")

    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        print("Error: Saved model or vectorizer not found. Run train_model.py first.")
        sys.exit(1)

    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)

    clean_text = text.lower().strip()
    features = vectorizer.transform([clean_text])
    probabilities = model.predict_proba(features)[0]

    scam_prob = probabilities[1]
    safe_prob = probabilities[0]
    prediction = "SCAM" if scam_prob >= 0.5 else "SAFE"

    print("=" * 50)
    print(f"Input Text  : {text}")
    print(f"Prediction  : {prediction}")
    print(f"Scam Prob   : {scam_prob * 100:.1f}%")
    print(f"Safe Prob   : {safe_prob * 100:.1f}%")
    print("=" * 50)

    return {
        "prediction": prediction,
        "scam_probability": float(scam_prob),
        "safe_probability": float(safe_prob)
    }

if __name__ == "__main__":
    sample_text = sys.argv[1] if len(sys.argv) > 1 else "Congratulations! You won ₹50,000. Click here to claim your prize immediately."
    predict_message(sample_text)
