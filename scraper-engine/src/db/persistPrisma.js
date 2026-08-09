const { getPrisma } = require('./prismaClient');

/**
 * Prisma persistence adapter. Upserts a `Scheme` record using the `id` key.
 * Expects `record` to follow the canonical format produced by `processor/formatter`.
 * @module db/persistPrisma
 */

/**
 * Save (upsert) a canonical record into Postgres via Prisma.
 * @param {object} record
 * @returns {Promise<object>} saved record
 */
async function saveRecord(record) {
  const prisma = getPrisma();
  const data = Object.assign({}, record, {
    attachments: record.attachments || null,
    meta: record.meta || null
  });

  // Use prisma.upsert to ensure idempotency
  const saved = await prisma.scheme.upsert({
    where: { id: data.id },
    update: {
      url: data.url,
      title: data.title,
      summary: data.summary,
      content: data.content,
      source: data.source,
      attachments: data.attachments,
      meta: data.meta,
      updatedAt: new Date()
    },
    create: {
      id: data.id,
      url: data.url,
      title: data.title,
      summary: data.summary,
      content: data.content,
      source: data.source,
      attachments: data.attachments,
      meta: data.meta
    }
  });

  return saved;
}

module.exports = { saveRecord };
