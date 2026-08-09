const { parseHtml } = require('./html.parser');
const { parsePdf } = require('./pdf.parser');

/**
 * High-level extractor that accepts raw crawl results and returns canonical payloads
 * for downstream processing. Keeps the parsing layer minimal and source-driven.
 * @module parser/extractor
 */

/**
 * Extract candidate records from a crawl result.
 * @param {{url:string,html?:string,buffer?:Buffer,contentType?:string,links?:string[]}} crawlResult
 * @param {{selectors?:object}} [sourceConfig]
 * @returns {Promise<Array<object>>} array of candidate records
 */
async function extract(crawlResult, sourceConfig = {}) {
  const { url, html, buffer, contentType } = crawlResult;

  if (html) {
    const record = parseHtml(html, url, { selectors: sourceConfig.selectors });
    return [Object.assign({ source: sourceConfig.name || 'unknown' }, record)];
  }

  // For non-HTML (e.g., PDF buffer), return placeholder — PDF parser handles it
  if (buffer && contentType && contentType.includes('pdf')) {
    const parsed = await parsePdf(buffer, url);
    return [{ url, contentType, source: sourceConfig.name || 'unknown', pdf: true, pdfText: parsed.text, pdfMeta: { info: parsed.info, metadata: parsed.metadata, numpages: parsed.numpages } }];
  }

  return [];
}

module.exports = { extract };
