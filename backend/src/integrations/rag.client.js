const axios = require('axios');
const { createServiceClient, serviceError } = require('./http-client');

function client() {
  return createServiceClient({
    baseUrl: process.env.RAG_ENGINE_URL || 'http://localhost:3001',
    token: process.env.INTERNAL_SERVICE_TOKEN,
    timeoutMs: Number(process.env.RAG_TIMEOUT_MS || 15000),
    service: 'RAG service'
  });
}

async function query({ query, language = 'en', filters = {}, topK = 5, requestId }) {
  const response = await client().request({ method: 'post', url: '/rag/query', data: { query, language, filters, topK }, headers: requestId ? { 'x-request-id': requestId } : {} });
  return response.data?.data || response.data || {};
}
async function health() {
  try { return (await axios.get(`${process.env.RAG_ENGINE_URL || 'http://localhost:3001'}/rag/health`, { timeout: 3000 })).data; }
  catch (cause) { throw serviceError('RAG service', cause); }
}
async function reindex(requestId) { return (await client().request({ method: 'post', url: '/rag/reindex', data: {}, headers: requestId ? { 'x-request-id': requestId } : {} })).data; }
module.exports = { query, health, reindex };
