import re
from typing import List, Dict, Any

def clean_text(text: str) -> str:
    """Normalizes text by lowercasing, stripping extra whitespace and special characters."""
    if not text:
        return ""
    cleaned = text.lower().strip()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def extract_urls(text: str) -> List[str]:
    """Extracts all HTTP/HTTPS and domain-like URLs from a string."""
    url_pattern = r'https?://[^\s,><"]+|www\.[^\s,><"]+|\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?'
    matches = re.findall(url_pattern, text, re.IGNORECASE)
    return matches

def check_capitalization_ratio(text: str) -> float:
    """Returns the ratio of uppercase characters (indicative of shouting/urgency)."""
    alpha_chars = [c for c in text if c.isalpha()]
    if not alpha_chars:
        return 0.0
    upper_chars = [c for c in alpha_chars if c.isupper()]
    return len(upper_chars) / len(alpha_chars)
