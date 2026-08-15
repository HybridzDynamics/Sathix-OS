"""
Translation Engine Core
Dispatches requests to the active model provider (IndicTrans2 or fine-tuned checkpoints).
"""
from typing import List, Dict, Any, Union
from ..indictrans2.indictrans2_model import indictrans2_model
from ..indictrans2.language_registry import language_registry

class TranslationEngine:
    def __init__(self):
        self.providers = {
            "indictrans2": indictrans2_model
        }
        self.default_provider = "indictrans2"

    def translate(
        self,
        text_or_texts: Union[str, List[str]],
        source_language: str,
        target_language: str,
        provider: str = "indictrans2"
    ) -> Dict[str, Any]:
        if isinstance(text_or_texts, str):
            texts = [text_or_texts]
            single_input = True
        else:
            texts = text_or_texts
            single_input = False

        active_provider = self.providers.get(provider, self.providers[self.default_provider])
        result = active_provider.translate_batch(texts, source_language, target_language)

        if single_input:
            result["translation"] = result["translations"][0] if result["translations"] else ""
            del result["translations"]

        return result

translation_engine = TranslationEngine()
