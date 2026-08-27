import re
from typing import List, Dict, Any
from backend.app.utils.text_cleaner import clean_text, check_capitalization_ratio, extract_urls

class SecurityRuleEngine:
    def __init__(self):
        self.rules = [
            {
                "id": "PRIZE_LOTTERY",
                "category": "Prize Claim",
                "label": "Prize/Reward Claim Language",
                "severity": "high",
                "score_contribution": 25,
                "keywords": ["won", "winner", "prize", "lottery", "claim your prize", "lucky draw", "reward", "selected for", "gift card", "cash prize", "1,000,000th visitor", "kbc lottery", "jackpot"],
                "reason": "Prize or sweepstakes reward language detected"
            },
            {
                "id": "URGENCY_PRESSURE",
                "category": "Urgency",
                "label": "Urgency & Time Pressure",
                "severity": "medium",
                "score_contribution": 18,
                "keywords": ["urgent", "urgently", "immediately", "in 2 hours", "within 24 hours", "final warning", "action required", "expiring soon", "act fast", "right away", "before it is blocked"],
                "reason": "Artificial urgency and high-pressure language detected"
            },
            {
                "id": "BANK_ACCOUNT_THREAT",
                "category": "Account Threat",
                "label": "Bank / Account Freeze Threat",
                "severity": "high",
                "score_contribution": 30,
                "keywords": ["account blocked", "account suspended", "deactivated", "kyc update", "missing kyc", "pan card", "aadhaar", "sim deactivated", "netbanking blocked", "yono access", "sbi card blocked", "hdfc bank account", "power disconnection"],
                "reason": "Fake account blockage or emergency suspension threat detected"
            },
            {
                "id": "CREDENTIAL_OTP",
                "category": "Credential Request",
                "label": "OTP / Credential Harvesting Request",
                "severity": "high",
                "score_contribution": 35,
                "keywords": ["share otp", "enter otp", "verify password", "netbanking password", "pin number", "ssn", "cvv", "credit card details", "verify your identity", "confirm password"],
                "reason": "Direct request for OTP, PIN, password, or sensitive credentials"
            },
            {
                "id": "FINANCIAL_PAYMENT",
                "category": "Payment Request",
                "label": "Payment or Transfer Request",
                "severity": "high",
                "score_contribution": 22,
                "keywords": ["wire money", "transfer $", "transfer ₹", "registration fee", "shipping fee", "paytm", "gpay", "phonepe", "deposit bitcoin", "advance payment", "unpaid fee"],
                "reason": "Financial transfer request or upfront fee requirement detected"
            },
            {
                "id": "CRYPTO_JOB_SCAM",
                "category": "Too Good To Be True",
                "label": "Guaranteed Returns / Fake Job Offer",
                "severity": "high",
                "score_contribution": 25,
                "keywords": ["guaranteed return", "work from home", "earn ₹8,000", "no experience needed", "crypto bot", "500% return", "instant loan", "0% interest loan", "spin wheel"],
                "reason": "Unrealistic financial promise or high-yield investment/job claim"
            },
            {
                "id": "SUSPICIOUS_LINK",
                "category": "Suspicious Link",
                "label": "Embedded Suspicious Link",
                "severity": "high",
                "score_contribution": 20,
                "regex_patterns": [
                    r'https?://[^\s]+\.(top|xyz|click|site|cc|info|biz|tk|online|net|org)/(?:[^\s]*)?',
                    r'http://[^\s]+',
                    r'bit\.ly/[^\s]+|tinyurl\.com/[^\s]+'
                ],
                "reason": "Contains suspicious link or untrusted domain format"
            }
        ]

    def analyze(self, text: str) -> Dict[str, Any]:
        cleaned = clean_text(text)
        cap_ratio = check_capitalization_ratio(text)
        urls = extract_urls(text)

        detected_reasons = []
        detected_indicators = []
        rule_score_total = 0

        for rule in self.rules:
            matched = False

            # Check keywords
            if "keywords" in rule:
                for kw in rule["keywords"]:
                    if kw in cleaned:
                        matched = True
                        break

            # Check regex patterns if not matched yet
            if not matched and "regex_patterns" in rule:
                for pattern in rule["regex_patterns"]:
                    if re.search(pattern, text, re.IGNORECASE):
                        matched = True
                        break

            if matched:
                rule_score_total += rule["score_contribution"]
                detected_reasons.append(rule["reason"])
                detected_indicators.append({
                    "category": rule["category"],
                    "label": rule["label"],
                    "severity": rule["severity"],
                    "description": f"Triggered pattern: {rule['reason']}"
                })

        # Check capitalization shouting
        if cap_ratio > 0.45 and len(text) > 20:
            rule_score_total += 10
            reason_msg = "Excessive uppercase shouting detected (indicates urgent pressure)"
            detected_reasons.append(reason_msg)
            detected_indicators.append({
                "category": "Tone",
                "label": "Excessive Capitalization",
                "severity": "low",
                "description": reason_msg
            })

        # Cap rule score to 100 max
        rule_score_total = min(100, rule_score_total)

        return {
            "rule_score": rule_score_total,
            "reasons": detected_reasons,
            "indicators": detected_indicators,
            "urls": urls
        }

rule_engine = SecurityRuleEngine()
