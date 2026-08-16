const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const { getHealth } = require('../src/controllers/health.controller');

test('API health response reports backend, database, and RAG status without secrets', async () => {
  const originalGet = axios.get;
  axios.get = async () => ({ status: 200 });
  try {
    let status; let body;
    const res = { status: (code) => { status = code; return res; }, json: (data) => { body = data; } };
    await getHealth({ app: { locals: { prisma: { $queryRaw: async () => [{ ok: 1 }] } } } }, res);
    assert.equal(status, 200);
    assert.deepEqual(body.services, { backend: 'ok', database: 'ok', rag: 'ok' });
  } finally { axios.get = originalGet; }
});
