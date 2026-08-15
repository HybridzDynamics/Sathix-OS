"""
Multilingual Language & Script Detector
Handles Native Indic scripts, English, Romanized Indic / Hinglish, and mixed text.
"""
import re
import unicodedata
from typing import Dict, Any, List, Tuple

# Unicode Block Ranges for Indic Scripts
UNICODE_SCRIPT_RANGES = {
    "Devanagari": (0x0900, 0x097F),
    "Bengali": (0x0980, 0x09FF),
    "Gurmukhi": (0x0A00, 0x0A7F),
    "Gujarati": (0x0A80, 0x0AFF),
    "Odia": (0x0B00, 0x0B7F),
    "Tamil": (0x0B80, 0x0BFF),
    "Telugu": (0x0C00, 0x0C7F),
    "Kannada": (0x0C80, 0x0CFF),
    "Malayalam": (0x0D00, 0x0D7F),
    "Arabic": (0x0600, 0x06FF),
    "Ol_Chiki": (0x1C50, 0x1C7F),
    "Meetei_Mayek": (0xABC0, 0xABFF),
    "Latin": (0x0041, 0x007A)
}

# Script to primary language mappings
SCRIPT_TO_DEFAULT_LANG = {
    "Devanagari": "hi",
    "Bengali": "bn",
    "Tamil": "ta",
    "Telugu": "te",
    "Kannada": "kn",
    "Malayalam": "ml",
    "Gujarati": "gu",
    "Gurmukhi": "pa",
    "Odia": "or",
    "Arabic": "ur",
    "Ol_Chiki": "sat",
    "Meetei_Mayek": "mni"
}

# Common Romanized Indic (Hinglish/Tanglish) Marker Words
HINGLISH_MARKERS = {
    "kisan", "yojana", "yojna", "mujhe", "chahiye", "batao", "kaise", "karein",
    "apply", "sarkar", "sarkari", "paisa", "milega", "aavedan", "kya", "hai",
    "nahi", "karo", "mera", "meri", "hum", "aap", "dhan", "kheti", "labh"
}

ENGLISH_COMMON_WORDS = {
    "the", "is", "are", "want", "know", "about", "farmer", "schemes", "how",
    "can", "apply", "what", "which", "eligibility", "government", "subsidy", "loan"
}

class LanguageDetector:
    def __init__(self):
        self._model_name = "hybrid-script-fasttext"

    def analyze_scripts(self, text: str) -> Dict[str, float]:
        """Calculates script character distribution percentage"""
        counts = {script: 0 for script in UNICODE_SCRIPT_RANGES}
        total_chars = 0

        for char in text:
            code = ord(char)
            matched = False
            for script, (start, end) in UNICODE_SCRIPT_RANGES.items():
                if start <= code <= end:
                    counts[script] += 1
                    total_chars += 1
                    matched = True
                    break
        
        if total_chars == 0:
            return {"Latin": 1.0}

        return {script: counts[script] / total_chars for script, count in counts.items() if count > 0}

    def detect_romanized(self, text: str) -> Tuple[str, float, bool]:
        """Detects if Latin-script text is Romanized Indic (Hinglish) vs pure English"""
        words = [w.lower() for w in re.findall(r'\b[a-zA-Z]+\b', text)]
        if not words:
            return "en", 0.90, False

        hinglish_hits = sum(1 for w in words if w in HINGLISH_MARKERS)
        english_hits = sum(1 for w in words if w in ENGLISH_COMMON_WORDS)

        if hinglish_hits > 0 and hinglish_hits >= english_hits:
            confidence = min(0.99, 0.70 + (hinglish_hits / len(words)) * 0.3)
            return "hi-Latn", confidence, True
        elif english_hits > 0:
            confidence = min(0.99, 0.75 + (english_hits / len(words)) * 0.25)
            return "en", confidence, False
        else:
            return "en", 0.85, False

    def detect(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            return {
                "language": "unknown",
                "confidence": 0.0,
                "script": "unknown",
                "isRomanized": False
            }

        script_dist = self.analyze_scripts(text)
        dominant_script = max(script_dist, key=script_dist.get)

        if dominant_script == "Latin":
            lang, confidence, is_romanized = self.detect_romanized(text)
            return {
                "language": "hi" if is_romanized else lang,
                "detectedCode": lang,
                "confidence": round(confidence, 2),
                "script": "Latin",
                "isRomanized": is_romanized,
                "scriptDistribution": script_dist,
                "model": self._model_name
            }
        else:
            lang = SCRIPT_TO_DEFAULT_LANG.get(dominant_script, "hi")
            confidence = round(min(0.99, script_dist.get(dominant_script, 0.95)), 2)
            return {
                "language": lang,
                "detectedCode": lang,
                "confidence": confidence,
                "script": dominant_script,
                "isRomanized": False,
                "scriptDistribution": script_dist,
                "model": self._model_name
            }

language_detector = LanguageDetector()
