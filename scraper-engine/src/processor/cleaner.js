/**
 * Text cleaning utilities for scraped records.
 * @module processor/cleaner
 */

/**
 * Normalize whitespace, collapse multiple spaces/newlines.
 * @param {string} input
 * @returns {string}
 */
function normalizeWhitespace(input) {
  if (!input) return '';
  // Replace non-breaking spaces
  let s = input.replace(/\u00A0/g, ' ');
  // Remove script/style blocks if present
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  // Strip remaining HTML tags
  s = s.replace(/<[^>]+>/g, '');
  // Decode common HTML entities
  s = s.replace(/&nbsp;|&ensp;|&emsp;/g, ' ');
  s = s.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  // Collapse whitespace
  s = s.replace(/[\t\f\v\r]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/\s{2,}/g, ' ');
  return s.trim();
}

/**
 * Remove common boilerplate phrases often found on government pages.
 * This is intentionally conservative to avoid removing useful text.
 * @param {string} input
 * @returns {string}
 */
function removeBoilerplate(input) {
  if (!input) return '';
  const patterns = [
    /Click here to download/gi,
    /For more information, contact/gi,
    /Last updated[:\s]\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4}/gi,
    /©/g
  ];
  let s = input;
  for (const p of patterns) s = s.replace(p, '');
  return s.trim();
}

/**
 * Clean a scraped record in-place and return a new object.
 * @param {object} record
 * @returns {object} cleaned record
 */
function cleanRecord(record = {}) {
  const out = Object.assign({}, record);
  if (out.title) out.title = removeBoilerplate(normalizeWhitespace(out.title));
  if (out.summary) out.summary = removeBoilerplate(normalizeWhitespace(out.summary));
  if (out.content) out.content = removeBoilerplate(normalizeWhitespace(out.content));
  if (out.pdfText) out.pdfText = removeBoilerplate(normalizeWhitespace(out.pdfText));
  return out;
}

module.exports = { normalizeWhitespace, removeBoilerplate, cleanRecord };
