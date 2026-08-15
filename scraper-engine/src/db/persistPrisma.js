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
  
  // Clean up object for Prisma to ensure we don't pass undefined where null is expected
  const cleanData = {
    id: record.id,
    name: record.name,
    description: record.description,
    department: record.department,
    category: record.category,
    state: record.state,
    eligibility: record.eligibility,
    benefits: record.benefits,
    documentsRequired: record.documentsRequired,
    applicationLink: record.applicationLink,
    sourceUrl: record.sourceUrl
  };

  // Use prisma.upsert to ensure idempotency
  const saved = await prisma.scheme.upsert({
    where: { id: cleanData.id },
    update: {
      ...cleanData,
      updatedAt: new Date()
    },
    create: {
      ...cleanData
    }
  });

  return saved;
}

module.exports = { saveRecord };
