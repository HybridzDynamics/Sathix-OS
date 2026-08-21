const { Pool } = require('pg');

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined
    });
  }
  return pool;
}

/**
 * Save (upsert) a canonical record into Postgres.
 * @param {object} record
 * @returns {Promise<object>} saved record
 */
async function saveRecord(record) {
  const p = getPool();
  
  const cleanData = [
    record.id,
    record.name,
    record.description,
    record.department || null,
    record.category || null,
    record.state || null,
    record.eligibility || null,
    record.benefits || null,
    record.documentsRequired || null,
    record.applicationLink || null,
    record.sourceUrl || null
  ];

  const query = `
    INSERT INTO "Scheme" (id, name, description, department, category, state, eligibility, benefits, "documentsRequired", "applicationLink", "sourceUrl", status, origin)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'ACTIVE', 'SCRAPED')
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      department = EXCLUDED.department,
      category = EXCLUDED.category,
      state = EXCLUDED.state,
      eligibility = EXCLUDED.eligibility,
      benefits = EXCLUDED.benefits,
      "documentsRequired" = EXCLUDED."documentsRequired",
      "applicationLink" = EXCLUDED."applicationLink",
      "sourceUrl" = EXCLUDED."sourceUrl",
      "updatedAt" = NOW()
    RETURNING *;
  `;

  const { rows } = await p.query(query, cleanData);
  return rows[0];
}

module.exports = { saveRecord };
