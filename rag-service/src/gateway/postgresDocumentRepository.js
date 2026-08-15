const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({ connectionString: config.DATABASE_URL });

// Helper to try multiple table name variants (Prisma model may map differently)
// Prisma by default creates a table named exactly as the model, case-sensitive.
// In Postgres, unquoted identifiers are lowercased. Prisma quotes them so "Scheme" != scheme.
const TABLE_CANDIDATES = ['"Scheme"', 'scheme', '"scheme"', '"schemes"', 'schemes'];

async function resolveTable(client) {
  // Try each candidate with a lightweight existence check
  for (const t of TABLE_CANDIDATES) {
    try {
      const res = await client.query(`SELECT 1 FROM ${t} LIMIT 0`);
      return t; // If we get here, the table exists
    } catch {
      // table doesn't exist under this name, try next
    }
  }
  // Last resort: information_schema search
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name ILIKE '%scheme%' LIMIT 1");
  if (res.rows[0]) return `"${res.rows[0].table_name}"`;
  throw new Error('Could not locate schemes table in database');
}

function mapRowToDocument(row) {
  return {
    id: row.id,
    title: row.name || row.title || row.url || null,
    summary: row.description || row.summary || null,
    content: row.description || row.content || row.body || null,
    source: row.sourceUrl || row.sourceurl || row.source || null,
    attachments: row.attachments || null,
    meta: row.meta || {
      state: row.state,
      category: row.category,
      department: row.department,
      eligibility: row.eligibility,
      benefits: row.benefits,
      documentsRequired: row.documentsRequired || row.documentsrequired,
      applicationLink: row.applicationLink || row.applicationlink,
      sourceUrl: row.sourceUrl || row.sourceurl
    },
    createdAt: row.createdAt || row.createdat || row.created_at || null,
    updatedAt: row.updatedAt || row.updatedat || row.updated_at || null
  };
}

module.exports = {
  async listPendingForEmbedding(limit = 100) {
    const client = await pool.connect();
    try {
      const table = await resolveTable(client);
      const q = `SELECT * FROM ${table} ORDER BY "createdAt" ASC LIMIT $1`;
      const res = await client.query(q, [limit]);
      return res.rows.map(mapRowToDocument);
    } finally {
      client.release();
    }
  },

  async getById(id) {
    const client = await pool.connect();
    try {
      const table = await resolveTable(client);
      const res = await client.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
      if (!res.rows[0]) return null;
      return mapRowToDocument(res.rows[0]);
    } finally {
      client.release();
    }
  },

  async streamDocuments(callback, batchSize = 100) {
    const client = await pool.connect();
    try {
      const table = await resolveTable(client);
      let offset = 0;
      while (true) {
        const res = await client.query(
          `SELECT * FROM ${table} ORDER BY "createdAt" ASC LIMIT $1 OFFSET $2`,
          [batchSize, offset]
        );
        if (!res.rows.length) break;
        for (const r of res.rows) {
          await callback(mapRowToDocument(r));
        }
        offset += res.rows.length;
      }
    } finally {
      client.release();
    }
  },

  async listDocumentsSince(threshold, limit = 100) {
    const client = await pool.connect();
    try {
      const table = await resolveTable(client);
      const q = `SELECT * FROM ${table} WHERE ("updatedAt" >= $1 OR "createdAt" >= $1) ORDER BY GREATEST("updatedAt", "createdAt") ASC LIMIT $2`;
      const res = await client.query(q, [threshold, limit]);
      return res.rows.map(mapRowToDocument);
    } finally {
      client.release();
    }
  }
};
