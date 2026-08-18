const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { createApp } = require('../src/app');
const { MetaCloudProvider } = require('../src/providers/meta-cloud.provider');

const config = { provider: 'meta-cloud', appSecret: 'test-secret', verifyToken: 'verify-me', rateLimitWindowMs: 60000, rateLimitMax: 10, backendUrl: 'http://backend', internalToken: 'internal', phoneNumberId: '123', graphApiVersion: 'v23.0', accessToken: 'token' };
async function withServer(app, action) { const server = app.listen(0); await new Promise((resolve) => server.once('listening', resolve)); try { return await action(`http://127.0.0.1:${server.address().port}`); } finally { await new Promise((resolve) => server.close(resolve)); } }

test('webhook verification returns Meta challenge only for the configured token', async () => {
  const app = createApp({ config, provider: new MetaCloudProvider(config), processor: { process: async () => {} } });
  await withServer(app, async (url) => {
    const allowed = await fetch(`${url}/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=challenge`);
    assert.equal(await allowed.text(), 'challenge');
    assert.equal((await fetch(`${url}/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=nope`)).status, 403);
  });
});

test('signed webhook is acknowledged and passed to the processor', async () => {
  const processed = []; const provider = new MetaCloudProvider(config);
  const app = createApp({ config, provider, processor: { process: async (event, id) => processed.push({ event, id }) } });
  const body = JSON.stringify({ entry: [{ changes: [{ value: { messages: [{ id: 'wamid.3', from: '919999999999', type: 'text', timestamp: '1', text: { body: 'hello' } }] } }] }] });
  const signature = `sha256=${crypto.createHmac('sha256', config.appSecret).update(body).digest('hex')}`;
  await withServer(app, async (url) => {
    const response = await fetch(`${url}/webhooks/whatsapp`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-hub-signature-256': signature }, body });
    assert.equal(response.status, 200);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(processed[0].event.messageId, 'wamid.3');
  });
});
