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
    await getHealth({ app: { locals: { prisma: { $queryRaw: async () => [{ ok: 1 }] } } }, path: '/health' }, res);
    assert.equal(status, 200);
    assert.deepEqual(body.services, { backend: 'ok', database: 'ok', rag: 'ok' });
  } finally { axios.get = originalGet; }
});

test('ready endpoint reports downstream dependencies including WhatsApp', async () => {
  const originalGet = axios.get;
  process.env.WHATSAPP_SERVICE_URL = 'http://whatsapp.test';
  axios.get = async (url) => {
    if (String(url).includes('whatsapp.test')) return { status: 200 };
    if (String(url).includes('/rag/health')) return { status: 200 };
    throw new Error(`unexpected url ${url}`);
  };
  const language = require('../src/integrations/language.client');
  const voice = require('../src/integrations/voice.client');
  const originalLanguageHealth = language.health;
  const originalVoiceHealth = voice.health;
  language.health = async () => ({ status: 'ok' });
  voice.health = async () => ({ status: 'ok' });
  const scraperQueue = require('../src/services/scraper-queue.service');
  const originalCounts = scraperQueue.counts;
  scraperQueue.counts = async () => ({ waiting: 0 });
  try {
    let body;
    const res = { status: () => res, json: (data) => { body = data; } };
    await getHealth({ app: { locals: { prisma: { $queryRaw: async () => [{ ok: 1 }] } } }, path: '/ready' }, res);
    assert.equal(body.dependencies.language, 'ok');
    assert.equal(body.dependencies.voice, 'ok');
    assert.equal(body.dependencies.whatsapp, 'ok');
    assert.equal(body.dependencies.scraper, 'ok');
  } finally {
    axios.get = originalGet;
    language.health = originalLanguageHealth;
    voice.health = originalVoiceHealth;
    scraperQueue.counts = originalCounts;
    delete process.env.WHATSAPP_SERVICE_URL;
  }
});
