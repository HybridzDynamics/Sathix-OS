const { getProvider } = require('../../infrastructure/embeddings');
const { getVectorStore } = require('../../infrastructure/vector');
const crypto = require('crypto');

const provider = getProvider();
const vectorStore = getVectorStore();
let vectorStoreInitialized = false;

function stringToUuid(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32)
  ].join('-');
}

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
  
  const qdrantId = stringToUuid(id);
  
  const payload = {
    ...meta,
    schemeId: id, // store original id as schemeId
    documentId: id,
    source: meta.source || null,
    embeddingModel: embedding.model || 'noop',
    embeddedAt: new Date().toISOString()
  };
  await vectorStore.upsert('schemes', [{ id: qdrantId, vector, payload }]);
  return { id: qdrantId, vector, payload };
}

module.exports = { initVectorStore, embedDocument, stringToUuid };
