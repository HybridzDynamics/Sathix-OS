# SathiX RAG Service

Independent Retrieval-Augmented-Generation (RAG) microservice for SathiX OS.

Structure scaffolded for Clean Architecture. Implemented phases incrementally for a service that:
- reads scraped content from Postgres
- generates embeddings via a swappable provider
- supports a vector store adapter (in-memory now, Qdrant later)
- performs retrieval with language detection, ranking, and prompt construction
- exposes `/rag/query` and `/rag/reindex`

## API Endpoints

POST /rag/query
- body: `{ "query": "...", "topK": 5, "filters": { ... }, "maxTokens": 1200 }`
- response: `{ "status": "ok", "data": { "query", "prompt", "retrieval", "answer" } }`

POST /rag/reindex
- body: `{}`
- response: `{ "status": "reindex completed", "result": { "ok": true, "count": n } }`

## Environment

Use `.env.example` as a template.

Key variables:
- `DATABASE_URL` - Postgres/Neon connection string
- `VECTOR_STORE` - `memory` or `qdrant`
- `EMBEDDING_PROVIDER` - `none`/`noop` or future providers
- `ANSWER_GENERATOR` - `noop` or future LLM generator
- `LANGUAGE_DETECTOR` - `simple` or future language detectors
- `EMBEDDING_DIM` - embedding vector dimension
- `LOG_LEVEL` - `debug`, `info`, `warn`, `error`

See `docs/architecture.md`, `docs/api.md`, and `docs/usage.md` for detailed documentation.
