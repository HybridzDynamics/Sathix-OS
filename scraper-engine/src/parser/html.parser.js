const cheerio = require('cheerio');

/**
 * Parse HTML and extract candidate fields for a government scheme.
 * This implementation is intentionally small and configurable per-source.
 * @module parser/html.parser
 */

/**
 * Default extraction selectors. Sources can override these.
 */
const DEFAULT_SELECTORS = {
  title: 'h1',
  summary: 'meta[name=description]',
  content: 'article, .content, #content',
  pdfLinks: 'a[href$=".pdf"]'
};

/**
 * Extract text using a selector and Cheerio instance.
 * @param {CheerioStatic} $ Cheerio root
 * @param {string} selector CSS selector
 * @returns {string|null}
 */
function extractText($, selector) {
  const el = $(selector).first();
  if (!el || el.length === 0) return null;
  if (el.is('meta')) return el.attr('content') || null;
  return el.text().trim() || null;
}

/**
 * Parse HTML string into a lightweight record.
 * @param {string} html
 * @param {string} url
 * @param {{selectors?: object}} [options]
 * @returns {{url:string,title?:string,summary?:string,content?:string,pdfLinks:string[]}}
 */
function parseHtml(html, url, options = {}) {
  const selectors = Object.assign({}, DEFAULT_SELECTORS, options.selectors || {});
  const $ = cheerio.load(html);

  const title = extractText($, selectors.title) || $('title').text().trim() || null;
  const summary = extractText($, selectors.summary) || null;
  const content = (() => {
    const el = $(selectors.content).first();
    return el && el.length ? el.text().trim() : $('body').text().trim();
  })();

  const pdfLinks = $(selectors.pdfLinks).map((i, a) => $(a).attr('href')).get().filter(Boolean);

  // Normalize relative links to absolute if base present
  const absolutePdfLinks = pdfLinks.map(link => new URL(link, url).toString());

  return { url, title, summary, content, pdfLinks: absolutePdfLinks };
}

module.exports = { parseHtml };
