# STT adapters

The `python-http` provider sends the original validated bytes to `POST /v1/stt/transcribe`.

Required request headers: `Content-Type`, `X-Model-Id`, and `X-Audio-Mime-Type`. The model-serving process resolves model location from configuration, never from the API request.

Expected JSON response:

```json
{ "text": "मुझे किसान योजना चाहिए", "language": "hi", "confidence": 0.95, "durationMs": 4200 }
```

## Local inference runtime

The included `main.py` uses open-weight Faster-Whisper. It does not log or retain audio: each request is written to a temporary file only because the decoder requires a filename, then deleted in a `finally` block.

```bash
cd voice-service/python/stt
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
set STT_MODEL_PATH=Systran/faster-whisper-small
.venv\Scripts\uvicorn main:app --host 127.0.0.1 --port 8002
```
