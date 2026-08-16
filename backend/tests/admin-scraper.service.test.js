const test = require('node:test');
const assert = require('node:assert/strict');
const scraper = require('../src/services/admin-scraper.service');

test('scraper listing uses persisted job status and server-side pagination', async () => {
  let query;
  const prisma = { $transaction: async (operations) => Promise.all(operations), scraperJob: { findMany: async (input) => { query = input; return []; }, count: async () => 0 } };
  const result = await scraper.listJobs(prisma, { page: '2', limit: '25', status: 'FAILED' });
  assert.equal(result.page, 2);
  assert.equal(query.skip, 25);
  assert.deepEqual(query.where, { status: 'FAILED' });
});

test('scraper submission rejects malformed source URLs before queueing', async () => {
  await assert.rejects(() => scraper.createJob({}, { sourceUrl: 'not-a-url' }), { status: 422 });
});
