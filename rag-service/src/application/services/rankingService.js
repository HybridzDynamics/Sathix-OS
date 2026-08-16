const DEFAULT_SOURCE_PRIORITIES = {
  government: 1.0,
  official: 0.9,
  news: 0.7,
  nonprofit: 0.7,
  blog: 0.4,
  other: 0.2
};

function getSourcePriority(payload) {
  if (!payload) return 0.2;
  if (typeof payload.sourcePriority === 'number') {
    return Math.max(0, Math.min(1, payload.sourcePriority));
  }

  const source = (payload.source || '').toString().toLowerCase();
  for (const key of Object.keys(DEFAULT_SOURCE_PRIORITIES)) {
    if (source.includes(key)) {
      return DEFAULT_SOURCE_PRIORITIES[key];
    }
  }
  return DEFAULT_SOURCE_PRIORITIES.other;
}

function getFreshnessScore(payload) {
  if (!payload) return 0;
  const created = payload.createdAt || payload.updatedAt || payload.embeddedAt;
  const timestamp = Date.parse(created);
  if (Number.isNaN(timestamp)) return 0;
  const ageDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  const decay = Math.exp(-ageDays / 30);
  return Math.max(0, Math.min(1, decay));
}

function getLanguageMatchBoost(payload, queryLanguage) {
  if (!payload || !payload.language || !queryLanguage) return 0;
  return payload.language.toLowerCase() === queryLanguage.toLowerCase() ? 0.05 : 0;
}

function rankResults(results, options = {}) {
  const weights = {
    relevance: Number(process.env.RANK_WEIGHT_RELEVANCE || 0.6),
    freshness: Number(process.env.RANK_WEIGHT_FRESHNESS || 0.2),
    priority: Number(process.env.RANK_WEIGHT_PRIORITY || 0.2)
  };
  const queryLanguage = options.queryLanguage;
  const topK = Number(options.topK || 5);

  const ranked = results.map((item) => {
    const payload = item.payload || {};
    const relevance = Number(item.score || 0);
    const freshness = getFreshnessScore(payload);
    const priority = getSourcePriority(payload);
    const boost = getLanguageMatchBoost(payload, queryLanguage);
    const finalScore = relevance * weights.relevance + freshness * weights.freshness + priority * weights.priority + boost;
    return { ...item, finalScore };
  });

  ranked.sort((a, b) => b.finalScore - a.finalScore);
  return ranked.slice(0, topK);
}

module.exports = { rankResults, getSourcePriority, getFreshnessScore };
