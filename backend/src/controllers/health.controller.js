const axios = require('axios');

async function getHealth(req, res) {
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
  res.status(health.status === 'ok' ? 200 : 207).json(health);
}

module.exports = { getHealth };
