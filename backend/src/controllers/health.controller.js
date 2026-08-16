const axios = require('axios');
const language = require('../integrations/language.client');
const voice = require('../integrations/voice.client');

async function getHealth(req, res) {
  const detailed = req.path === '/ready' || process.env.HEALTH_INCLUDE_DEPENDENCIES === 'true';
  const health = { status: 'ok', services: { backend: 'ok', database: 'unknown', rag: 'unknown' } };
  try {
    const prisma = req.app.locals.prisma;
    if (!prisma) throw new Error('Prisma is not initialized');
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'ok';
  } catch { health.services.database = 'error'; health.status = 'degraded'; }
  try {
    await axios.get(`${process.env.RAG_ENGINE_URL || 'http://localhost:3001'}/rag/health`, { timeout: 3000 });
    health.services.rag = 'ok';
  } catch { health.services.rag = 'error'; health.status = 'degraded'; }
  if (detailed) {
    health.dependencies = { scraper: 'unknown', language: 'unknown', voice: 'unknown' };
    const [languageStatus, voiceStatus] = await Promise.all([
      language.health().then(() => 'ok').catch(() => 'error'),
      voice.health().then(() => 'ok').catch(() => 'error')
    ]);
    health.dependencies.language = languageStatus;
    health.dependencies.voice = voiceStatus;
    try { await require('../services/scraper-queue.service').counts(); health.dependencies.scraper = 'ok'; } catch { health.dependencies.scraper = 'error'; }
    if (Object.values(health.dependencies).includes('error')) health.status = 'degraded';
  }
  res.status(health.status === 'ok' ? 200 : 207).json(health);
}

module.exports = { getHealth };
