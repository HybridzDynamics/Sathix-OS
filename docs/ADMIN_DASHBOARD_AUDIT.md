# SathiX OS admin-dashboard audit (Phase 1)

Audit date: 2026-08-16

## Scope and architecture observed

The repository contains `admin-panel/`, `backend/`, `scraper-engine/`, `rag-service/`, `language-engine/`, and `voice-service/`. `frontend/` and `user-panel/` were deliberately excluded from this audit and must not be used by the admin implementation.

| Layer | Observed implementation |
| --- | --- |
| Admin frontend | Next.js 16 / React 19 / TypeScript, in `admin-panel/` |
| Backend | Express 4 / Node.js, in `backend/` |
| Database / ORM | PostgreSQL with Prisma |
| Authentication | JWT bearer token from `/api/auth/login`; seven-day expiry; browser stores token in `sessionStorage` |
| Admin authorization | Backend `authenticate` + `authorize(['ADMIN'])`; `SUPER_ADMIN` inherits admin access. Current database role is rechecked when Prisma is attached. |
| Scraping | BullMQ + Redis queue in the backend; scraper worker persists progress to PostgreSQL |
| RAG | Separate Express service backed by PostgreSQL and a Qdrant adapter; backend proxies privileged operations |
| Language / voice | Separate Express services with internal-token middleware and their own rate limits |

The connected admin frontend makes requests only to `NEXT_PUBLIC_BACKEND_URL`; it does not directly call PostgreSQL, Qdrant, or internal services. The backend performs the RAG calls using its server-side internal token.

## Feature status

Status means the feature is genuinely present end-to-end, not merely that a UI route or model exists.

| Feature | Frontend | Backend | Database | Integrated | Status | Evidence / gap |
| --- | --- | --- | --- | --- | --- | --- |
| Authentication | Login, session verification, logout, client route gate | Login and JWT issue | `User.passwordHash` | Yes | DONE | No refresh or server-side logout/revocation endpoint. |
| Authorization | Route shell verifies session | All current `/api/admin/*` routes require admin | `User.role`, `isActive` | Yes | DONE | Coarse role checks; no granular permission model. |
| Dashboard | Real overview page | Counts + service probes | Users, schemes, applications, chats, scraper logs | Partial | PARTIAL | Four shown metrics are real; remaining required metrics intentionally return `Not tracked`. |
| Users | Search/filter/pagination, status and role actions | List/detail/status/role APIs | `User`, `CitizenProfile`, `AuditLog` | Yes | DONE | UI needs confirmation dialogs and role-action capability awareness. |
| Roles | Role selector embedded in users page | Enum-based role assignment safeguards | `User.role` enum | Partial | PARTIAL | No roles/permissions page, permission catalog, or granular assignments. |
| Schemes | List/search/status/re-index | Paginated list/status/re-index | `Scheme`, `AuditLog` | Yes | DONE | No detail/history view or filter controls for every supported field. |
| Scraper | Job queue/list/status/retry/cancel | BullMQ orchestration | `ScraperJob`, `AuditLog` | Yes | DONE | Worker records basic statistics only; source management is mock-only. |
| RAG | Status and synchronous re-index | Proxies status/re-index/ingest | `Scheme.indexedAt`, `AuditLog` | Partial | PARTIAL | No persisted RAG jobs, counts, model metadata, retry queue, or disabled-content removal. |
| Knowledge base | RAG page | Scheme ingestion only | Scheme metadata | Partial | PARTIAL | No document model or document-level management. |
| AI analytics | Visual page exists | No API / telemetry aggregates | Chat messages only | No | MISSING | Page uses hard-coded chart values and must not ship as production analytics. |
| Languages | Page exists | Language service only; no backend admin proxy | Language on `User` | No | MISSING | No supported-language/model/metric admin API; page is not connected. |
| Audio | No admin page | Voice service only; no backend admin proxy | None | No | MISSING | No operational telemetry or admin endpoint. |
| Documents | No page | No admin API | Only `SchemeDocument` (required-document metadata) | No | MISSING | There is no uploaded/document-processing data model. |
| System health | Dashboard shows partial service availability | Backend/database/RAG plus language/voice probes | N/A | Partial | PARTIAL | Scraper and Qdrant are not independently and reliably reported through one protected admin endpoint. |
| Logs | Page exists | No admin log API | No structured system-log model | No | MISSING | Page uses mock logs. |
| Audit logs | No page | Admin actions write `AuditLog` | `AuditLog` | No | PARTIAL | No read API, actor column, request-id field, append-only constraint, or UI. |
| Notifications | No page | Helper only | `Notification` | No | PARTIAL | No admin notification generation, listing, read/unread or filtering API. |
| Settings | No page | No safe configuration API | None | No | MISSING | Environment configuration is server-side only, as it should be. |
| Jobs | Scraper jobs only | Scraper jobs only | `ScraperJob` | Partial | PARTIAL | No unified jobs API/model for RAG, embeddings, documents, or models. |
| API management | No page | No API-management API | None | No | MISSING | Not currently supported. |
| Security | Session gate; centralized API client | JWT auth, role checks, input validation on key actions | Account status and audit rows | Partial | PARTIAL | CORS is unrestricted; no CSRF strategy (bearer tokens), no rate limit on backend, and error handler can return unvetted `err.message`. |
| Monitoring | Partial overview | Health probes and queue counts | Some persisted data | Partial | PARTIAL | No normalized metrics/telemetry pipeline or service-level history. |

