# Phase 2 — Authentication and authorization hardening

## Implemented

- Retained the existing `/api/auth/login` JWT flow; no duplicate authentication system was added.
- Added a server-generated request ID for every backend request. Valid caller-supplied IDs are preserved; unsafe values are replaced.
- Restricted CORS to `CORS_ALLOWED_ORIGINS` (default: local admin panel) and removed the prior allow-all policy.
- Added configurable API and login rate limits. Login limits are scoped by IP and supplied mobile identifier.
- Disabled Express fingerprinting via `X-Powered-By`.
- Made backend error responses safe: unexpected failures now return a generic message and request ID, while server logs retain the original error.
- Audited successful administrator logins using the existing `AuditLog` model; credentials are never recorded and audit-log failure cannot prevent login.
- Preserved database-backed role/status verification on authenticated requests, ensuring a stale JWT loses access immediately after a role change or deactivation.
- Enforced `x-internal-token` on RAG query, ingest, and reindex routes when `INTERNAL_SERVICE_TOKEN` is configured. The health route remains probeable.
- Prevented backend startup with the example or missing `JWT_SECRET`.

## Files created or modified

- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/middleware/errorHandler.js`
- `backend/src/middleware/request-id.js` (new)
- `backend/src/middleware/rate-limit.js` (new)
- `backend/tests/security.middleware.test.js` (new)
- `backend/.env.example`
- `rag-service/src/api/routes/rag.routes.js`
- `rag-service/src/middleware/serviceAuth.js` (new)

## APIs affected

All backend API responses now receive `X-Request-ID`; throttled calls return `429` with a request ID. Existing authentication and admin contracts remain unchanged:

- `POST /api/auth/login`
- all `/api/admin/*` routes
- `POST /rag/query`, `POST /rag/ingest`, `POST /rag/reindex` (now require the service token when configured)

## Database changes

None. Successful admin login events use the existing `AuditLog` table.

## Security implications and deployment requirements

- Set a strong, unique `JWT_SECRET`; the server now refuses to start with the example value.
- Set `CORS_ALLOWED_ORIGINS` to the deployed admin-panel origin(s), comma-separated. Do not use `*`.
- Set the same non-empty `INTERNAL_SERVICE_TOKEN` in backend and RAG environments, and keep the RAG service off the public internet.
- Tune `API_RATE_LIMIT_*` and `AUTH_RATE_LIMIT_*` for the production deployment. The in-memory limiter is appropriate for a single backend instance; it must move to Redis or edge rate limiting before multi-instance deployment.
- JWTs remain stateless, with the existing seven-day expiry and no refresh/revocation store. Database role/status checks mitigate demotion/deactivation; token rotation/revocation is a later hardening item.

## Run and test

```powershell
cd C:\Users\moham\Desktop\Sathix-OS\backend
npm.cmd run dev
npm.cmd test
```

Validation completed: `npm.cmd test` — 20 passing tests, including unauthenticated 401, non-admin 403, stale-admin-token rejection, CORS rejection, rate-limit 429, and RAG service-token enforcement.

## Remaining work

Phase 3: centralize the admin API client’s request-ID/error behaviour and expand the dashboard overview using only backend-tracked metrics. Analytics and operational metrics must remain absent or explicitly untracked until their backend telemetry exists.
