# SathiX OS — Backend, Scraper & RAG Pipeline Integration

This repository unifies three core services into a reliable, production-ready data and AI pipeline:
- **`backend/`** — Main Express API server, citizen authentication, chat session management, and AI proxy.
- **`scraper-engine/`** — Crawler, cleaner, normalizer, and PostgreSQL persistence layer with SHA-256 deduplication.
- **`rag-service/`** — Search & retrieval engine with PostgreSQL reader, chunking, embeddings, Qdrant vector indexing, and grounded query response formatting.

---

## 🏗 Architecture & Data Flow

```text
Government Websites / Sources
             ↓
      Scraper Engine
             ↓
Validation & Normalization (SHA-256 deduplication)
             ↓
      PostgreSQL (Scheme table via Prisma)
             ↓
     RAG Ingestion Pipeline (/rag/reindex or /rag/ingest)
             ↓
     Embedding Generation
             ↓
     Qdrant Vector Database
             ↓
     RAG Retrieval (/rag/query)
             ↓
     Backend API (/api/v1/ai/query, /api/assistant/chat)
             ↓
     Citizen Frontend / Client
```

---

## ⚙️ Environment Setup

Each service contains a `.env.example` template:

1. **`backend/.env`**
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@host:5432/neondb?sslmode=require
   JWT_SECRET=supersecretkey
   RAG_ENGINE_URL=http://localhost:3001
   INTERNAL_SERVICE_TOKEN=sathix_internal_secret_2024
   RAG_TIMEOUT_MS=15000
   ```

2. **`rag-service/.env`**
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@host:5432/neondb?sslmode=require
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your-api-key
   VECTOR_STORE=qdrant
   EMBEDDING_PROVIDER=none
   EMBEDDING_DIM=384
   INTERNAL_SERVICE_TOKEN=sathix_internal_secret_2024
   ```

3. **`scraper-engine/.env`**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/neondb?sslmode=require
   ```

---

## 🐳 Docker — one container per service

Every SathiX-OS component runs in its **own Docker container**:

| Container | Port | Role |
|-----------|------|------|
| postgres | 5432 | Database |
| redis | 6379 | Scraper queue |
| qdrant | 6333 | Vector store |
| backend | 5000 | API gateway |
| rag-service | 3001 | RAG + Qdrant |
| scraper-worker | — | BullMQ worker |
| language-engine | 4001 | Language API |
| language-engine-ml | 8001 | IndicTrans2 ML |
| voice-service | 4002 | Voice orchestration |
| stt-inference | 8002 | Speech-to-text |
| tts-inference | 8003 | Text-to-speech |
| whatsapp-service | 4003 | WhatsApp webhook |
| admin-panel | 3100 | Admin UI |
| user-panel | 3000 | Citizen UI |

### Setup

```bash
cp .env.example .env
# Edit JWT_SECRET, INTERNAL_SERVICE_TOKEN

# Download voice models (required for STT/TTS containers)
bash scripts/download-voice-models.sh   # or .\scripts\download-voice-models.ps1

docker compose up --build
```

### Verify integration

```bash
node scripts/verify-integration.js
```

RAG uses **Qdrant** + **`EMBEDDING_PROVIDER=local`** (deterministic hash vectors — no API key needed in Docker).

WhatsApp runs in **`WHATSAPP_DEV_MODE=true`** locally (set Meta credentials and `WHATSAPP_DEV_MODE=false` for production).

---

## 🚀 Running the Services (manual)

### 1. Synchronize Database Schema
```bash
cd backend
npx prisma db push
```

### 2. Start RAG Service
```bash
cd rag-service
npm start
# Runs on http://localhost:3001
```

### 3. Start Backend Service
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### 4. Run Scraper Worker
```bash
cd scraper-engine
npm run worker
```

### 5. Run Scraper Crawl (CLI)
```bash
cd scraper-engine
node src/index.js <target_url>
```

---

## 🧪 Testing

Run all service tests locally:

```bash
cd backend && npm test
cd rag-service && npm test
cd language-engine && npm test
cd voice-service && npm test
cd whatsapp-service && npm test
cd scraper-engine && npm test
```

Or rely on GitHub Actions CI (`.github/workflows/ci.yml`) on push/PR.

### Full End-to-End Pipeline Test:
```bash
node scripts/test-e2e.js
```

---

## 🔍 Key Endpoints

- `GET /health` — Backend & RAG health checks
- `POST /api/rag/query` — Backend JWT-protected RAG query gateway
- `POST /api/assistant/chat` — Authenticated citizen chat session
- `POST /api/scraper/start` — Admin scraper job queue (JWT + ADMIN)
- `GET /api/scraper/status` — Scraper queue status (JWT + ADMIN)
- `POST /rag/query` — RAG vector search (internal service token)
- `POST /rag/ingest` — Single scheme vector ingestion
- `POST /rag/reindex` — Batch reindex from PostgreSQL