## Existing, verified admin API contracts

All routes below are prefixed by `/api/admin`, require `Authorization: Bearer <JWT>`, return 401 without a valid token and 403 for non-admin roles.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/session` | Verify admin session |
| GET | `/overview` | Database-backed counts and backend-owned health probes |
| GET | `/users?page=&limit=&search=&role=&isActive=` | Server-paginated users |
| GET | `/users/:id` | User details |
| PATCH | `/users/:id/status` | Set `isActive`; audited |
| PATCH | `/users/:id/role` | Assign enum role; super-admin safeguards; audited |
| GET | `/schemes?page=&limit=&search=&state=&category=&department=&status=&origin=&indexed=` | Server-paginated schemes |
| PATCH | `/schemes/:id/status` | Set ACTIVE/DISABLED/ARCHIVED; audited |
| POST | `/schemes/:id/reindex` | Backend-to-RAG ingest; audited |
| POST | `/scraper/jobs` | Queue a scraper job; returns 202 with `QUEUED` job |
| GET | `/scraper/jobs?page=&limit=&status=` | Persisted scraper jobs |
| GET | `/scraper/status` | Persisted job summary and queue counts |
| POST | `/scraper/jobs/:id/retry` | Retry failed/cancelled job |
| POST | `/scraper/jobs/:id/cancel` | Cancel waiting queue job |
| GET | `/rag/status` | Backend-to-RAG health status and known limitations |
| POST | `/rag/reindex` | Synchronous backend-to-RAG full reindex; audited |

`/api/auth/login` is the shared authentication endpoint. It must remain the sole admin-login authority; no new auth system is needed.

## Mock and disconnected UI inventory

Production-ineligible mock modules are present in `admin-panel/src/lib/mock-data/`:

- `logs.ts` (used by `/logs`)
- `scraper-jobs.ts` (used by `/approvals`)
- `sources.ts` (used by `/sources`)
- `users.ts` (currently unused)

`/analytics` contains hard-coded chart arrays. `/languages`, `/approvals`, `/logs`, and `/sources` have no matching backend admin contracts. These pages must be removed from navigation, clearly marked unavailable, or integrated only after the corresponding backend capability is implemented—never presented as real operational data.

## Service inventory

- **Scraper:** crawler and BullMQ worker exist; worker updates `ScraperJob` state in the shared database. It has no service HTTP health endpoint and source catalog is not backend-managed.
- **RAG:** exposes query, ingest, reindex, and health routes. RAG routes themselves currently do not visibly enforce the internal token, despite the backend sending it; this must be hardened before treating the service as private infrastructure.
- **Language:** exposes health, supported-language registry, translation, detection, transliteration, summarization, and embeddings. Health/language registry are public; operational metrics and model-management endpoints do not exist.
- **Voice:** exposes health, language/model registry, speech-to-text, text-to-speech, and voice query. It has service-token middleware available, but current router mounting needs an explicit security review before backend integration.

## Tests and verification already present

Backend tests cover the required baseline authorization behaviour (unauthenticated 401, citizen 403, admin allowed, super-admin allowed), server-side pagination, unsafe role/status actions, scraper input validation, and overview/RAG service behaviour. The admin panel has no component or E2E test setup. Internal services have service tests, but there is no complete cross-service admin E2E suite.

## Phase 2 recommendation: authentication and authorization hardening

No unsupported control pages should be built before Phase 2. The focused next step is to harden the existing auth boundary: standardize backend error responses, restrict CORS to configured origins, add backend rate limiting, verify internal-service token enforcement in RAG/voice, add request IDs to backend audit records, and add integration tests that run with a real Prisma-attached request context. This builds on, rather than duplicates, the existing JWT and role system.

## Phase 1 changes

- Created this audit report only.
- No application code, database schema, migrations, or service configuration was changed.
