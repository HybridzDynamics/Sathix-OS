"""
IndicTrans2 Text Postprocessor
Handles detokenization, punctuation restoration, and cleanup.
"""
import re
from typing import List

class IndicPostprocessor:
    def postprocess_sentence(self, text: str, tgt_lang: str) -> str:
        if not text:
            return ""
        cleaned = text.strip()
        # Fix space before common punctuation
        cleaned = re.sub(r'\s+([,.?!;:।])', r'\1', cleaned)
        return cleaned

    def batch_postprocess(self, texts: List[str], tgt_lang: str) -> List[str]:
        return [self.postprocess_sentence(t, tgt_lang) for t in texts]

postprocessor = IndicPostprocessor()
