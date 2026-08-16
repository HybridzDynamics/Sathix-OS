# SathiX Voice Service

Standalone speech-processing boundary for SathiX OS. It owns audio ingestion, VAD, STT, TTS, and future telephony adapters; it delegates language work to `language-engine` and grounded answers to `backend`.

## Current phase

Phase 9 adds `lowBandwidth=true` to `/voice/query`. It applies lower upload caps, validates known WAV bitrate, and defaults to `audioMode=none` so only transcript and grounded text are returned. Set `audioMode=inline` to request Base64 audio when the connection can support it. The response echoes a request-derived `operationId`; audio uploads are deliberately not retained, so resumable upload is not supported yet.

For a client retry, reuse the same `X-Request-Id` header and retry only transport-level failures. Voice queries are read-only, but the service intentionally does not retain raw audio or implement server-side upload resumption.

Authentication middleware is scaffolded but will be attached with the public/client authentication policy during the security implementation phase; internal calls already carry the configured service token.

## Endpoints

- `GET /health`
- `GET /api/v1/health`
- `GET /api/v1/languages`
- `GET /api/v1/models`
- `POST /api/v1/speech-to-text` (reserved)
- `POST /api/v1/text-to-speech` (reserved)
- `POST /api/v1/voice/query` (`multipart/form-data`, `audio` required; optional `responseLanguage`, `filters`, `topK`, `lowBandwidth`, `audioMode`)

## Integration contract

The service calls Language Engine at `/api/v1/detect` and `/api/v1/translate`, and Backend at `/api/v1/ai/query`. It must not call RAG Service or Qdrant directly.

## Local start

```bash
cd voice-service
copy .env.example .env
npm install
npm start
```

Run the complete unit and integration-style suite with `npm test`.

## Test coverage

The test suite covers English and Hindi STT flow, noisy/short/long/invalid audio handling, silence, STT/TTS failures, unavailable Language Engine/Backend/RAG boundaries, low-bandwidth policy, repeated requests, and a grounded PM-KISAN voice-query flow. External model and service processes are mocked in these tests; deployment verification still requires those processes to be running.

## Privacy

Audio retention is disabled by default. Uploaded audio is held in request memory and released after the response; no temporary audio file is created. WAV duration/file-size validation is enforced; compressed-duration inspection will be added alongside the selected decoder/provider. Transcript storage remains opt-in.
