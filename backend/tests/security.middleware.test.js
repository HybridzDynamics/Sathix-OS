const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { createRateLimiter } = require('../src/middleware/rate-limit');
const { serviceAuth } = require('../../rag-service/src/middleware/serviceAuth');

process.env.JWT_SECRET = 'test-admin-secret';
const app = require('../src/app');

let server;
let baseUrl;

function response() {
  const result = { headers: {}, statusCode: null, body: null };
  result.setHeader = (name, value) => { result.headers[name] = value; };
  result.status = (code) => { result.statusCode = code; return result; };
  result.json = (body) => { result.body = body; return result; };
  return result;
}

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => new Promise((resolve) => server.close(resolve)));

test('every API response receives a server-controlled request ID', async () => {
  const result = await fetch(`${baseUrl}/api/admin/session`, { headers: { 'x-request-id': '<script>alert(1)</script>' } });
  assert.equal(result.status, 401);
  assert.match(result.headers.get('x-request-id'), /^[A-Za-z0-9_-]{8,128}$/);
  assert.notEqual(result.headers.get('x-request-id'), '<script>alert(1)</script>');
});

test('disallowed browser origins are rejected', async () => {
  const result = await fetch(`${baseUrl}/api/admin/session`, { headers: { Origin: 'https://attacker.invalid' } });
  assert.equal(result.status, 403);
  assert.equal((await result.json()).message, 'Origin is not allowed by CORS policy.');
});

test('the documented user-panel deployment origin is allowed by default', async () => {
  const result = await fetch(`${baseUrl}/api/admin/session`, { headers: { Origin: 'https://sathix-os-user.vercel.app' } });
  assert.equal(result.status, 401);
  assert.equal(result.headers.get('access-control-allow-origin'), 'https://sathix-os-user.vercel.app');
});

test('database role lookup overrides a stale admin token', async () => {
  app.locals.prisma = { user: { findUnique: async () => ({ id: 'user-1', role: 'CITIZEN', isActive: true }) } };
  try {
    const token = jwt.sign({ id: 'user-1', role: 'ADMIN' }, process.env.JWT_SECRET);
    const result = await fetch(`${baseUrl}/api/admin/session`, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(result.status, 403);
  } finally {
    delete app.locals.prisma;
  }
});

test('rate limiter returns 429 after its configured threshold', () => {
  const limiter = createRateLimiter({ windowMs: 60000, max: 2, key: () => 'test-client' });
  const next = () => undefined;
  limiter({}, response(), next);
  limiter({}, response(), next);
  const blocked = response();
  limiter({}, blocked, next);
  assert.equal(blocked.statusCode, 429);
  assert.equal(blocked.body.message, 'Too many requests. Please try again later.');
});

test('RAG mutations require the configured internal service token', () => {
  const original = process.env.INTERNAL_SERVICE_TOKEN;
  process.env.INTERNAL_SERVICE_TOKEN = 'test-internal-token';
  try {
    const denied = response();
    serviceAuth({ get: () => undefined }, denied, () => assert.fail('next should not be called'));
    assert.equal(denied.statusCode, 401);
    let allowed = false;
    serviceAuth({ get: () => 'test-internal-token' }, response(), () => { allowed = true; });
    assert.equal(allowed, true);
  } finally {
    if (original === undefined) delete process.env.INTERNAL_SERVICE_TOKEN;
    else process.env.INTERNAL_SERVICE_TOKEN = original;
  }
});
