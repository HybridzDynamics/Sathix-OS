# SathiX Voice Service

Standalone speech-processing boundary for SathiX OS. It owns audio ingestion, VAD, STT, TTS, and future telephony adapters; it delegates language work to `language-engine` and grounded answers to `backend`.

## Current phase

Phase 4 adds a registry-driven STT endpoint. Set `STT_PROVIDER=python-http` and point `STT_INFERENCE_URL` at an internal local inference process. `/api/v1/speech-to-text` now sends validated audio to that adapter and returns a normalized transcript contract. TTS and voice-query endpoints intentionally remain unavailable.

Authentication middleware is scaffolded but will be attached with the public/client authentication policy during the security implementation phase; internal calls already carry the configured service token.

## Endpoints

- `GET /health`
- `GET /api/v1/health`
- `GET /api/v1/languages`
- `GET /api/v1/models`
- `POST /api/v1/speech-to-text` (reserved)
- `POST /api/v1/text-to-speech` (reserved)
- `POST /api/v1/voice/query` (reserved)

## Integration contract

The service calls Language Engine at `/api/v1/detect` and `/api/v1/translate`, and Backend at `/api/v1/ai/query`. It must not call RAG Service or Qdrant directly.

## Local start

```bash
cd voice-service
copy .env.example .env
npm install
npm start
```

Run `npm test` after tests are introduced in Phase 10.

## Privacy

Audio retention is disabled by default. Uploaded audio is held in request memory and released after the response; no temporary audio file is created. WAV duration/file-size validation is enforced; compressed-duration inspection will be added alongside the selected decoder/provider. Transcript storage remains opt-in.
