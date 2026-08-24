const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { installAuthMocks, restoreAuthMocks } = require('./helpers/auth-mocks');

process.env.JWT_SECRET = 'test-admin-secret';
const app = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  installAuthMocks();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  restoreAuthMocks();
});

test('admin session requires authentication', async () => {
  const response = await fetch(`${baseUrl}/api/admin/session`);
  assert.equal(response.status, 401);
});

test('admin overview requires authentication before it can access operational data', async () => {
  const response = await fetch(`${baseUrl}/api/admin/overview`);
  assert.equal(response.status, 401);
});

test('authenticated non-admin is forbidden', async () => {
  const token = jwt.sign({ id: 'citizen-1', role: 'CITIZEN' }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/admin/session`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(response.status, 403);
});

test('authenticated admin is allowed', async () => {
  const token = jwt.sign({ id: 'admin-1', role: 'ADMIN' }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/admin/session`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { user: { id: 'admin-1', role: 'ADMIN' } });
});

test('Super Admin inherits administrator access', async () => {
  const token = jwt.sign({ id: 'super-admin-1', role: 'SUPER_ADMIN' }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/admin/session`, { headers: { Authorization: `Bearer ${token}` } });
  assert.equal(response.status, 200);
});
