const { query } = require('./pool');
const { createId } = require('./id');

function rowToUser(row, profile = null) {
  if (!row) return null;
  const user = {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role,
    isActive: row.isActive,
    lastActiveAt: row.lastActiveAt,
    language: row.language,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
  if (profile !== undefined) {
    user.profile = profile ? {
      state: profile.state,
      district: profile.district,
      age: profile.age,
      gender: profile.gender,
      occupation: profile.occupation,
      income: profile.income,
      education: profile.education,
      category: profile.category,
      disability: profile.disability,
      familyDetails: profile.familyDetails
    } : null;
  }
  return user;
}

function rowToScheme(row) {
  if (!row) return null;
  return { ...row };
}

async function ping() {
  await query('SELECT 1');
}

// ── Users ─────────────────────────────────────────────────────
async function findUserById(id, withProfile = false) {
  const { rows } = await query('SELECT * FROM "User" WHERE id = $1', [id]);
  if (!rows[0]) return null;
  if (!withProfile) return rowToUser(rows[0]);
  const profile = await findProfileByUserId(id);
  return rowToUser(rows[0], profile);
}

async function findUserAuthById(id) {
  const { rows } = await query('SELECT id, role, "isActive" FROM "User" WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findUserByMobile(mobile) {
  const { rows } = await query('SELECT * FROM "User" WHERE mobile = $1', [mobile]);
  return rows[0] || null;
}

async function createUser(data) {
  const id = createId();
  const { rows } = await query(
    `INSERT INTO "User" (id, name, mobile, email, "passwordHash", role, language)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [id, data.name, data.mobile, data.email || null, data.passwordHash, data.role || 'CITIZEN', data.language || 'ENGLISH']
  );
  return rows[0];
}

async function updateUser(id, data) {
  const fields = [];
  const values = [];
  let i = 1;
  for (const [key, value] of Object.entries(data)) {
    fields.push(`"${key}" = $${i++}`);
    values.push(value);
  }
  fields.push(`"updatedAt" = NOW()`);
  values.push(id);
  const { rows } = await query(`UPDATE "User" SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return rows[0];
}

async function listUsers({ search, role, isActive, skip, limit }) {
  const clauses = [];
  const values = [];
  let i = 1;
  if (search) {
    clauses.push(`(name ILIKE $${i} OR mobile ILIKE $${i} OR email ILIKE $${i})`);
    values.push(`%${search}%`);
    i += 1;
  }
  if (role) { clauses.push(`role = $${i++}`); values.push(role); }
  if (isActive !== undefined) { clauses.push(`"isActive" = $${i++}`); values.push(isActive); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "User" ${where}`, values);
  values.push(limit, skip);
  const { rows } = await query(
    `SELECT u.*, cp.state, cp.district FROM "User" u
     LEFT JOIN "CitizenProfile" cp ON cp."userId" = u.id
     ${where} ORDER BY u."createdAt" DESC LIMIT $${i++} OFFSET $${i}`,
    values
  );
  const items = rows.map((row) => rowToUser(row, row.state || row.district ? { state: row.state, district: row.district } : null));
  return { items, total: countResult.rows[0].total };
}

// ── Profiles ──────────────────────────────────────────────────
async function findProfileByUserId(userId) {
  const { rows } = await query('SELECT * FROM "CitizenProfile" WHERE "userId" = $1', [userId]);
  return rows[0] || null;
}

async function upsertProfile(userId, data) {
  const existing = await findProfileByUserId(userId);
  const fields = ['age', 'gender', 'state', 'district', 'occupation', 'income', 'education', 'category', 'disability', 'familyDetails'];
  if (existing) {
    const sets = [];
    const values = [];
    let i = 1;
    for (const field of fields) {
      if (data[field] !== undefined) { sets.push(`"${field}" = $${i++}`); values.push(data[field]); }
    }
    sets.push('"updatedAt" = NOW()');
    values.push(userId);
    const { rows } = await query(`UPDATE "CitizenProfile" SET ${sets.join(', ')} WHERE "userId" = $${i} RETURNING *`, values);
    return rows[0];
  }
  const id = createId();
  const { rows } = await query(
    `INSERT INTO "CitizenProfile" (id, "userId", age, gender, state, district, occupation, income, education, category, disability, "familyDetails")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, userId, data.age ?? null, data.gender ?? null, data.state ?? null, data.district ?? null, data.occupation ?? null, data.income ?? null, data.education ?? null, data.category ?? null, data.disability ?? null, data.familyDetails ?? null]
  );
  return rows[0];
}

// ── Schemes ───────────────────────────────────────────────────
async function listSchemes(filters = {}, skip = 0, limit = 25) {
  const clauses = [];
  const values = [];
  let i = 1;
  if (filters.search) {
    clauses.push(`(name ILIKE $${i} OR description ILIKE $${i} OR category ILIKE $${i})`);
    values.push(`%${filters.search}%`);
    i += 1;
  }
  for (const key of ['state', 'category', 'department', 'status', 'origin']) {
    if (filters[key]) { clauses.push(`"${key === 'status' || key === 'origin' ? key : key}" = $${i++}`); values.push(filters[key]); }
  }
  if (filters.indexed === true) clauses.push('"indexedAt" IS NOT NULL');
  if (filters.indexed === false) clauses.push('"indexedAt" IS NULL');
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "Scheme" ${where}`, values);
  values.push(limit, skip);
  const { rows } = await query(`SELECT * FROM "Scheme" ${where} ORDER BY "updatedAt" DESC LIMIT $${i++} OFFSET $${i}`, values);
  return { items: rows, total: countResult.rows[0].total };
}

async function findAllActiveSchemes() {
  const { rows } = await query('SELECT * FROM "Scheme" WHERE status = $1 ORDER BY "createdAt" DESC', ['ACTIVE']);
  return rows;
}

async function findAllSchemes() {
  const { rows } = await query('SELECT * FROM "Scheme" ORDER BY "createdAt" DESC');
  return rows;
}

async function findSchemeById(id) {
  const { rows } = await query('SELECT * FROM "Scheme" WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateScheme(id, data) {
  const fields = [];
  const values = [];
  let i = 1;
  for (const [key, value] of Object.entries(data)) {
    fields.push(`"${key}" = $${i++}`);
    values.push(value);
  }
  fields.push('"updatedAt" = NOW()');
  values.push(id);
  const { rows } = await query(`UPDATE "Scheme" SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return rows[0];
}

async function upsertScheme(record) {
  const { rows } = await query(
    `INSERT INTO "Scheme" (id, name, description, department, category, state, eligibility, benefits, "documentsRequired", "applicationLink", "sourceUrl", status, origin, "contentHash", "lastScrapedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, description = EXCLUDED.description, department = EXCLUDED.department,
       category = EXCLUDED.category, state = EXCLUDED.state, eligibility = EXCLUDED.eligibility,
       benefits = EXCLUDED.benefits, "documentsRequired" = EXCLUDED."documentsRequired",
       "applicationLink" = EXCLUDED."applicationLink", "sourceUrl" = EXCLUDED."sourceUrl",
       "contentHash" = EXCLUDED."contentHash", "lastScrapedAt" = EXCLUDED."lastScrapedAt",
       "updatedAt" = NOW()
     RETURNING *`,
    [record.id, record.name, record.description, record.department || null, record.category || null, record.state || null,
      record.eligibility || null, record.benefits || null, record.documentsRequired || null, record.applicationLink || null,
      record.sourceUrl || null, record.status || 'ACTIVE', record.origin || 'SCRAPED', record.contentHash || null, record.lastScrapedAt || null]
  );
  return rows[0];
}

async function countSchemes(where = {}) {
  const clauses = [];
  const values = [];
  let i = 1;
  if (where.status) { clauses.push(`status = $${i++}`); values.push(where.status); }
  if (where.indexed) { clauses.push('"indexedAt" IS NOT NULL'); }
  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(`SELECT COUNT(*)::int AS count FROM "Scheme" ${whereSql}`, values);
  return rows[0].count;
}

async function groupSchemesBy(field, where = {}) {
  const clauses = [];
  const values = [];
  let i = 1;
  if (where.status) { clauses.push(`status = $${i++}`); values.push(where.status); }
  if (where.categoryNotNull) { clauses.push('category IS NOT NULL'); }
  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const col = field === 'state' ? 'state' : 'category';
  const { rows } = await query(`SELECT ${col} AS key, COUNT(*)::int AS count FROM "Scheme" ${whereSql} GROUP BY ${col}`, values);
  return rows;
}

// ── Applications ──────────────────────────────────────────────
async function createApplication(userId, schemeId) {
  const id = createId();
  const { rows } = await query(
    `INSERT INTO "Application" (id, "userId", "schemeId", status, "submittedDate")
     VALUES ($1,$2,$3,'SUBMITTED',NOW()) RETURNING *`,
    [id, userId, schemeId]
  );
  return rows[0];
}

async function findApplicationsByUser(userId) {
  const { rows } = await query(
    `SELECT a.*, s.id AS "scheme_id", s.name AS "scheme_name", s.description AS "scheme_description",
            s.department AS "scheme_department", s.category AS "scheme_category", s.benefits AS "scheme_benefits",
            s.eligibility AS "scheme_eligibility", s."documentsRequired" AS "scheme_documentsRequired",
            s."applicationLink" AS "scheme_applicationLink", s."sourceUrl" AS "scheme_sourceUrl"
     FROM "Application" a JOIN "Scheme" s ON s.id = a."schemeId"
     WHERE a."userId" = $1 ORDER BY a."createdAt" DESC`,
    [userId]
  );
  return rows.map((row) => ({
    id: row.id, userId: row.userId, schemeId: row.schemeId, status: row.status,
    submittedDate: row.submittedDate, createdAt: row.createdAt, updatedAt: row.updatedAt,
    scheme: { id: row.scheme_id, name: row.scheme_name, description: row.scheme_description, department: row.scheme_department, category: row.scheme_category, benefits: row.scheme_benefits, eligibility: row.scheme_eligibility, documentsRequired: row.scheme_documentsRequired, applicationLink: row.scheme_applicationLink, sourceUrl: row.scheme_sourceUrl }
  }));
}

async function findApplicationById(id) {
  const { rows } = await query(
    `SELECT a.*, s.* FROM "Application" a JOIN "Scheme" s ON s.id = a."schemeId" WHERE a.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function countApplications() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM "Application"');
  return rows[0].count;
}

async function groupApplicationsByStatus() {
  const { rows } = await query('SELECT status, COUNT(*)::int AS count FROM "Application" GROUP BY status');
  return rows;
}

// ── Chat ──────────────────────────────────────────────────────
async function findChatSessionForUser(id, userId) {
  const { rows } = await query('SELECT * FROM "ChatSession" WHERE id = $1 AND "userId" = $2', [id, userId]);
  return rows[0] || null;
}

async function createChatSession(userId) {
  const id = createId();
  const { rows } = await query('INSERT INTO "ChatSession" (id, "userId") VALUES ($1,$2) RETURNING *', [id, userId]);
  return rows[0];
}

async function addChatMessages(messages) {
  for (const message of messages) {
    await query(
      'INSERT INTO "ChatMessage" (id, "sessionId", role, content) VALUES ($1,$2,$3,$4)',
      [createId(), message.sessionId, message.role, message.content]
    );
  }
}

async function getChatSessionWithMessages(id) {
  const sessionResult = await query('SELECT * FROM "ChatSession" WHERE id = $1', [id]);
  if (!sessionResult.rows[0]) return null;
  const messagesResult = await query('SELECT * FROM "ChatMessage" WHERE "sessionId" = $1 ORDER BY "createdAt" ASC', [id]);
  return { ...sessionResult.rows[0], messages: messagesResult.rows };
}

async function listChatSessionsByUser(userId) {
  const sessions = await query('SELECT * FROM "ChatSession" WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
  const result = [];
  for (const session of sessions.rows) {
    const messages = await query('SELECT * FROM "ChatMessage" WHERE "sessionId" = $1 ORDER BY "createdAt" ASC', [session.id]);
    result.push({ ...session, messages: messages.rows });
  }
  return result;
}

async function countChatMessages(where = {}) {
  if (where.role) {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM "ChatMessage" WHERE role = $1', [where.role]);
    return rows[0].count;
  }
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM "ChatMessage"');
  return rows[0].count;
}

async function listRecentUserMessages(since) {
  const { rows } = await query('SELECT "createdAt" FROM "ChatMessage" WHERE role = $1 AND "createdAt" >= $2 ORDER BY "createdAt" ASC', ['user', since]);
  return rows;
}

// ── Scraper jobs ──────────────────────────────────────────────
const scraperJobColumns = `id, "queueJobId", "sourceUrl", "sourceName", status, "startedAt", "completedAt", "pagesProcessed", "pagesFailed", "schemesDiscovered", "newSchemes", "updatedSchemes", "failedItems", error, "retryCount", "triggeredBy", "requestId", "createdAt", "updatedAt"`;

async function createScraperJob(data) {
  const id = createId();
  const { rows } = await query(
    `INSERT INTO "ScraperJob" (id, "sourceUrl", "sourceName", status, "triggeredBy", "requestId")
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${scraperJobColumns}`,
    [id, data.sourceUrl, data.sourceName || null, data.status || 'QUEUED', data.triggeredBy || null, data.requestId || null]
  );
  return rows[0];
}

async function updateScraperJob(id, data) {
  const fields = [];
  const values = [];
  let i = 1;
  for (const [key, value] of Object.entries(data)) {
    fields.push(`"${key}" = $${i++}`);
    values.push(value);
  }
  fields.push('"updatedAt" = NOW()');
  values.push(id);
  const { rows } = await query(`UPDATE "ScraperJob" SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${scraperJobColumns}`, values);
  return rows[0];
}

async function findScraperJobById(id) {
  const { rows } = await query(`SELECT ${scraperJobColumns} FROM "ScraperJob" WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function listScraperJobs(status, skip, limit) {
  const values = [];
  let where = '';
  if (status) { where = 'WHERE status = $1'; values.push(status); }
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "ScraperJob" ${where}`, values);
  values.push(limit, skip);
  const offsetIdx = values.length - 1;
  const limitIdx = values.length - 2;
  const { rows } = await query(`SELECT ${scraperJobColumns} FROM "ScraperJob" ${where} ORDER BY "createdAt" DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`, values);
  return { items: rows, total: countResult.rows[0].total };
}

async function countScraperJobs(where = {}) {
  if (where.status) {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM "ScraperJob" WHERE status = $1', [where.status]);
    return rows[0].count;
  }
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM "ScraperJob"');
  return rows[0].count;
}

async function groupScraperJobsByStatus() {
  const { rows } = await query('SELECT status, COUNT(*)::int AS count FROM "ScraperJob" GROUP BY status');
  return rows;
}

async function findLatestScraperJob() {
  const { rows } = await query(`SELECT ${scraperJobColumns} FROM "ScraperJob" ORDER BY "createdAt" DESC LIMIT 1`);
  return rows[0] || null;
}

// ── Audit / logs / sources ────────────────────────────────────
async function createAuditLog(data) {
  const id = createId();
  await query('INSERT INTO "AuditLog" (id, action, entity, "entityId", details) VALUES ($1,$2,$3,$4,$5)', [id, data.action, data.entity, data.entityId || null, data.details || null]);
}

async function listAuditLogs({ action, skip, limit }) {
  const values = [];
  let where = '';
  if (action) { where = 'WHERE action ILIKE $1'; values.push(`%${action}%`); }
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "AuditLog" ${where}`, values);
  values.push(limit, skip);
  const { rows } = await query(`SELECT * FROM "AuditLog" ${where} ORDER BY "createdAt" DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  return { items: rows, total: countResult.rows[0].total };
}

async function listScraperLogs({ status, skip, limit }) {
  const values = [];
  let where = '';
  if (status) { where = 'WHERE status = $1'; values.push(status); }
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "ScraperLog" ${where}`, values);
  values.push(limit, skip);
  const { rows } = await query(`SELECT * FROM "ScraperLog" ${where} ORDER BY "createdAt" DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  return { items: rows, total: countResult.rows[0].total };
}

async function listRecentAuditLogs(limit = 200) {
  const { rows } = await query('SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT $1', [limit]);
  return rows;
}

async function listRecentScraperLogs(limit = 200) {
  const { rows } = await query('SELECT * FROM "ScraperLog" ORDER BY "createdAt" DESC LIMIT $1', [limit]);
  return rows;
}

async function listSchemeSources({ search, skip, limit }) {
  const values = [];
  let where = '';
  if (search) { where = 'WHERE url ILIKE $1 OR title ILIKE $1'; values.push(`%${search}%`); }
  const countResult = await query(`SELECT COUNT(*)::int AS total FROM "SchemeSource" ${where}`, values);
  values.push(limit, skip);
  const { rows } = await query(`SELECT * FROM "SchemeSource" ${where} ORDER BY "createdAt" DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  return { items: rows, total: countResult.rows[0].total };
}

async function createSchemeSource(data) {
  const id = createId();
  const { rows } = await query('INSERT INTO "SchemeSource" (id, url, title, state) VALUES ($1,$2,$3,$4) RETURNING *', [id, data.url, data.title || null, data.state || null]);
  return rows[0];
}

async function findSchemeSourceById(id) {
  const { rows } = await query('SELECT * FROM "SchemeSource" WHERE id = $1', [id]);
  return rows[0] || null;
}

async function deleteSchemeSource(id) {
  const { rows } = await query('DELETE FROM "SchemeSource" WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

async function createNotification(data) {
  const id = createId();
  const { rows } = await query('INSERT INTO "Notification" (id, "userId", title, body) VALUES ($1,$2,$3,$4) RETURNING *', [id, data.userId, data.title, data.body]);
  return rows[0];
}

// ── Counts / analytics ──────────────────────────────────────
async function countUsers(where = {}) {
  if (where.isActive !== undefined) {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM "User" WHERE "isActive" = $1', [where.isActive]);
    return rows[0].count;
  }
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM "User"');
  return rows[0].count;
}

async function groupUsersByLanguage() {
  const { rows } = await query('SELECT language, COUNT(*)::int AS count FROM "User" GROUP BY language');
  return rows;
}

module.exports = {
  ping,
  findUserById, findUserAuthById, findUserByMobile, createUser, updateUser, listUsers, countUsers, groupUsersByLanguage,
  findProfileByUserId, upsertProfile,
  listSchemes, findAllSchemes, findAllActiveSchemes, findSchemeById, updateScheme, upsertScheme, countSchemes, groupSchemesBy,
  createApplication, findApplicationsByUser, findApplicationById, countApplications, groupApplicationsByStatus,
  findChatSessionForUser, createChatSession, addChatMessages, getChatSessionWithMessages, listChatSessionsByUser, countChatMessages, listRecentUserMessages,
  createScraperJob, updateScraperJob, findScraperJobById, listScraperJobs, countScraperJobs, groupScraperJobsByStatus, findLatestScraperJob,
  createAuditLog, listAuditLogs, listScraperLogs, listRecentAuditLogs, listRecentScraperLogs,
  listSchemeSources, createSchemeSource, findSchemeSourceById, deleteSchemeSource,
  createNotification
};
