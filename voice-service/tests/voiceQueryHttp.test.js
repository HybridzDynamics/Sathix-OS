const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../config');
const app = require('../src/app');

test('voice query endpoint requires service authentication before processing uploads', async () => {
  const original = config.internalServiceToken;
  config.internalServiceToken = 'phase8-token';
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/voice/query`;
  try {
    const denied = await fetch(url, { method: 'POST' });
    assert.equal(denied.status, 401);
    assert.equal((await denied.json()).error.code, 'UNAUTHORIZED');

    const authenticated = await fetch(url, { method: 'POST', headers: { 'x-internal-token': 'phase8-token' } });
    assert.equal(authenticated.status, 400);
    assert.equal((await authenticated.json()).error.code, 'AUDIO_REQUIRED');
  } finally {
    config.internalServiceToken = original;
    await new Promise((resolve) => server.close(resolve));
  }
});
