const { crawlUrl } = require('./crawler/crawler');

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.log('Usage: node src/index.js <url>');
    process.exit(1);
  }

  try {
    const result = await crawlUrl(url, { render: true });
    console.log('Crawl result summary:');
    console.log({ url: result.url, status: result.status, contentType: result.contentType, linksCount: (result.links || []).length });
  } catch (err) {
    console.error('Crawl failed:', err.message);
    process.exit(2);
  }
}

if (require.main === module) main();
