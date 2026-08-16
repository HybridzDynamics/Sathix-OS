const test = require('node:test');
const assert = require('node:assert/strict');
const { enabled, validate } = require('../utils/lowBandwidth');

test('recognizes explicit low-bandwidth mode', () => {
  assert.equal(enabled('true'), true);
  assert.equal(enabled('false'), false);
});

test('rejects known bitrate above the low-bandwidth cap', () => {
  assert.throws(() => validate({ metadata: { sizeBytes: 100, durationMs: 1000, bitRate: 256000 } }), { code: 'LOW_BANDWIDTH_BITRATE_TOO_HIGH' });
});
