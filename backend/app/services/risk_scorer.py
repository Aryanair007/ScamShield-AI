from typing import Dict, Any, List
from backend.app.ml.predictor import ml_predictor
from backend.app.services.rule_engine import rule_engine
from backend.app.services.url_analyzer import url_analyzer

class RiskScorer:
    def analyze_message(self, text: str) -> Dict[str, Any]:
        # 1. Run ML Prediction
        ml_res = ml_predictor.predict(text)
        scam_prob = ml_res.get("scam_probability", 0.5)

        # 2. Run Security Rule Engine
        rule_res = rule_engine.analyze(text)
        rule_score = rule_res.get("rule_score", 0)

        # 3. Analyze embedded URLs if present
        urls = rule_res.get("urls", [])
        url_score = 0
        url_reasons = []
        url_indicators = []

        if urls:
            first_url = urls[0]
            url_res = url_analyzer.analyze(first_url)
            url_score = url_res.get("url_score", 0)
            url_reasons = url_res.get("reasons", [])
            url_indicators = url_res.get("indicators", [])

        # 4. Hybrid Risk Score Calculation
        if urls:
            raw_score = (scam_prob * 35) + (rule_score * 0.40) + (url_score * 0.25)
        else:
            raw_score = (scam_prob * 45) + (rule_score * 0.55)

        final_risk_score = int(round(min(100, max(0, raw_score))))

        # 5. Classify Prediction & Risk Level
        if final_risk_score >= 61:
            prediction = "SCAM"
            risk_level = "HIGH RISK"
        elif final_risk_score >= 31:
            prediction = "SUSPICIOUS"
            risk_level = "MEDIUM RISK"
        else:
            prediction = "SAFE"
            risk_level = "LOW RISK"

        # 6. Confidence Calculation
        # Higher confidence when ML and Rules agree
        ml_score_scale = scam_prob * 100
        diff = abs(ml_score_scale - rule_score)
        base_confidence = 95 - (diff * 0.25)
        confidence = int(round(min(98, max(70, base_confidence))))

        # Combine all reasons & indicators
        all_reasons = rule_res.get("reasons", []) + url_reasons
        all_indicators = rule_res.get("indicators", []) + url_indicators

        if not all_reasons and prediction == "SAFE":
            all_reasons.append("No suspicious urgency, prize claims, or credential requests detected")
            all_reasons.append("Standard conversational language pattern")

        # 7. Actionable Recommendation Generation
        recommendation = self._generate_recommendation(prediction, final_risk_score, all_indicators)

        return {
            "prediction": prediction,
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "reasons": list(dict.fromkeys(all_reasons)), # Deduplicate
            "indicators": all_indicators,
            "recommendation": recommendation
        }

    def analyze_url(self, url_str: str) -> Dict[str, Any]:
        # 1. Run URL Analyzer
        url_res = url_analyzer.analyze(url_str)
        url_score = url_res.get("url_score", 0)

        # 2. Run ML Prediction on URL text context
        ml_res = ml_predictor.predict(url_str)
        scam_prob = ml_res.get("scam_probability", 0.5)

        # Hybrid formula for URL
        raw_score = (url_score * 0.70) + (scam_prob * 30)
        final_risk_score = int(round(min(100, max(0, raw_score))))

        if final_risk_score >= 61:
            prediction = "SCAM"
            risk_level = "HIGH RISK"
        elif final_risk_score >= 31:
            prediction = "SUSPICIOUS"
            risk_level = "MEDIUM RISK"
        else:
            prediction = "SAFE"
            risk_level = "LOW RISK"

        confidence = int(round(min(96, max(75, 88 + (url_score * 0.1)))))

        reasons = url_res.get("reasons", [])
        if not reasons and prediction == "SAFE":
            reasons.append("Standard HTTPS protocol configured")
            reasons.append("Legitimate domain name structure detected")

        recommendation = self._generate_recommendation(prediction, final_risk_score, url_res.get("indicators", []))

        return {
            "prediction": prediction,
            "risk_score": final_risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "reasons": list(dict.fromkeys(reasons)),
            "indicators": url_res.get("indicators", []),
            "recommendation": recommendation
        }

    def _generate_recommendation(self, prediction: str, score: int, indicators: List[Dict[str, Any]]) -> str:
        if prediction == "SCAM":
            return "Do not click any links, share OTPs, or transfer funds. Report the sender and verify details only through official verified contact numbers."
        elif prediction == "SUSPICIOUS":
            return "Exercise caution. Double-check the sender's identity or official website before opening links or responding."
        else:
            return "This message appears low-risk. However, always exercise standard security caution when clicking links or sharing personal data."

risk_scorer = RiskScorer()
