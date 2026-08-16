const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const overviewService = require('../src/services/admin-overview.service');

test('overview returns actual database counts and backend-owned service probes', async () => {
  const originalGet = axios.get;
  axios.get = async () => ({ status: 200 });
  try {
    const prisma = {
      $queryRaw: async () => [{ '?column?': 1 }],
      user: { count: async () => 4 },
      scheme: { count: async () => 9 },
      application: { count: async () => 2 },
      chatMessage: { count: async ({ where }) => where.role === 'user' ? 12 : 0 },
      scraperLog: { count: async () => 3 }
    };
    const overview = await overviewService.getOverview(prisma);
    assert.deepEqual(overview.metrics.totalUsers, { value: 4, tracked: true });
    assert.deepEqual(overview.metrics.aiQueries, { value: 12, tracked: true });
    assert.equal(overview.metrics.voiceQueries.tracked, false);
    assert.equal(overview.services.rag, 'healthy');
  } finally { axios.get = originalGet; }
});
