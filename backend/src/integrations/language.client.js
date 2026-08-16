const { createServiceClient } = require('./http-client');
function client() { return createServiceClient({ baseUrl: process.env.LANGUAGE_ENGINE_URL || 'http://localhost:4001', token: process.env.INTERNAL_SERVICE_TOKEN, timeoutMs: Number(process.env.LANGUAGE_TIMEOUT_MS || 10000), service: 'Language service' }); }
async function detect(text, requestId) { return (await client().request({ method: 'post', url: '/api/v1/detect', data: { text }, headers: requestId ? { 'x-request-id': requestId } : {} })).data; }
async function translate(data, requestId) { return (await client().request({ method: 'post', url: '/api/v1/translate', data, headers: requestId ? { 'x-request-id': requestId } : {} })).data; }
async function languages() { return (await client().request({ method: 'get', url: '/api/v1/languages' })).data; }
async function health() { return (await client().request({ method: 'get', url: '/health' })).data; }
module.exports = { detect, translate, languages, health };
