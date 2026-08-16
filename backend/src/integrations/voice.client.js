const { createServiceClient } = require('./http-client');
function client() { return createServiceClient({ baseUrl: process.env.VOICE_SERVICE_URL || 'http://localhost:4002', token: process.env.INTERNAL_SERVICE_TOKEN, timeoutMs: Number(process.env.VOICE_TIMEOUT_MS || 30000), service: 'Voice service' }); }
async function synthesize(data, requestId) { return client().request({ method: 'post', url: '/api/v1/text-to-speech', data, responseType: 'arraybuffer', headers: requestId ? { 'x-request-id': requestId } : {} }); }
async function languages() { return (await client().request({ method: 'get', url: '/api/v1/languages' })).data; }
async function health() { return (await client().request({ method: 'get', url: '/health' })).data; }
async function transcribe(stream, headers, requestId) { return (await client().request({ method: 'post', url: '/api/v1/speech-to-text', data: stream, headers: { ...headers, ...(requestId ? { 'x-request-id': requestId } : {}) }, maxBodyLength: Number(process.env.MAX_AUDIO_BYTES || 10485760) })).data; }
module.exports = { synthesize, languages, health, transcribe };
