import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def train_and_save_model():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, "dataset", "scam_dataset.csv")
    model_dir = os.path.join(script_dir, "saved_model")
    backend_ml_dir = os.path.join(script_dir, "..", "backend", "app", "ml")

    os.makedirs(model_dir, exist_ok=True)
    os.makedirs(backend_ml_dir, exist_ok=True)

    print(f"[ML Train] Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    # Clean text column
    df["clean_text"] = df["text"].astype(str).str.lower().str.strip()

    X = df["clean_text"]
    y = df["label"]

    print(f"[ML Train] Dataset contains {len(df)} records ({sum(y == 1)} scam, {sum(y == 0)} safe).")

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2500,
        stop_words="english",
        sublinear_tf=True
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Logistic Regression Classifier
    model = LogisticRegression(C=2.0, max_iter=500, random_state=42)
    model.fit(X_train_tfidf, y_train)

    # Evaluate Model
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"[ML Train] Test Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=["Safe", "Scam"]))

    # Fit vectorizer & model on full dataset for maximum performance in production
    X_full_tfidf = vectorizer.fit_transform(X)
    model.fit(X_full_tfidf, y)

    # Save artifacts
    model_path = os.path.join(model_dir, "scam_model.pkl")
    vectorizer_path = os.path.join(model_dir, "tfidf_vectorizer.pkl")

    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    # Also save to backend directory for direct import
    joblib.dump(model, os.path.join(backend_ml_dir, "scam_model.pkl"))
    joblib.dump(vectorizer, os.path.join(backend_ml_dir, "tfidf_vectorizer.pkl"))

    print(f"[ML Train] Saved model & vectorizer successfully to:\n - {model_dir}\n - {backend_ml_dir}")

if __name__ == "__main__":
    train_and_save_model()
