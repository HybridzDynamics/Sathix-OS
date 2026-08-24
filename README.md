# SathiX OS

AI-powered digital citizen assistant for Indian government schemes — scraping, RAG retrieval, multilingual NLP, voice, and WhatsApp channels.

## Architecture

```text
Government Websites / Sources
             |
      Scraper Engine (BullMQ worker)
             |
Validation & Normalization (SHA-256 dedup)
             |
      PostgreSQL
             |
     RAG Service (/rag/reindex, /rag/query)
             |
     Qdrant Vector Database
             |
     Backend API (:5000)  <-- central gateway
       /    |    |    \
     RAG  Lang  Voice  WhatsApp
            |
      Python ML (:8001 IndicTrans2)

Citizen UI (user-panel :3000)  |  Admin UI (admin-panel :3100)
WhatsApp Cloud API (:4003)     |  Voice STT/TTS (:8002/:8003)
```

### Services

| Service | Path | Port | Purpose |
|---------|------|------|---------|
| Backend | `backend/` | 5000 | JWT auth, admin APIs, citizen chat, service gateway |
| RAG | `rag-service/` | 3001 | Embeddings, Qdrant indexing, retrieval |
| Scraper worker | `scraper-engine/` | — | Crawl, parse, persist schemes (Redis queue) |
| Language Engine | `language-engine/` | 4001 | Detection, translation, transliteration |
| Language ML | `language-engine/python/` | 8001 | IndicTrans2 / FastText inference |
| Voice | `voice-service/` | 4002 | STT → Backend/RAG → TTS pipeline |
| STT / TTS | `voice-service/python/` | 8002 / 8003 | Faster-Whisper / Piper inference |
| WhatsApp | `whatsapp-service/` | 4003 | Meta Cloud API webhooks |
| Admin Panel | `admin-panel/` | 3100 | Next.js admin dashboard (real backend APIs) |
| User Panel | `user-panel/` | 3000 | Citizen React app (primary frontend) |
| Legacy prototype | `frontend/` | 5173 | Mock-data marketing UI (not in production stack) |

**Infrastructure:** PostgreSQL (5432), Redis (6379), Qdrant (6333)

