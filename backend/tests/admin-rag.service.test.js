const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const rag = require('../src/services/admin-rag.service');

test('RAG status uses Backend as the only service-to-service caller', async () => {
  const originalGet = axios.get; axios.get = async () => ({ data: { status: 'ok', qdrant: 'ok' } });
  try {
    const status = await rag.getStatus({ scheme: { count: async () => 6 } });
    assert.equal(status.service.qdrant, 'ok');
    assert.equal(status.totalSchemes, 6);
    assert.equal(status.indexedChunks.tracked, false);
  } finally { axios.get = originalGet; }
});
