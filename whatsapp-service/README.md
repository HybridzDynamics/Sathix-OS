# SathiX WhatsApp Service

This is the WhatsApp Cloud API transport for SathiX OS. It has no database and never calls RAG, language, voice, or panels directly. All application requests are authenticated and sent to the Backend at `POST /api/internal/whatsapp/messages`.

## Provider setup

This service implements the official Meta WhatsApp Cloud API webhook and message endpoints. Configure Meta to call `GET` and `POST https://<public-host>/webhooks/whatsapp`; the endpoint validates the verification token and `X-Hub-Signature-256` HMAC. HTTPS is required in production by Meta.

Copy `.env.example` to `.env`, set all values, then run `npm install` and `npm start`. The service fails closed at startup if provider or backend credentials are missing.

## Endpoints

- `GET /health` — process health only.
- `GET /ready` — reports dependency configuration without secrets.
- `GET /webhooks/whatsapp` — Meta verification challenge.
- `POST /webhooks/whatsapp` — signed Meta events; returns 200 before asynchronous processing.

Incoming text is normalized to a stable object containing `provider`, `messageId`, sender identity, `type`, `text`, timestamp, and metadata. Provider status events are sent to the Backend. Message IDs are held in an in-memory, TTL-based idempotency store; use a shared durable store before horizontally scaling.

## Safety and limitations

The service limits webhook requests, rejects invalid signatures and payloads, uses correlation IDs, masks credentials, limits retries to three attempts with backoff, and gracefully responds to unsupported inbound media. It intentionally does not infer a logged-in SathiX account from a phone number: backend responses are limited to non-sensitive scheme information. Account-linking, durable idempotency/queueing, delivery persistence, and media/voice forwarding need backend data-model and queue support before production deployment.

## Tests

Run `npm test`. Tests cover HMAC verification, Meta text normalization, and duplicate-message prevention. Backend tests additionally cover the authenticated WhatsApp-to-RAG path and unsupported input rejection.
