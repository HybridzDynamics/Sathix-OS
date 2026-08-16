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

async function getOverview(prisma) {
  const database = await prisma.$queryRaw`SELECT 1`.then(() => 'healthy').catch(() => 'unavailable');
  const counts = database === 'healthy' ? await Promise.all([
    prisma.user.count(),
    prisma.scheme.count(),
    prisma.application.count(),
    prisma.chatMessage.count({ where: { role: 'user' } }),
    prisma.scraperLog.count()
  ]) : [null, null, null, null, null];
  const [totalUsers, totalSchemes, totalApplications, aiQueries, scraperRuns] = counts;
  const databaseMetric = (value) => database === 'healthy' ? tracked(value) : untracked('Database is unavailable.');
  const [rag, language, audio] = await Promise.all([
    probe(process.env.RAG_ENGINE_URL || 'http://localhost:3001', '/rag/health'),
    probe(process.env.LANGUAGE_ENGINE_URL),
    probe(process.env.VOICE_SERVICE_URL)
  ]);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      totalUsers: databaseMetric(totalUsers),
      totalSchemes: databaseMetric(totalSchemes),
      totalApplications: databaseMetric(totalApplications),
      aiQueries: databaseMetric(aiQueries),
      scraperRuns: databaseMetric(scraperRuns),
      activeUsers: untracked('Last-active events are not recorded.'),
      activeSchemes: untracked('Scheme status is not recorded.'),
      indexedDocuments: untracked('RAG indexing metrics are not recorded by Backend.'),
      indexedChunks: untracked('RAG chunk metrics are not recorded by Backend.'),
      voiceQueries: untracked('Voice request telemetry is not recorded by Backend.'),
      translationRequests: untracked('Translation request telemetry is not recorded by Backend.'),
      ragQueries: untracked('RAG query telemetry is not recorded by Backend.'),
      successfulScraperRuns: untracked('Scraper run completion status is not recorded.'),
      failedScraperRuns: untracked('Scraper run failure status is not recorded.'),
      systemErrors: untracked('System error telemetry is not recorded.')
    },
    services: { backend: 'healthy', database, scraper: 'not_monitored', rag, language, audio }
  };
}

module.exports = { getOverview };
