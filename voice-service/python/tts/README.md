# TTS adapters

The `python-http` provider sends `POST /v1/tts/synthesize` with `{ text, language, voice }` and `X-Model-Id`. Return audio bytes with an appropriate `Content-Type` such as `audio/wav`.

Voice artifact licensing must be approved before a model is enabled in production.

## Local inference runtime

The included `main.py` hosts an approved Piper voice locally. TTS output exists only in a temporary WAV file while FastAPI streams it, then is deleted by a background cleanup task.

```bash
cd voice-service/python/tts
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
$env:TTS_MODEL_PATH = "C:\models\en_US-lessac-medium.onnx"
.venv\Scripts\uvicorn main:app --host 127.0.0.1 --port 8003
```

The current catalog supports English only. The Voice Service returns grounded text without substituting another voice when TTS is unavailable for the requested language.
