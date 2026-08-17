"""Local, open-weight Faster-Whisper HTTP inference service for SathiX Voice."""
import math
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, Request
from faster_whisper import WhisperModel

app = FastAPI(title="SathiX STT Inference")
_model = None


def configured_model_path() -> str:
    value = os.getenv("STT_MODEL_PATH", "").strip()
    if not value:
        raise RuntimeError("STT_MODEL_PATH must name a local Faster-Whisper model directory or approved model reference.")
    return value


def model() -> WhisperModel:
    global _model
    if _model is None:
        _model = WhisperModel(configured_model_path(), device=os.getenv("STT_DEVICE", "auto"), compute_type=os.getenv("STT_COMPUTE_TYPE", "int8"))
    return _model


def suffix(content_type: str) -> str:
    return {"audio/wav": ".wav", "audio/x-wav": ".wav", "audio/mpeg": ".mp3", "audio/ogg": ".ogg", "audio/webm": ".webm", "audio/mp4": ".mp4", "audio/aac": ".aac"}.get(content_type.split(";", 1)[0].lower(), ".audio")


@app.get("/health")
def health():
    try:
        configured_model_path()
        return {"status": "ready" if _model is not None else "configured", "modelLoaded": _model is not None}
    except RuntimeError as exc:
        return {"status": "degraded", "modelLoaded": False, "reason": str(exc)}


@app.post("/v1/stt/transcribe")
async def transcribe(request: Request, x_model_id: str = Header(default=""), x_audio_mime_type: str = Header(default="")):
    if not x_model_id:
        raise HTTPException(status_code=400, detail="X-Model-Id is required.")
    data = await request.body()
    if not data:
        raise HTTPException(status_code=400, detail="Audio is required.")
    file_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix(x_audio_mime_type or request.headers.get("content-type", "")), delete=False) as audio_file:
            audio_file.write(data)
            file_path = audio_file.name
        segments, info = model().transcribe(file_path, vad_filter=True, word_timestamps=False)
        segments = list(segments)
        text = " ".join(segment.text.strip() for segment in segments).strip()
        if not text:
            raise HTTPException(status_code=422, detail="No speech was detected in the supplied audio.")
        duration_ms = round(max((segment.end for segment in segments), default=0) * 1000)
        probabilities = [math.exp(segment.avg_logprob) for segment in segments if segment.avg_logprob is not None]
        return {"text": text, "language": info.language or None, "confidence": round(min(1, sum(probabilities) / len(probabilities)), 4) if probabilities else None, "durationMs": duration_ms}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Speech recognition inference is unavailable.") from exc
    finally:
        if file_path:
            Path(file_path).unlink(missing_ok=True)
