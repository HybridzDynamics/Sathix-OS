const axios = require('axios');

const schemeSelect = { id: true, name: true, description: true, department: true, category: true, state: true, sourceUrl: true, status: true, origin: true, contentHash: true, lastScrapedAt: true, indexedAt: true, createdAt: true, updatedAt: true };
function paging(query = {}) { const page = Math.max(1, Number.parseInt(query.page, 10) || 1); const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25)); return { page, limit, skip: (page - 1) * limit }; }
function whereFor(query = {}) {
  const where = {};
  if (query.search) where.OR = ['name', 'description', 'category'].map((field) => ({ [field]: { contains: query.search, mode: 'insensitive' } }));
  for (const field of ['state', 'category', 'department', 'status', 'origin']) if (query[field]) where[field] = query[field];
  if (query.indexed === 'true') where.indexedAt = { not: null };
  if (query.indexed === 'false') where.indexedAt = null;
  return where;
}
async function listSchemes(prisma, query) { const { page, limit, skip } = paging(query); const where = whereFor(query); const [items, total] = await prisma.$transaction([prisma.scheme.findMany({ where, select: schemeSelect, orderBy: { updatedAt: 'desc' }, skip, take: limit }), prisma.scheme.count({ where })]); return { items, page, limit, total, totalPages: Math.ceil(total / limit) }; }
async function changeStatus(prisma, { actorId, schemeId, status, requestId }) {
  if (!['ACTIVE', 'DISABLED', 'ARCHIVED'].includes(status)) { const error = new Error('Unsupported scheme status.'); error.status = 422; throw error; }
  const scheme = await prisma.scheme.update({ where: { id: schemeId }, data: { status }, select: schemeSelect });
  await prisma.auditLog.create({ data: { action: 'SCHEME_STATUS_CHANGED', entity: 'Scheme', entityId: schemeId, details: JSON.stringify({ actorId, status, requestId }) } });
  return scheme;
}
function indexPayload(scheme) { return { id: scheme.id, text: [scheme.name, scheme.description, scheme.eligibility, scheme.benefits].filter(Boolean).join('\n'), meta: { title: scheme.name, category: scheme.category, state: scheme.state, source: scheme.sourceUrl } }; }
async function reindex(prisma, { actorId, schemeId, requestId }) {
  const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
  if (!scheme) { const error = new Error('Scheme not found.'); error.status = 404; throw error; }
  if (scheme.status !== 'ACTIVE') { const error = new Error('Only active schemes can be indexed.'); error.status = 409; throw error; }
  try {
    const headers = { 'Content-Type': 'application/json', ...(process.env.INTERNAL_SERVICE_TOKEN ? { 'x-internal-token': process.env.INTERNAL_SERVICE_TOKEN } : {}), ...(requestId ? { 'x-request-id': requestId } : {}) };
    await axios.post(`${process.env.RAG_ENGINE_URL || 'http://localhost:3001'}/rag/ingest`, indexPayload(scheme), { headers, timeout: Number(process.env.RAG_TIMEOUT_MS || 15000) });
  } catch (cause) { const error = new Error('RAG indexing is currently unavailable.'); error.code = 'RAG_UNAVAILABLE'; error.status = 503; throw error; }
  const indexed = await prisma.scheme.update({ where: { id: schemeId }, data: { indexedAt: new Date() }, select: schemeSelect });
  await prisma.auditLog.create({ data: { action: 'SCHEME_REINDEXED', entity: 'Scheme', entityId: schemeId, details: JSON.stringify({ actorId, requestId }) } });
  return indexed;
}
module.exports = { listSchemes, changeStatus, reindex };
