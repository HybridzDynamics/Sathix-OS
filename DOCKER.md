# SathiX-OS Docker Deployment

## Prerequisites

- Docker Desktop 4.x+ with Compose v2
- 8 GB+ RAM recommended (language ML + voice models)
- Copy `.env.example` → `.env` and set secrets

## Quick start

```bash
cp .env.example .env
# Required: JWT_SECRET, INTERNAL_SERVICE_TOKEN

npm run models:voice          # download STT/TTS artifacts once
docker compose up --build -d  # start all 14 containers
npm run verify:integration    # check health + RAG auth
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run models:voice
.\scripts\bootstrap-local.ps1
```

## Service URLs (host machine)

| Service | URL |
|---------|-----|
| Backend API | http://localhost:5000 |
| RAG | http://localhost:3001 |
| Language Engine | http://localhost:4001 |
| Voice | http://localhost:4002 |
| WhatsApp | http://localhost:4003 |
| Admin Panel | http://localhost:3100 |
| User Panel | http://localhost:3000 |
| Qdrant | http://localhost:6333 |

## Integration architecture

All external traffic goes through **Backend** except WhatsApp webhooks (Meta → whatsapp-service → Backend internal API).

```
Browser → admin-panel / user-panel → backend:5000
Meta    → whatsapp-service:4003   → backend:5000/api/internal/*
backend → rag-service:3001        (INTERNAL_SERVICE_TOKEN)
backend → language-engine:4001
backend → voice-service:4002      → stt:8002, tts:8003
scraper-worker → postgres + redis
rag-service → postgres + qdrant
```

## Environment highlights

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Backend auth (required) |
| `INTERNAL_SERVICE_TOKEN` | Service-to-service auth (must match across services) |
| `EMBEDDING_PROVIDER=local` | Hash-based vectors for Docker (no OpenAI key) |
| `VECTOR_STORE=qdrant` | Production vector index |
| `WHATSAPP_DEV_MODE=true` | Start WhatsApp without Meta credentials |
| `NEXT_PUBLIC_BACKEND_URL` | Admin panel → browser calls host backend |
| `VITE_BACKEND_URL` | User panel → browser calls host backend |

## Production WhatsApp

Set in `.env`:

```
WHATSAPP_DEV_MODE=false
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_APP_SECRET=...
WHATSAPP_PHONE_NUMBER_ID=...
```

Point Meta webhook to: `https://your-domain/webhooks/whatsapp`

## Super admin bootstrap

Set in `.env` before first backend start:

```
SUPER_ADMIN_MOBILE=9999999999
SUPER_ADMIN_PASSWORD=strong-password-here
```

Backend Docker entrypoint runs `seed-super-admin.js` automatically when these are set.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| STT/TTS degraded | Run `npm run models:voice`, ensure `./runtime-models` exists |
| RAG qdrant error | Wait for qdrant healthcheck; check `docker compose logs qdrant` |
| Backend 401 on admin | Seed super admin; login via admin panel |
| CORS errors | Add frontend origin to `CORS_ALLOWED_ORIGINS` |
| Language ML slow start | First boot downloads models; allow 2–3 min |

## Commands

```bash
docker compose ps
docker compose logs -f backend
docker compose down -v   # reset volumes (destroys DB)
npm test                 # all unit tests (no Docker required)
```
