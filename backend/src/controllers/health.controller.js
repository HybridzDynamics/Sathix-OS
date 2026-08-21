const db = require('../db');

async function getHealth(req, res) {
  const detailed = req.path === '/ready' || process.env.HEALTH_INCLUDE_DEPENDENCIES === 'true';
  const health = { status: 'ok', services: { backend: 'ok', database: 'unknown', rag: 'unknown' } };
  try {
    await db.ping();
    health.services.database = 'ok';
  } catch { health.services.database = 'error'; health.status = 'degraded'; }
  try {
    const axios = require('axios');
    await axios.get(`${process.env.RAG_ENGINE_URL || 'http://localhost:3001'}/rag/health`, { timeout: 3000 });
    health.services.rag = 'ok';
  } catch { health.services.rag = 'error'; health.status = 'degraded'; }
  if (detailed) {
    const axios = require('axios');
    const language = require('../integrations/language.client');
    const voice = require('../integrations/voice.client');
    health.dependencies = { scraper: 'unknown', language: 'unknown', voice: 'unknown', whatsapp: 'unknown' };
    const whatsappUrl = process.env.WHATSAPP_SERVICE_URL;
    const [languageStatus, voiceStatus, whatsappStatus] = await Promise.all([
      language.health().then(() => 'ok').catch(() => 'error'),
      voice.health().then(() => 'ok').catch(() => 'error'),
      whatsappUrl
        ? axios.get(`${whatsappUrl}/health`, { timeout: 3000 }).then(() => 'ok').catch(() => 'error')
        : Promise.resolve('not_configured')
    ]);
    health.dependencies.language = languageStatus;
    health.dependencies.voice = voiceStatus;
    health.dependencies.whatsapp = whatsappStatus;
    try { await require('../services/scraper-queue.service').counts(); health.dependencies.scraper = 'ok'; } catch { health.dependencies.scraper = 'error'; }
    if (Object.values(health.dependencies).includes('error')) health.status = 'degraded';
  }
  res.status(health.status === 'ok' ? 200 : 207).json(health);
}

module.exports = { getHealth };
