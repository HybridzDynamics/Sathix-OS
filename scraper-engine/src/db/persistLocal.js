const fs = require('fs');
const path = require('path');

/**
 * Local JSON persistence adapter used as a temporary storage before Prisma.
 * Stores canonical records in `data/records.json` and performs idempotent upserts.
 * @module db/persistLocal
 */

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Load existing records from disk.
 * @returns {Array<object>}
 */
function loadRecords() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Save records array back to disk.
 * @param {Array<object>} records
 */
function saveRecords(records) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
}

/**
 * Upsert a canonical record by `id`.
 * @param {object} record
 * @returns {Promise<object>} saved record
 */
async function saveRecord(record) {
  const records = loadRecords();
  const idx = records.findIndex(r => r.id === record.id);
  const now = new Date().toISOString();
  if (idx >= 0) {
    const updated = Object.assign({}, records[idx], record, { updatedAt: now });
    records[idx] = updated;
    saveRecords(records);
    return updated;
  }

  const toSave = Object.assign({}, record, { createdAt: now, updatedAt: now });
  records.push(toSave);
  saveRecords(records);
  return toSave;
}

module.exports = { saveRecord, loadRecords };