**Note:** There is no standalone OCR microservice. Document text extraction for RAG seeding uses DOCX parsing in `rag-service/src/ocr/`.

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+ (for language ML and voice inference)
- **PostgreSQL** 16
- **Redis** 7
- **Qdrant** 1.12+ ([download](https://qdrant.tech/documentation/guides/install/))

---

## Environment Setup

```bash
cp .env.example .env
# Edit JWT_SECRET, INTERNAL_SERVICE_TOKEN, DATABASE_URL, and optional SUPER_ADMIN_* values
```

Copy per-service templates where needed: `backend/.env.example`, `rag-service/.env.example`, etc.

**Critical:** `INTERNAL_SERVICE_TOKEN` and `JWT_SECRET` must match across all services that communicate internally.

---

## Local Windows Startup (no Docker)

From the repository root:

```bat
start-all.bat      REM Start all application services
check-services.bat REM Verify health / ports
stop-all.bat       REM Stop tracked SathiX-OS processes only
restart-all.bat    REM Stop then start
```

**Before running `start-all.bat`:**

1. Start PostgreSQL, Redis, and Qdrant locally on ports 5432, 6379, 6333
2. Copy `.env.example` to `.env` and set secrets
3. Optional voice models: `npm run models:voice`

Logs and PIDs: `.runtime/logs/` and `.runtime/pids/`

---

## Docker Startup (alternative)

See [DOCKER.md](./DOCKER.md).

```bash
cp .env.example .env
npm run models:voice
docker compose up --build -d
npm run verify:integration
```

Windows: `start.bat` or `scripts\bootstrap-local.ps1`

---

## Manual Service Startup

```bash
# Database migrations
cd backend && npx knex migrate:latest

# Core pipeline
cd rag-service && npm start          # :3001
cd language-engine && npm start      # :4001
cd language-engine/python && python -m uvicorn main:app --host 0.0.0.0 --port 8001
cd backend && npm start              # :5000
cd scraper-engine && npm run worker

# Optional
cd whatsapp-service && npm start     # :4003
cd voice-service && npm start        # :4002 (requires STT/TTS models)
cd admin-panel && npx next dev -p 3100
cd user-panel && npm run dev         # :3000
```

---

## Testing

```bash
npm test                    # All 6 service test suites
npm run verify:integration  # Health probes + RAG auth (services must be running)
node scripts/test-e2e.js    # End-to-end pipeline (requires full stack)
```

**Verified:** 6/6 test suites pass (backend, rag-service, language-engine, voice-service, whatsapp-service, scraper-engine).

---

## Key API Endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /health` | Public | Backend liveness |
| `GET /api/ready` | Public | Backend + dependency readiness |
| `POST /api/auth/register` | Public (rate-limited) | Citizen registration |
| `POST /api/auth/login` | Public (rate-limited) | Login |
| `POST /api/assistant/chat` | JWT | Citizen RAG chat |
| `GET /api/admin/*` | JWT + ADMIN | Admin dashboard APIs |
| `POST /api/internal/voice/query` | Internal token | Voice service → Backend |
| `POST /api/internal/whatsapp/messages` | Internal token | WhatsApp → Backend |
| `POST /rag/query` | Internal token | RAG retrieval |

---

## Service Ports (default)

| Port | Service |
|------|---------|
| 5432 | PostgreSQL |
| 6379 | Redis |
| 6333 | Qdrant |
| 5000 | Backend |
| 3001 | RAG |
| 4001 | Language Engine |
| 8001 | Language ML |
| 4002 | Voice |
| 8002 | STT |
| 8003 | TTS |
| 4003 | WhatsApp |
| 3100 | Admin Panel |
| 3000 | User Panel |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `start-all.bat` fails on PostgreSQL/Redis/Qdrant | Start infrastructure first on expected ports |
| Backend refuses to start | Set `JWT_SECRET` to a strong non-default value |
| Voice services skipped | Run `npm run models:voice` |
| CORS errors in browser | Add your frontend origin to `CORS_ALLOWED_ORIGINS` |
| Admin API returns 401 | Token expired or user inactive; DB role checked server-side |
| RAG query fails auth | Align `INTERNAL_SERVICE_TOKEN` across backend and rag-service |

---

## Security

- CORS: explicit origin allowlist (no `*` for authenticated routes)
- Admin routes: server-side `authenticate` + `authorize(['ADMIN'])`
- Internal routes: `x-internal-token` header
- Rate limiting on `/api` and `/api/auth`
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- JWT validated against live DB role (stale privilege escalation blocked)

---

## Environment Variables (names only)

See `.env.example` for full list. Key variables:

`DATABASE_URL`, `JWT_SECRET`, `INTERNAL_SERVICE_TOKEN`, `CORS_ALLOWED_ORIGINS`, `REDIS_URL`, `QDRANT_URL`, `RAG_ENGINE_URL`, `LANGUAGE_ENGINE_URL`, `VOICE_SERVICE_URL`, `WHATSAPP_SERVICE_URL`, `BACKEND_PORT`, `RAG_PORT`, `LANGUAGE_PORT`, `LANGUAGE_ML_PORT`, `VOICE_PORT`, `STT_PORT`, `TTS_PORT`, `WHATSAPP_PORT`, `ADMIN_PANEL_PORT`, `USER_PANEL_PORT`, `NEXT_PUBLIC_BACKEND_URL`, `VITE_BACKEND_URL`, `SUPER_ADMIN_MOBILE`, `SUPER_ADMIN_PASSWORD`, `WHATSAPP_DEV_MODE`, `WHATSAPP_VERIFY_TOKEN`, `EMBEDDING_PROVIDER`, `VECTOR_STORE`, `ANSWER_GENERATOR`
