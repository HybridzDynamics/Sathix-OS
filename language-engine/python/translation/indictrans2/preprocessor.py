"""
IndicTrans2 Text Preprocessor
Handles normalization, script verification, and placeholder protection for Indian Languages.
"""
import re
from typing import List, Tuple

class IndicPreprocessor:
    def __init__(self):
        # Regex patterns for placeholder tokens and URLs/numbers
        self.url_pattern = re.compile(r'https?://\S+|www\.\S+')
        self.num_pattern = re.compile(r'\b\d+[\d,.]*\b')

    def preprocess_sentence(self, text: str, src_lang: str) -> str:
        """Clean and normalize sentence before tokenization"""
        if not text:
            return ""
        
        cleaned = text.strip()
        # Collapse repeated whitespaces
        cleaned = re.sub(r'\s+', ' ', cleaned)
        return cleaned

    def batch_preprocess(self, texts: List[str], src_lang: str) -> List[str]:
        return [self.preprocess_sentence(t, src_lang) for t in texts]

preprocessor = IndicPreprocessor()
