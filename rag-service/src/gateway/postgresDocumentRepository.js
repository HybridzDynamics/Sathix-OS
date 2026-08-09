const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({ connectionString: config.DATABASE_URL });

// Helper to try multiple table name variants (Prisma model may map differently)
const TABLE_CANDIDATES = ['schemes', 'scheme', 'Scheme', 'Scheme'.toLowerCase()];

async function resolveTable(client) {
  // Try a list of common candidates and return the first that exists
  for (const t of TABLE_CANDIDATES) {
    const q = `SELECT to_regclass($1) as exists`;
    const res = await client.query(q, [t]);
    if (res.rows[0] && res.rows[0].exists) return t;
  }
  // fallback: try information_schema search for 'scheme' in table_name
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name ILIKE '%scheme%' LIMIT 1");
  if (res.rows[0]) return res.rows[0].table_name;
  throw new Error('Could not locate schemes table in database');
}

function mapRowToDocument(row) {
  return {
    id: row.id,
    title: row.title || row.url || null,
    summary: row.summary || null,
    content: row.content || row.body || null,
    source: row.source || null,
    attachments: row.attachments || null,
    meta: row.meta || null,
    createdAt: row.createdat || row.created_at || row.createdAt || null,
    updatedAt: row.updatedat || row.updated_at || row.updatedAt || null
  };
}

module.exports = {
  async listPendingForEmbedding(limit = 100) {
    const client = await pool.connect();
    try {
      const table = await resolveTable(client);
      const q = `SELECT id, url, title, summary, content, source, attachments, meta, createdat, updatedat FROM ${table} ORDER BY createdat ASC LIMIT $1`;
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
      const res = await client.query(`SELECT id, url, title, summary, content, source, attachments, meta, createdat, updatedat FROM ${table} WHERE id = $1`, [id]);
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
          `SELECT id, url, title, summary, content, source, attachments, meta, createdat, updatedat FROM ${table} ORDER BY createdat ASC LIMIT $1 OFFSET $2`,
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
      const q = `SELECT id, url, title, summary, content, source, attachments, meta, createdat, updatedat FROM ${table} WHERE (updatedat >= $1 OR createdat >= $1) ORDER BY GREATEST(updatedat, createdat) ASC LIMIT $2`;
      const res = await client.query(q, [threshold, limit]);
      return res.rows.map(mapRowToDocument);
    } finally {
      client.release();
    }
  }
};
