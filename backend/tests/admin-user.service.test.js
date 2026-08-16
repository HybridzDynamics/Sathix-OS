const test = require('node:test');
const assert = require('node:assert/strict');
const users = require('../src/services/admin-user.service');

test('user listing clamps unsafe pagination and filters role server-side', async () => {
  let query;
  const prisma = { $transaction: async (operations) => Promise.all(operations), user: { findMany: async (input) => { query = input; return []; }, count: async () => 0 } };
  const result = await users.listUsers(prisma, { page: '0', limit: '1000', role: 'ADMIN', isActive: 'true' });
  assert.equal(result.limit, 100);
  assert.equal(query.where.role, 'ADMIN');
  assert.equal(query.where.isActive, true);
});

test('an administrator cannot deactivate or change their own role', async () => {
  const prisma = { user: {}, auditLog: {} };
  await assert.rejects(() => users.updateStatus(prisma, { actorId: 'a', actorRole: 'ADMIN', userId: 'a', isActive: false }), { status: 409 });
  await assert.rejects(() => users.updateRole(prisma, { actorId: 'a', actorRole: 'ADMIN', userId: 'a', role: 'CITIZEN' }), { status: 409 });
});

test('only Super Admins can grant or manage administrator roles', async () => {
  const prisma = { user: { findUnique: async () => ({ role: 'CITIZEN' }) }, auditLog: {} };
  await assert.rejects(() => users.updateRole(prisma, { actorId: 'a', actorRole: 'ADMIN', userId: 'u', role: 'ADMIN' }), { status: 403 });
});
