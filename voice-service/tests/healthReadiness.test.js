const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const { getHealth, readiness } = require('../api/controllers/health.controller');

function response() {
  const result = {};
  result.status = (code) => { result.statusCode = code; return result; };
  result.json = (body) => { result.body = body; return result; };
  return result;
}

test('liveness does not claim upstream dependency readiness', () => {
  const res = response();
  getHealth({ id: 'health-test-1' }, res);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.requestId, 'health-test-1');
  assert.equal(res.body.dependencies, undefined);
});

test('readiness is ready only when every required dependency answers', async () => {
  const original = axios.get;
  axios.get = async () => ({ status: 200 });
  try {
    const res = response();
    await readiness({ id: 'ready-test-1' }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'ready');
    assert.deepEqual(res.body.dependencies, { languageEngine: 'available', backend: 'available', sttInference: 'available', ttsInference: 'available' });
  } finally { axios.get = original; }
});

test('readiness reports degraded without exposing failed dependency details', async () => {
  const original = axios.get;
  let calls = 0;
  axios.get = async () => { calls += 1; if (calls === 3) throw new Error('connection refused: internal address'); return { status: 200 }; };
  try {
    const res = response();
    await readiness({ id: 'ready-test-2' }, res);
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.status, 'degraded');
    assert.equal(res.body.dependencies.sttInference, 'unavailable');
    assert.equal(JSON.stringify(res.body).includes('internal address'), false);
  } finally { axios.get = original; }
});
