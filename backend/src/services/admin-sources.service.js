const { URL } = require('url');

const sourceSelect = { id: true, url: true, title: true, state: true, createdAt: true };

function paging(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

function validUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

async function listSources(prisma, query) {
  const { page, limit, skip } = paging(query);
  const where = query.search
    ? { OR: [{ url: { contains: query.search, mode: 'insensitive' } }, { title: { contains: query.search, mode: 'insensitive' } }] }
    : {};
  const [items, total] = await prisma.$transaction([
    prisma.schemeSource.findMany({ where, select: sourceSelect, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.schemeSource.count({ where })
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function createSource(prisma, { url, title, state, actorId, requestId }) {
  if (!validUrl(url)) {
    const error = new Error('url must be a valid HTTP(S) URL.');
    error.status = 422;
    throw error;
  }
  const source = await prisma.schemeSource.create({
    data: { url, title: title || null, state: state || null },
    select: sourceSelect
  });
  await prisma.auditLog.create({
    data: { action: 'SOURCE_CREATED', entity: 'SchemeSource', entityId: source.id, details: JSON.stringify({ actorId, url, requestId }) }
  });
  return source;
}

async function deleteSource(prisma, { id, actorId, requestId }) {
  const existing = await prisma.schemeSource.findUnique({ where: { id }, select: sourceSelect });
  if (!existing) {
    const error = new Error('Source not found.');
    error.status = 404;
    throw error;
  }
  await prisma.schemeSource.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { action: 'SOURCE_DELETED', entity: 'SchemeSource', entityId: id, details: JSON.stringify({ actorId, url: existing.url, requestId }) }
  });
  return existing;
}

module.exports = { listSources, createSource, deleteSource };
