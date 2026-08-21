async function getAnalytics(prisma) {
  const [
    schemesByStateRaw,
    usersByLanguage,
    applicationsByStatus,
    recentMessages,
    schemeCategories,
    scraperJobStats
  ] = await Promise.all([
    prisma.scheme.groupBy({
      by: ['state'],
      where: { status: 'ACTIVE' },
      _count: { _all: true }
    }),
    prisma.user.groupBy({
      by: ['language'],
      _count: { _all: true }
    }),
    prisma.application.groupBy({
      by: ['status'],
      _count: { _all: true }
    }),
    prisma.chatMessage.findMany({
      where: {
        role: 'user',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.scheme.groupBy({
      by: ['category'],
      where: { status: 'ACTIVE', category: { not: null } },
      _count: { _all: true }
    }),
    prisma.scraperJob.groupBy({
      by: ['status'],
      _count: { _all: true }
    })
  ]);

  const schemesByState = schemesByStateRaw
    .map((row) => ({ state: row.state || 'All India', count: row._count._all }))
    .sort((a, b) => b.count - a.count);

  const totalUsers = usersByLanguage.reduce((sum, row) => sum + row._count._all, 0) || 1;
  const languageLabels = { ENGLISH: 'English', HINDI: 'Hindi', OTHER: 'Other' };
  const languageDistribution = usersByLanguage.map((row) => ({
    name: languageLabels[row.language] || row.language,
    value: Math.round((row._count._all / totalUsers) * 100)
  }));

  const dayBuckets = {};
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayBuckets[key] = { date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }), total: 0 };
  }
  for (const message of recentMessages) {
    const key = message.createdAt.toISOString().slice(0, 10);
    if (dayBuckets[key]) dayBuckets[key].total += 1;
  }
  const queryVolume = Object.values(dayBuckets);

  const applications = applicationsByStatus.map((row) => ({
    status: row.status,
    count: row._count._all
  }));

  const categories = schemeCategories
    .filter((row) => row.category)
    .map((row) => ({ category: row.category, count: row._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const scraperJobs = Object.fromEntries(scraperJobStats.map((row) => [row.status, row._count._all]));

  return {
    generatedAt: new Date().toISOString(),
    schemesByState,
    languageDistribution,
    queryVolume,
    applications,
    categories,
    scraperJobs,
    totals: {
      userQueriesLast7Days: recentMessages.length,
      activeSchemeStates: schemesByState.length
    }
  };
}

module.exports = { getAnalytics };
