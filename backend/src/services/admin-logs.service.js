function paging(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

async function listLogs(prisma, query) {
  const { page, limit, skip } = paging(query);
  const type = query.type === 'scraper' ? 'scraper' : query.type === 'audit' ? 'audit' : 'all';

  if (type === 'audit') {
    const where = query.action ? { action: { contains: query.action, mode: 'insensitive' } } : {};
    const [items, total] = await prisma.$transaction([
      prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.auditLog.count({ where })
    ]);
    return {
      items: items.map((row) => ({
        id: row.id,
        type: 'audit',
        action: row.action,
        entity: row.entity,
        entityId: row.entityId,
        details: row.details,
        createdAt: row.createdAt
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  if (type === 'scraper') {
    const where = query.status ? { status: query.status } : {};
    const [items, total] = await prisma.$transaction([
      prisma.scraperLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.scraperLog.count({ where })
    ]);
    return {
      items: items.map((row) => ({
        id: row.id,
        type: 'scraper',
        action: row.status,
        entity: 'ScraperLog',
        entityId: null,
        details: JSON.stringify({ sourceUrl: row.sourceUrl, meta: row.meta }),
        createdAt: row.createdAt
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  const [auditRows, scraperRows] = await Promise.all([
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.scraperLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  ]);

  const merged = [
    ...auditRows.map((row) => ({
      id: row.id,
      type: 'audit',
      action: row.action,
      entity: row.entity,
      entityId: row.entityId,
      details: row.details,
      createdAt: row.createdAt
    })),
    ...scraperRows.map((row) => ({
      id: row.id,
      type: 'scraper',
      action: row.status,
      entity: 'ScraperLog',
      entityId: null,
      details: JSON.stringify({ sourceUrl: row.sourceUrl, meta: row.meta }),
      createdAt: row.createdAt
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = merged.length;
  const items = merged.slice(skip, skip + limit);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

module.exports = { listLogs };
