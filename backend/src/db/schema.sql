-- SathiX-OS PostgreSQL schema (replaces Prisma)

CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  "passwordHash" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CITIZEN',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "lastActiveAt" TIMESTAMPTZ,
  language TEXT NOT NULL DEFAULT 'ENGLISH',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "CitizenProfile" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT,
  state TEXT,
  district TEXT,
  occupation TEXT,
  income TEXT,
  education TEXT,
  category TEXT,
  disability TEXT,
  "familyDetails" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Scheme" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  department TEXT,
  category TEXT,
  state TEXT,
  eligibility TEXT,
  benefits TEXT,
  "documentsRequired" TEXT,
  "applicationLink" TEXT,
  "sourceUrl" TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  origin TEXT NOT NULL DEFAULT 'SCRAPED',
  "contentHash" TEXT,
  "lastScrapedAt" TIMESTAMPTZ,
  "indexedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SchemeSource" (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  state TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SchemeCategory" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SchemeDocument" (
  id TEXT PRIMARY KEY,
  "schemeId" TEXT NOT NULL REFERENCES "Scheme"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "Application" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "schemeId" TEXT NOT NULL REFERENCES "Scheme"(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  "submittedDate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ChatSession" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ChatMessage" (
  id TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL REFERENCES "ChatSession"(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ScraperLog" (
  id TEXT PRIMARY KEY,
  "sourceUrl" TEXT NOT NULL,
  status TEXT NOT NULL,
  meta TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ScraperJob" (
  id TEXT PRIMARY KEY,
  "queueJobId" TEXT UNIQUE,
  "sourceUrl" TEXT NOT NULL,
  "sourceName" TEXT,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  "startedAt" TIMESTAMPTZ,
  "completedAt" TIMESTAMPTZ,
  "pagesProcessed" INTEGER NOT NULL DEFAULT 0,
  "pagesFailed" INTEGER NOT NULL DEFAULT 0,
  "schemesDiscovered" INTEGER NOT NULL DEFAULT 0,
  "newSchemes" INTEGER,
  "updatedSchemes" INTEGER,
  "failedItems" INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "triggeredBy" TEXT,
  "requestId" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Notification" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  "entityId" TEXT,
  details TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheme_status ON "Scheme"(status);
CREATE INDEX IF NOT EXISTS idx_scheme_origin ON "Scheme"(origin);
CREATE INDEX IF NOT EXISTS idx_application_user ON "Application"("userId");
CREATE INDEX IF NOT EXISTS idx_chat_session_user ON "ChatSession"("userId");
CREATE INDEX IF NOT EXISTS idx_chat_message_session ON "ChatMessage"("sessionId");
CREATE INDEX IF NOT EXISTS idx_scraper_job_status ON "ScraperJob"(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON "AuditLog"("createdAt" DESC);
