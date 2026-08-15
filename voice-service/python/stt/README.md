# STT adapters

The `python-http` provider sends the original validated bytes to `POST /v1/stt/transcribe`.

Required request headers: `Content-Type`, `X-Model-Id`, and `X-Audio-Mime-Type`. The model-serving process resolves model location from configuration, never from the API request.

Expected JSON response:

```json
{ "text": "मुझे किसान योजना चाहिए", "language": "hi", "confidence": 0.95, "durationMs": 4200 }
```
