const puppeteer = require('puppeteer');

/**
 * Simple singleton Puppeteer browser launcher.
 * Keeps a single browser instance for the process to reduce resource usage.
 * @module crawler/browser
 */

let browserInstance = null;

/**
 * Launch or return the singleton browser instance.
 * @returns {Promise<import('puppeteer').Browser>} Puppeteer Browser
 */
async function getBrowser() {
  if (browserInstance) return browserInstance;
  const headless = process.env.PUPPETEER_HEADLESS !== 'false';
  browserInstance = await puppeteer.launch({ headless });
  return browserInstance;
}

/**
 * Create a new page with sensible defaults.
 * @returns {Promise<import('puppeteer').Page>} Puppeteer Page
 */
async function newPage() {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(process.env.USER_AGENT || 'SathixScraper/1.0');
  page.setDefaultNavigationTimeout(60000);
  return page;
}

/**
 * Close the browser instance (if any).
 * @returns {Promise<void>}
 */
async function closeBrowser() {
  if (!browserInstance) return;
  try {
    await browserInstance.close();
  } finally {
    browserInstance = null;
  }
}

module.exports = { getBrowser, newPage, closeBrowser };
