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

## 🚀 Running the Services

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

### 4. Run Scraper Crawl
```bash
cd scraper-engine
node src/index.js <target_url>
```

---

## 🧪 Testing the Integration

### Run Unit & RAG Service Tests:
```bash
cd rag-service
npm run test:integration
```

### Run Full End-to-End Pipeline Test:
```bash
node scripts/test-e2e.js
```

---

## 🔍 Key Endpoints

- `GET /health` (Backend & RAG service health checks)
- `POST /api/v1/ai/query` (Backend public stateless AI endpoint)
- `POST /api/assistant/chat` (Backend authenticated citizen chat session)
- `POST /rag/query` (RAG vector search & grounded response)
- `POST /rag/ingest` (Single scheme vector ingestion)
- `POST /rag/reindex` (Batch reindex all schemes from PostgreSQL)
