const { getProvider } = require('../../infrastructure/embeddings');
const { getVectorStore } = require('../../infrastructure/vector');
const { getLanguageDetector } = require('../../infrastructure/lang');
const rankingService = require('./rankingService');

const provider = getProvider();
const vectorStore = getVectorStore();
const languageDetector = getLanguageDetector();
let vectorStoreInitialized = false;

async function initVectorStore() {
  if (vectorStoreInitialized) return;
  await vectorStore.ensureCollection('schemes', {
    size: Number(process.env.EMBEDDING_DIM || 384),
    distance: 'cosine'
  });
  vectorStoreInitialized = true;
}

async function retrieve(query, options = {}) {
  await initVectorStore();
  const { language, confidence } = await languageDetector.detect(query);
  const embedding = await provider.embed(query, { language });
  const vector = Array.isArray(embedding.vector) ? embedding.vector : [];
  const topK = Number(options.topK || 5);
  const filters = options.filters || {};
  const searchLimit = Number(options.searchLimit || topK * 4);

  const rawResults = await vectorStore.search('schemes', vector, searchLimit, filters);
  const ranked = rankingService.rankResults(rawResults, {
    queryLanguage: language,
    topK
  });

  return {
    query,
    language,
    confidence,
    topK,
    results: ranked.map((item) => ({
      id: item.id,
      score: item.score,
      finalScore: item.finalScore,
      payload: item.payload
    }))
  };
}

module.exports = { retrieve };
