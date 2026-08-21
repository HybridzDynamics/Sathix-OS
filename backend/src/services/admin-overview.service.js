const axios = require('axios');

const tracked = (value) => ({ value, tracked: true });
const untracked = (reason) => ({ value: null, tracked: false, reason });

async function probe(url, path = '/health') {
  if (!url) return 'not_configured';
  try {
    const response = await axios.get(`${url}${path}`, { timeout: 3000 });
    return response.status >= 200 && response.status < 300 ? 'healthy' : 'degraded';
  } catch { return 'unavailable'; }
}

async function probeRag() {
  const url = process.env.RAG_ENGINE_URL || 'http://localhost:3001';
  try {
    const response = await axios.get(`${url}/rag/health`, { timeout: 3000 });
    return {
      rag: response.data?.status === 'ok' ? 'healthy' : 'degraded',
      qdrant: response.data?.qdrant === 'ok' ? 'healthy' : 'degraded'
    };
  } catch { return { rag: 'unavailable', qdrant: 'unavailable' }; }
}

async function getOverview(prisma) {
  const database = await prisma.$queryRaw`SELECT 1`.then(() => 'healthy').catch(() => 'unavailable');
  const counts = database === 'healthy' ? await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.scheme.count(),
    prisma.scheme.count({ where: { status: 'ACTIVE' } }),
    prisma.scheme.count({ where: { indexedAt: { not: null } } }),
    prisma.application.count(),
    prisma.chatMessage.count({ where: { role: 'user' } }),
    prisma.scraperJob.count(),
    prisma.scraperJob.count({ where: { status: 'COMPLETED' } }),
    prisma.scraperJob.count({ where: { status: 'FAILED' } })
  ]) : Array(10).fill(null);
  const [totalUsers, activeAccounts, totalSchemes, activeSchemes, indexedSchemes, totalApplications, aiQueries, scraperRuns, successfulScraperRuns, failedScraperRuns] = counts;
  const databaseMetric = (value) => database === 'healthy' ? tracked(value) : untracked('Database is unavailable.');
  const [ragHealth, language, audio, whatsapp] = await Promise.all([
    probeRag(),
    probe(process.env.LANGUAGE_ENGINE_URL),
    probe(process.env.VOICE_SERVICE_URL),
    probe(process.env.WHATSAPP_SERVICE_URL)
  ]);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      totalUsers: databaseMetric(totalUsers),
      activeAccounts: databaseMetric(activeAccounts),
      totalSchemes: databaseMetric(totalSchemes),
      activeSchemes: databaseMetric(activeSchemes),
      indexedSchemes: databaseMetric(indexedSchemes),
      totalApplications: databaseMetric(totalApplications),
      aiQueries: databaseMetric(aiQueries),
      scraperRuns: databaseMetric(scraperRuns),
      successfulScraperRuns: databaseMetric(successfulScraperRuns),
      failedScraperRuns: databaseMetric(failedScraperRuns),
      activeUsers: untracked('Last-active events are not recorded.'),
      indexedDocuments: untracked('A document-processing model is not available.'),
      indexedChunks: untracked('RAG chunk metrics are not recorded by Backend.'),
      voiceQueries: untracked('Voice request telemetry is not recorded by Backend.'),
      translationRequests: untracked('Translation request telemetry is not recorded by Backend.'),
      ragQueries: untracked('RAG query telemetry is not recorded by Backend.'),
      systemErrors: untracked('System error telemetry is not recorded.')
    },
    services: { backend: 'healthy', database, scraper: 'not_monitored', rag: ragHealth.rag, qdrant: ragHealth.qdrant, language, audio, whatsapp }
  };
}

module.exports = { getOverview };
