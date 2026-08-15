const crypto = require('crypto');

/**
 * Formatting utilities to produce canonical records for storage.
 * @module processor/formatter
 */

/**
 * Generate a stable short id from url+title.
 * @param {string} url
 * @param {string} title
 * @returns {string}
 */
function generateId(url = '', title = '') {
  const h = crypto.createHash('sha256');
  h.update((url || '') + '|' + (title || ''));
  return h.digest('hex').slice(0, 16);
}

/**
 * Format a cleaned and validated record into the canonical schema.
 * @param {object} record
 * @returns {object}
 */
function format(record = {}) {
  const id = generateId(record.url || '', record.title || '');
  const now = new Date().toISOString();
  const attachments = [];
  if (Array.isArray(record.pdfLinks)) {
    for (const p of record.pdfLinks) attachments.push({ type: 'pdf', url: p });
  }
  if (record.content && record.content.length > 0) {
    attachments.push({ type: 'text', excerpt: record.content.slice(0, 200) });
  }

  return {
    id,
    name: record.title || 'Untitled Scheme',
    description: record.summary || record.content || record.pdfText || 'No description available',
    department: record.meta?.department || null,
    category: record.meta?.category || null,
    state: record.meta?.state || null,
    eligibility: record.meta?.eligibility || null,
    benefits: record.meta?.benefits || null,
    documentsRequired: record.meta?.documentsRequired || null,
    applicationLink: record.meta?.applicationLink || null,
    sourceUrl: record.url || null,
    createdAt: now,
    updatedAt: now
  };
}

module.exports = { generateId, format };
