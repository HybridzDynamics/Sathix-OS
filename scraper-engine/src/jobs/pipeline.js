const { crawlUrl } = require('../crawler/crawler');
const { extract } = require('../parser/extractor');
const { cleanRecord } = require('../processor/cleaner');
const { validate } = require('../processor/validator');
const { format } = require('../processor/formatter');
const persistLocal = require('../db/persistLocal');
let persist = persistLocal;
if (process.env.USE_PRISMA === 'true') {
  try {
    // lazy require Prisma adapter
    // eslint-disable-next-line global-require
    persist = require('../db/persistPrisma');
  } catch (e) {
    // fallback to local if Prisma not available
    persist = persistLocal;
  }
}

/**
 * Process a URL: crawl -> extract -> clean -> validate -> format -> persist
 * @param {string} url
 * @param {object} [sourceConfig]
 * @returns {Promise<Array<object>>} results per candidate
 */
async function processUrl(url, sourceConfig = {}) {
  const crawlResult = await crawlUrl(url, { render: true });
  const candidates = await extract(crawlResult, sourceConfig);
  const results = [];

  for (const c of candidates) {
    try {
      const cleaned = cleanRecord(c);
      const { valid, errors } = validate(cleaned);
      if (!valid) {
        results.push({ status: 'rejected', errors, candidate: cleaned });
        continue;
      }

      const canonical = format(cleaned);
      const saved = await persist.saveRecord(canonical);
      results.push({ status: 'saved', record: saved });
    } catch (err) {
      results.push({ status: 'error', error: err.message, candidate: c });
    }
  }

  return results;
}

module.exports = { processUrl };
