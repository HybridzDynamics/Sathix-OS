const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Download a URL using Axios. Returns buffer and metadata, or writes to file.
 * @module crawler/downloader
 */

/**
 * Download a remote resource.
 * @param {string} url The resource URL
 * @param {{destPath?: string, timeout?: number}} [options]
 * @returns {Promise<{buffer?: Buffer, destPath?: string, status: number, contentType?: string}>}
 */
async function download(url, options = {}) {
  const timeout = options.timeout || 30000;
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout,
    headers: { 'User-Agent': process.env.USER_AGENT || 'SathixScraper/1.0' }
  });

  const contentType = response.headers['content-type'] || '';

  if (options.destPath) {
    const dir = path.dirname(options.destPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(options.destPath, response.data);
    return { destPath: options.destPath, status: response.status, contentType };
  }

  return { buffer: Buffer.from(response.data), status: response.status, contentType };
}

module.exports = { download };
