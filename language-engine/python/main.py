"""
SathiX OS — Python ML Inference Service for Indic NLP & IndicTrans2
"""
import os
import time
from typing import Optional, List, Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from translation.inference.translation_engine import translation_engine
from translation.indictrans2.language_registry import language_registry
from detection.detector import language_detector

app = FastAPI(
    title="SathiX Language Engine — ML Inference Core",
    version="1.0.0",
    description="Python ML runtime for IndicTrans2, FastText language detection, and Indic NLP"
)

class TranslationRequest(BaseModel):
    text: Optional[str] = None
    texts: Optional[List[str]] = None
    sourceLanguage: str = Field(..., description="Source language ISO-639 code")
    targetLanguage: str = Field(..., description="Target language ISO-639 code")
    provider: Optional[str] = "indictrans2"

class DetectionRequest(BaseModel):
    text: str = Field(..., description="Input text to detect language for")

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "sathix-language-engine-ml",
        "version": "1.0.0",
        "timestamp": time.time()
    }

@app.post("/translate")
async def translate(req: TranslationRequest):
    if not req.text and not req.texts:
        raise HTTPException(status_code=400, detail="Either 'text' or 'texts' must be provided")

    src = language_registry.normalize_code(req.sourceLanguage)
    tgt = language_registry.normalize_code(req.targetLanguage)

    if not src:
        raise HTTPException(status_code=400, detail=f"Unsupported source language: {req.sourceLanguage}")
    if not tgt:
        raise HTTPException(status_code=400, detail=f"Unsupported target language: {req.targetLanguage}")
    if src == tgt:
        raise HTTPException(status_code=400, detail="Source and target languages cannot be identical")

    payload_text = req.texts if req.texts is not None else req.text

    try:
        result = translation_engine.translate(
            text_or_texts=payload_text,
            source_language=src,
            target_language=tgt,
            provider=req.provider or "indictrans2"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation inference failed: {str(e)}")

@app.post("/detect")
async def detect(req: DetectionRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty")

    try:
        result = language_detector.detect(req.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PYTHON_ML_SERVICE_PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
