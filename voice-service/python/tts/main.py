"""Local Piper HTTP inference service for SathiX Voice."""
import os
import tempfile
import wave
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from piper import PiperVoice

app = FastAPI(title="SathiX TTS Inference")
_voice = None


def configured_model_path() -> str:
    value = os.getenv("TTS_MODEL_PATH", "").strip()
    if not value:
        raise RuntimeError("TTS_MODEL_PATH must point to an approved Piper .onnx voice artifact.")
    return value


def voice() -> PiperVoice:
    global _voice
    if _voice is None:
        _voice = PiperVoice.load(configured_model_path())
    return _voice


@app.get("/health")
def health():
    try:
        configured_model_path()
        return {"status": "ready" if _voice is not None else "configured", "modelLoaded": _voice is not None}
    except RuntimeError as exc:
        return {"status": "degraded", "modelLoaded": False, "reason": str(exc)}


@app.post("/v1/tts/synthesize")
def synthesize(payload: dict, background_tasks: BackgroundTasks, x_model_id: str = Header(default="")):
    text = payload.get("text")
    language = payload.get("language")
    if not x_model_id:
        raise HTTPException(status_code=400, detail="X-Model-Id is required.")
    if not isinstance(text, str) or not text.strip():
        raise HTTPException(status_code=400, detail="text is required.")
    if language != "en":
        raise HTTPException(status_code=422, detail="The configured Piper voice supports English only.")
    output_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as output_file:
            output_path = output_file.name
        with wave.open(output_path, "wb") as wav_file:
            voice().synthesize_wav(text.strip(), wav_file)
        background_tasks.add_task(Path(output_path).unlink, missing_ok=True)
        return FileResponse(output_path, media_type="audio/wav", filename="speech.wav", background=background_tasks)
    except HTTPException:
        raise
    except Exception as exc:
        if output_path:
            Path(output_path).unlink(missing_ok=True)
        raise HTTPException(status_code=503, detail="Text-to-speech inference is unavailable.") from exc
