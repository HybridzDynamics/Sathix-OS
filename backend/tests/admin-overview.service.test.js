const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const overviewService = require('../src/services/admin-overview.service');

test('overview returns actual database counts and backend-owned service probes', async () => {
  const originalGet = axios.get;
  axios.get = async () => ({ status: 200, data: { status: 'ok', qdrant: 'ok' } });
  try {
    const prisma = {
      $queryRaw: async () => [{ '?column?': 1 }],
      user: { count: async (input) => input?.where?.isActive ? 3 : 4 },
      scheme: { count: async (input) => input?.where?.status === 'ACTIVE' ? 8 : input?.where?.indexedAt ? 5 : 9 },
      application: { count: async () => 2 },
      chatMessage: { count: async ({ where }) => where.role === 'user' ? 12 : 0 },
      scraperJob: { count: async (input) => input?.where?.status === 'COMPLETED' ? 2 : input?.where?.status === 'FAILED' ? 1 : 3 }
    };
    const overview = await overviewService.getOverview(prisma);
    assert.deepEqual(overview.metrics.totalUsers, { value: 4, tracked: true });
    assert.deepEqual(overview.metrics.activeAccounts, { value: 3, tracked: true });
    assert.deepEqual(overview.metrics.activeSchemes, { value: 8, tracked: true });
    assert.deepEqual(overview.metrics.indexedSchemes, { value: 5, tracked: true });
    assert.deepEqual(overview.metrics.successfulScraperRuns, { value: 2, tracked: true });
    assert.deepEqual(overview.metrics.aiQueries, { value: 12, tracked: true });
    assert.equal(overview.metrics.voiceQueries.tracked, false);
    assert.equal(overview.services.rag, 'healthy');
    assert.equal(overview.services.qdrant, 'healthy');
  } finally { axios.get = originalGet; }
});
