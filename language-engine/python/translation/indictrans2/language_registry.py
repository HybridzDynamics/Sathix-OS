"""
SathiX OS — Python Language Registry
Reads from the central single-source-of-truth canonical registry JSON
"""
import json
import os
from typing import Dict, Optional, Any

# Path to the single source of truth
REGISTRY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../models/registry/languages.json")
)

class LanguageRegistry:
    def __init__(self, registry_file: str = REGISTRY_PATH):
        if not os.path.exists(registry_file):
            raise FileNotFoundError(f"Language registry file not found at: {registry_file}")
        with open(registry_file, "r", encoding="utf-8") as f:
            self._languages: Dict[str, Dict[str, Any]] = json.load(f)
        
        self._aliases: Dict[str, str] = {
            "english": "en", "eng": "en", "en-in": "en", "en-us": "en",
            "hindi": "hi", "hin": "hi",
            "bengali": "bn", "bangla": "bn", "ben": "bn",
            "tamil": "ta", "tam": "ta",
            "telugu": "te", "tel": "te",
            "marathi": "mr", "mar": "mr",
            "gujarati": "gu", "guj": "gu",
            "kannada": "kn", "kan": "kn",
            "malayalam": "ml", "mal": "ml",
            "odia": "or", "oriya": "or", "ory": "or",
            "punjabi": "pa", "pan": "pa",
            "assamese": "as", "asm": "as",
            "urdu": "ur", "urd": "ur",
            "nepali": "ne", "npi": "ne", "nep": "ne",
            "sanskrit": "sa", "san": "sa",
            "sindhi": "sd", "snd": "sd",
            "kashmiri": "ks", "kas": "ks",
            "konkani": "kok", "gom": "kok",
            "maithili": "mai", "santali": "sat",
            "dogri": "doi", "dgo": "doi",
            "manipuri": "mni", "meitei": "mni", "bodo": "brx"
        }

    def normalize_code(self, code_or_name: str) -> Optional[str]:
        if not code_or_name:
            return None
        clean = code_or_name.strip().lower()
        if clean in self._languages:
            return clean
        if clean in self._aliases:
            return self._aliases[clean]
        return None

    def get_language(self, code_or_name: str) -> Optional[Dict[str, Any]]:
        code = self.normalize_code(code_or_name)
        if not code:
            return None
        return self._languages.get(code)

    def get_indictrans2_code(self, code_or_name: str) -> Optional[str]:
        lang = self.get_language(code_or_name)
        return lang.get("indictrans2Code") if lang else None

    def is_supported(self, code_or_name: str, capability: str = "translation") -> bool:
        lang = self.get_language(code_or_name)
        if not lang:
            return False
        return bool(lang.get(capability, False))

    def get_all(self, is_indic: Optional[bool] = None) -> Dict[str, Dict[str, Any]]:
        if is_indic is None:
            return self._languages
        return {k: v for k, v in self._languages.items() if v.get("isIndic") == is_indic}

language_registry = LanguageRegistry()
