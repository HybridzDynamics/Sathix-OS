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

## 🐳 Docker (recommended local stack)

```bash
cp .env.example .env
# Edit .env — set JWT_SECRET and INTERNAL_SERVICE_TOKEN

docker compose up --build
```

Core services started: PostgreSQL, Redis, Qdrant, Backend (`:5000`), RAG (`:3001`), Scraper worker.

Optional profiles:

```bash
docker compose --profile language --profile voice --profile whatsapp up --build
```

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
