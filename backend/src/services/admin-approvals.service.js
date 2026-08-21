const schemeSelect = {
  id: true, name: true, description: true, department: true, category: true,
  state: true, sourceUrl: true, status: true, origin: true, lastScrapedAt: true,
  createdAt: true, updatedAt: true
};

function paging(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

async function listPending(prisma, query) {
  const { page, limit, skip } = paging(query);
  const where = { status: 'DISABLED', origin: 'SCRAPED' };
  const [items, total] = await prisma.$transaction([
    prisma.scheme.findMany({ where, select: schemeSelect, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.scheme.count({ where })
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function approve(prisma, { schemeId, actorId, requestId }) {
  const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
  if (!scheme) {
    const error = new Error('Scheme not found.');
    error.status = 404;
    throw error;
  }
  if (scheme.status !== 'DISABLED' || scheme.origin !== 'SCRAPED') {
    const error = new Error('Only scraped schemes awaiting review can be approved.');
    error.status = 409;
    throw error;
  }
  const updated = await prisma.scheme.update({
    where: { id: schemeId },
    data: { status: 'ACTIVE' },
    select: schemeSelect
  });
  await prisma.auditLog.create({
    data: { action: 'SCHEME_APPROVED', entity: 'Scheme', entityId: schemeId, details: JSON.stringify({ actorId, requestId }) }
  });
  return updated;
}

async function reject(prisma, { schemeId, actorId, requestId }) {
  const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
  if (!scheme) {
    const error = new Error('Scheme not found.');
    error.status = 404;
    throw error;
  }
  if (scheme.status !== 'DISABLED' || scheme.origin !== 'SCRAPED') {
    const error = new Error('Only scraped schemes awaiting review can be rejected.');
    error.status = 409;
    throw error;
  }
  const updated = await prisma.scheme.update({
    where: { id: schemeId },
    data: { status: 'ARCHIVED' },
    select: schemeSelect
  });
  await prisma.auditLog.create({
    data: { action: 'SCHEME_REJECTED', entity: 'Scheme', entityId: schemeId, details: JSON.stringify({ actorId, requestId }) }
  });
  return updated;
}

module.exports = { listPending, approve, reject };
