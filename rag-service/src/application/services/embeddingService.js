const { getProvider } = require('../../infrastructure/embeddings');
const { getVectorStore } = require('../../infrastructure/vector');

const provider = getProvider();
const vectorStore = getVectorStore();
let vectorStoreInitialized = false;

async function initVectorStore() {
  if (vectorStoreInitialized) return;
  await vectorStore.ensureCollection('schemes', {
    size: Number(process.env.EMBEDDING_DIM || 384),
    distance: 'cosine'
  });
  vectorStoreInitialized = true;
}

async function embedDocument({ id, text, meta = {} }) {
  await initVectorStore();
  const content = text || '';
  const embedding = await provider.embed(content, { language: meta.language, documentId: id });
  const vector = Array.isArray(embedding.vector) ? embedding.vector : [];
  const payload = {
    ...meta,
    documentId: id,
    source: meta.source || null,
    embeddingModel: embedding.model || 'noop',
    embeddedAt: new Date().toISOString()
  };
  await vectorStore.upsert('schemes', [{ id, vector, payload }]);
  return { id, vector, payload };
}

module.exports = { initVectorStore, embedDocument };
