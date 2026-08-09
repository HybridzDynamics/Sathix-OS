const { newPage } = require('./browser');
const { download } = require('./downloader');

/**
 * Crawl a single URL. Uses Puppeteer for rendering pages and Axios for direct downloads.
 * Returns HTML and discovered links, or raw buffer for PDFs/static files.
 * @module crawler/crawler
 */

/**
 * Crawl the provided URL.
 * @param {string} url
 * @param {{render?: boolean}} [options]
 * @returns {Promise<object>} Result object containing html|buffer, links and metadata
 */
async function crawlUrl(url, options = { render: true }) {
  if (!options.render) {
    // direct download (no JS rendering)
    const dl = await download(url);
    return { url, status: dl.status, buffer: dl.buffer, contentType: dl.contentType, links: [] };
  }

  const page = await newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle2' });
    const status = resp ? resp.status() : null;
    const headers = resp ? resp.headers() : {};
    const contentType = headers['content-type'] || '';

    // If the page is a PDF link, fallback to downloader
    if (contentType.includes('application/pdf') || url.toLowerCase().endsWith('.pdf')) {
      await page.close();
      const dl = await download(url);
      return { url, status: dl.status, buffer: dl.buffer, contentType: dl.contentType, links: [] };
    }

    const html = await page.content();
    const links = await page.$$eval('a', anchors => anchors.map(a => a.href).filter(Boolean));
    await page.close();
    return { url, status, html, links, contentType };
  } catch (err) {
    try { await page.close(); } catch (e) {}
    throw err;
  }
}

module.exports = { crawlUrl };
