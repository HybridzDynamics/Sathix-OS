const test = require('node:test');
const assert = require('node:assert/strict');
const { enabled, validate } = require('../utils/lowBandwidth');
const requestId = require('../middleware/requestId');

test('recognizes explicit low-bandwidth mode', () => {
  assert.equal(enabled('true'), true);
  assert.equal(enabled('false'), false);
});

test('rejects known bitrate above the low-bandwidth cap', () => {
  assert.throws(() => validate({ metadata: { sizeBytes: 100, durationMs: 1000, bitRate: 256000 } }), { code: 'LOW_BANDWIDTH_BITRATE_TOO_HIGH' });
});

test('allows compressed audio with unknown bitrate when it satisfies byte limits', () => {
  assert.doesNotThrow(() => validate({ metadata: { sizeBytes: 100, durationMs: null, bitRate: null } }));
});

test('replaces unsafe client request IDs before returning an operation ID', () => {
  const res = { setHeader: () => undefined };
  const req = { headers: { 'x-request-id': '<script>alert(1)</script>' } };
  requestId(req, res, () => undefined);
  assert.match(req.id, /^voice-[A-Za-z0-9-]+$/);
});
