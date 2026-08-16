# Phase 3 — Central API client and operational overview

## Implemented

- Kept the dashboard’s HTTP traffic in `admin-panel/src/services/`; UI components continue to use service functions rather than direct `fetch` calls.
- Enhanced the shared API client to attach a correlation ID to every backend request, omit ambient browser cookies, and surface the backend request ID with errors for support investigation.
- Expanded `/api/admin/overview` with only persisted database values:
  - total users and active accounts;
  - total, active, and indexed schemes;
  - applications;
  - citizen chat queries;
  - total, completed, and failed scraper jobs.
- Added separate RAG and Qdrant health status derived from the backend-to-RAG health probe.
- Updated the dashboard to display the real metrics, service health, and a clear list of metrics the platform does **not** record yet.
- Removed a Google-font build dependency from the app shell so the panel does not require external font-network access during its build.

## Files created or modified

- `backend/src/services/admin-overview.service.js`
- `backend/tests/admin-overview.service.test.js`
- `admin-panel/src/services/api.ts`
- `admin-panel/src/app/dashboard/page.tsx`
- `admin-panel/src/app/layout.tsx`

## Backend endpoint used

`GET /api/admin/overview` with the existing bearer-token admin authorization. No new public endpoint was introduced.

## Database changes

None. The overview reads existing `User`, `Scheme`, `Application`, `ChatMessage`, and `ScraperJob` state.

## Security implications

- The browser sends no cookies with dashboard API requests; the existing bearer token remains the authentication mechanism.
- Request IDs are propagated from the central client to backend logs and errors.
- The dashboard deliberately labels unavailable telemetry as untracked. It does not substitute sample data.

## Run and test

```powershell
cd C:\Users\moham\Desktop\Sathix-OS\backend
npm.cmd test

cd C:\Users\moham\Desktop\Sathix-OS\admin-panel
npm.cmd run lint
npm.cmd run build
```

Completed verification:

- Backend tests: 20 passed.
- The admin-panel lint/build reach project-wide pre-existing failures in unsupported mock pages and an existing Next type-resolution issue. The changed dashboard and API-client files have no reported lint/type error.

## Remaining work

Phase 4 should complete user and role management: add confirmations and capability-aware controls to the connected users page, then add only the role/permission UI and API capabilities that the backend can enforce.
