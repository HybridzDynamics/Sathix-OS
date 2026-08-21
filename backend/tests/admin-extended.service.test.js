const test = require('node:test');
const assert = require('node:assert/strict');
const logs = require('../src/services/admin-logs.service');
const analytics = require('../src/services/admin-analytics.service');
const sources = require('../src/services/admin-sources.service');
const approvals = require('../src/services/admin-approvals.service');

test('audit logs are paginated server-side', async () => {
  let query;
  const prisma = {
    $transaction: async (ops) => Promise.all(ops),
    auditLog: {
      findMany: async (input) => { query = input; return [{ id: '1', action: 'TEST', entity: 'User', entityId: 'u1', details: null, createdAt: new Date() }]; },
      count: async () => 1
    }
  };
  const result = await logs.listLogs(prisma, { page: '1', type: 'audit' });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].type, 'audit');
  assert.equal(query.take, 25);
});

test('analytics aggregates scheme and user metrics from database', async () => {
  const prisma = {
    scheme: {
      groupBy: async ({ by }) => (by[0] === 'state'
        ? [{ state: 'Gujarat', _count: { _all: 5 } }]
        : [{ category: 'Agriculture', _count: { _all: 3 } }])
    },
    user: { groupBy: async () => [{ language: 'HINDI', _count: { _all: 2 } }, { language: 'ENGLISH', _count: { _all: 1 } }] },
    application: { groupBy: async () => [{ status: 'SUBMITTED', _count: { _all: 4 } }] },
    chatMessage: { findMany: async () => [{ createdAt: new Date() }] },
    scraperJob: { groupBy: async () => [{ status: 'COMPLETED', _count: { _all: 2 } }] }
  };
  const result = await analytics.getAnalytics(prisma);
  assert.equal(result.schemesByState[0].state, 'Gujarat');
  assert.equal(result.languageDistribution.length, 2);
  assert.equal(result.queryVolume.length, 7);
});

test('source creation rejects invalid URLs', async () => {
  await assert.rejects(() => sources.createSource({}, { url: 'bad-url' }), { status: 422 });
});

test('approval rejects schemes that are not pending review', async () => {
  const prisma = {
    scheme: {
      findUnique: async () => ({ id: 's1', status: 'ACTIVE', origin: 'SCRAPED' })
    }
  };
  await assert.rejects(() => approvals.approve(prisma, { schemeId: 's1' }), { status: 409 });
});
