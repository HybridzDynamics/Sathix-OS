const { URL } = require('url');

/**
 * Simple validators to ensure scraped records meet minimal requirements.
 * @module processor/validator
 */

/**
 * Check if a value is a non-empty string.
 * @param {any} v
 * @returns {boolean}
 */
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * Validate URL format.
 * @param {string} u
 * @returns {boolean}
 */
function isValidUrl(u) {
  try {
    // eslint-disable-next-line no-new
    new URL(u);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate a record and return {valid, errors}.
 * @param {object} record
 * @returns {{valid:boolean, errors:string[]}}
 */
function validate(record = {}) {
  const errors = [];
  if (!isNonEmptyString(record.title) && !isNonEmptyString(record.summary)) {
    errors.push('missing_title_or_summary');
  }
  const contentLength = (record.content || '').length + (record.pdfText || '').length;
  if (contentLength < 50) errors.push('content_too_short');
  if (!isValidUrl(record.url)) errors.push('invalid_url');
  // Additional domain-specific checks could go here
  return { valid: errors.length === 0, errors };
}

module.exports = { validate, isValidUrl };
