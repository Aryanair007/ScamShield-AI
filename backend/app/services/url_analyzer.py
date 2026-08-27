import re
from urllib.parse import urlparse
from typing import Dict, Any, List

SUSPICIOUS_TLDS = {".xyz", ".top", ".tk", ".site", ".cc", ".click", ".biz", ".info", ".online", ".club", ".work", ".cf", ".ga", ".gq", ".ml"}
URL_SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "cutt.ly", "shorturl.at", "ow.ly"}
PHISHING_KEYWORDS = ["bank", "kyc", "verify", "claim", "prize", "login", "auth", "account", "secure", "update", "bonus", "reward", "sbi", "hdfc", "paytm", "gpay", "paypal", "yono", "free"]

class UrlAnalyzer:
    def analyze(self, url_str: str) -> Dict[str, Any]:
        if not url_str.startswith(("http://", "https://")):
            url_str_full = "http://" + url_str
        else:
            url_str_full = url_str

        try:
            parsed = urlparse(url_str_full)
            hostname = parsed.hostname or ""
            path = parsed.path or ""
            query = parsed.query or ""
        except Exception:
            hostname = url_str
            path = ""
            query = ""

        reasons: List[str] = []
        indicators: List[Dict[str, str]] = []
        url_score = 0

        # 1. HTTPS Check
        if not url_str_full.startswith("https://"):
            url_score += 15
            reason = "Insecure connection protocol (HTTP instead of HTTPS)"
            reasons.append(reason)
            indicators.append({
                "category": "Encryption",
                "label": "Insecure HTTP Protocol",
                "severity": "medium",
                "description": "Transmission lacks SSL encryption."
            })

        # 2. IP Address Hostname Check
        ip_pattern = r'^(?:\d{1,3}\.){3}\d{1,3}$'
        if re.match(ip_pattern, hostname):
            url_score += 35
            reason = "Raw IP address used as hostname instead of a domain name"
            reasons.append(reason)
            indicators.append({
                "category": "Hostname",
                "label": "Raw IP Address Host",
                "severity": "high",
                "description": "Legitimate organizations rarely use raw IP addresses for user websites."
            })

        # 3. URL Shortener Check
        if hostname.lower() in URL_SHORTENERS:
            url_score += 20
            reason = "URL shortener detected (conceals true destination)"
            reasons.append(reason)
            indicators.append({
                "category": "Obfuscation",
                "label": "URL Shortener Detected",
                "severity": "medium",
                "description": "Shortened URLs obscure final destination domain."
            })

        # 4. High Risk TLD Check
        domain_parts = hostname.split('.')
        if len(domain_parts) > 1:
            tld = "." + domain_parts[-1].lower()
            if tld in SUSPICIOUS_TLDS:
                url_score += 25
                reason = f"High-risk non-standard top-level domain detected ({tld})"
                reasons.append(reason)
                indicators.append({
                    "category": "Domain TLD",
                    "label": "High-Risk TLD",
                    "severity": "high",
                    "description": f"TLD {tld} is frequently associated with disposable phishing sites."
                })

        # 5. Subdomain Depth Check
        if len(domain_parts) > 3:
            url_score += 15
            reason = "Excessive subdomains detected (potential typosquatting/impersonation)"
            reasons.append(reason)
            indicators.append({
                "category": "Subdomain",
                "label": "Excessive Subdomains",
                "severity": "medium",
                "description": "Multiple subdomains used to mimic authentic corporate domains."
            })

        # 6. Phishing / Impersonation Keywords in Hostname or Path
        full_path_str = (hostname + path + query).lower()
        matched_kw = [kw for kw in PHISHING_KEYWORDS if kw in full_path_str]
        if matched_kw:
            if any(brand in hostname.lower() for brand in ["sbi", "hdfc", "paytm", "gpay", "paypal", "yono", "bank"]):
                url_score += 25
                reason = f"Financial institution brand keywords in unverified domain ({', '.join(matched_kw)})"
                reasons.append(reason)
                indicators.append({
                    "category": "Brand Impersonation",
                    "label": "Financial Brand Keyword",
                    "severity": "high",
                    "description": "Contains brand names in hostname without verified SSL domain ownership."
                })
            else:
                url_score += 10
                reason = f"Security/authentication keywords detected in URL path ({', '.join(matched_kw)})"
                reasons.append(reason)

        # 7. Excessively Long URL Check
        if len(url_str) > 75:
            url_score += 10
            reason = "Excessively long URL string (>75 characters)"
            reasons.append(reason)

        url_score = min(100, url_score)

        return {
            "url_score": url_score,
            "reasons": reasons,
            "indicators": indicators,
            "hostname": hostname
        }

url_analyzer = UrlAnalyzer()
