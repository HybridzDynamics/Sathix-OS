const test = require('node:test');
const assert = require('node:assert/strict');
const schemes = require('../src/services/admin-scheme.service');

test('scheme listing applies server-side pagination and operational filters', async () => {
  let query;
  const prisma = { $transaction: async (operations) => Promise.all(operations), scheme: { findMany: async (input) => { query = input; return []; }, count: async () => 0 } };
  const result = await schemes.listSchemes(prisma, { page: '2', limit: '25', status: 'ACTIVE', state: 'Delhi', indexed: 'false' });
  assert.equal(result.page, 2);
  assert.equal(query.skip, 25);
  assert.equal(query.where.status, 'ACTIVE');
  assert.equal(query.where.state, 'Delhi');
  assert.equal(query.where.indexedAt, null);
});

test('invalid scheme state transition is rejected', async () => {
  await assert.rejects(() => schemes.changeStatus({}, { status: 'UNKNOWN' }), { status: 422 });
});
