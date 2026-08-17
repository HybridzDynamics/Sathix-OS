const test = require('node:test');
const assert = require('node:assert/strict');
const rag = require('../src/integrations/rag.client');
const { voiceQuery } = require('../src/controllers/internal.controller');
const { authenticateService } = require('../src/middleware/service-auth');

function response() { const result = {}; result.status = (code) => { result.statusCode = code; return result; }; result.json = (body) => { result.body = body; return result; }; return result; }

test('internal voice query sends validated data through Backend RAG integration', async () => {
  const original = rag.query;
  let input;
  rag.query = async (value) => { input = value; return { answer: 'PM-KISAN information', sources: [{ title: 'PM-KISAN' }] }; };
  try {
    const res = response();
    await voiceQuery({ body: { query: 'farmer schemes', language: 'en', filters: { state: 'UP' }, topK: 99 }, id: 'voice-test-1' }, res, assert.fail);
    assert.equal(input.topK, 20);
    assert.equal(input.requestId, 'voice-test-1');
    assert.deepEqual(res.body.sources, [{ title: 'PM-KISAN' }]);
  } finally { rag.query = original; }
});

test('internal voice query rejects malformed filters before calling RAG', async () => {
  const next = (error) => { assert.equal(error.code, 'INVALID_FILTERS'); };
  await voiceQuery({ body: { query: 'farmer schemes', filters: [] } }, response(), next);
});

test('internal voice route requires the shared service token', () => {
  const previous = process.env.INTERNAL_SERVICE_TOKEN;
  process.env.INTERNAL_SERVICE_TOKEN = 'voice-test-token';
  try {
    const denied = response(); authenticateService({ get: () => undefined, id: 'voice-test-2' }, denied, assert.fail);
    assert.equal(denied.statusCode, 401);
    let allowed = false; authenticateService({ get: () => 'voice-test-token' }, response(), () => { allowed = true; });
    assert.equal(allowed, true);
  } finally { if (previous === undefined) delete process.env.INTERNAL_SERVICE_TOKEN; else process.env.INTERNAL_SERVICE_TOKEN = previous; }
});
