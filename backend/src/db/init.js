const fs = require('fs');
const path = require('path');
const { query } = require('./pool');

async function initSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(sql);
}

module.exports = { initSchema };
