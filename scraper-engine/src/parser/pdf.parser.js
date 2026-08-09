const pdf = require('pdf-parse');

/**
 * Parse PDF buffer and extract plain text and basic metadata.
 * @module parser/pdf.parser
 */

/**
 * Parse a PDF buffer into text and metadata.
 * @param {Buffer} buffer PDF file buffer
 * @param {string} [url] Optional source URL for provenance
 * @returns {Promise<{text:string, info:object, metadata:object, numpages:number, url?:string}>}
 */
async function parsePdf(buffer, url) {
  const data = await pdf(buffer);
  const text = data.text || '';
  const info = data.info || {};
  const metadata = data.metadata || {};
  const numpages = data.numpages || 0;
  return { text, info, metadata, numpages, url };
}

module.exports = { parsePdf };
