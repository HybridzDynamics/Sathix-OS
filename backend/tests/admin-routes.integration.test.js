const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-admin-secret';
const app = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => new Promise((resolve) => server.close(resolve)));

const protectedAdminRoutes = [
  '/api/admin/logs',
  '/api/admin/analytics',
  '/api/admin/sources',
  '/api/admin/approvals',
  '/api/admin/languages',
];

for (const path of protectedAdminRoutes) {
  test(`${path} requires authentication`, async () => {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 401);
  });
}

test('admin logs rejects non-admin authenticated users', async () => {
  const token = jwt.sign({ id: 'citizen-1', role: 'CITIZEN' }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/admin/logs`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(response.status, 403);
});
