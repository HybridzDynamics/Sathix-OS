const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { MetaCloudProvider } = require('../src/providers/meta-cloud.provider');
const { IdempotencyStore } = require('../src/services/idempotency-store');
const config = { appSecret: 'test-secret', graphApiVersion: 'v23.0', phoneNumberId: '123', accessToken: 'token' };

test('verifies a valid Meta webhook HMAC signature', () => {
  const body = Buffer.from('{"object":"whatsapp_business_account"}');
  const signature = `sha256=${crypto.createHmac('sha256', config.appSecret).update(body).digest('hex')}`;
  assert.equal(new MetaCloudProvider(config).verifyWebhook(body, signature), true);
  assert.equal(new MetaCloudProvider(config).verifyWebhook(body, 'sha256=bad'), false);
});

test('normalizes a Meta text message without provider payload leakage', () => {
  const events = new MetaCloudProvider(config).normalizeWebhook({ entry: [{ changes: [{ value: { contacts: [{ wa_id: '919999999999', profile: { name: 'Asha' } }], messages: [{ id: 'wamid.1', from: '919999999999', type: 'text', timestamp: '1', text: { body: 'hello' } }] } }] }] });
  assert.deepEqual(events[0], { kind: 'message', provider: 'whatsapp', messageId: 'wamid.1', sender: { providerUserId: '919999999999', phone: '919999999999', displayName: 'Asha' }, type: 'text', text: 'hello', timestamp: '1', metadata: { context: undefined, media: undefined } });
});

test('idempotency store accepts a message only once', () => {
  const store = new IdempotencyStore(1000);
  assert.equal(store.claim('wamid.1'), true); assert.equal(store.claim('wamid.1'), false);
});
