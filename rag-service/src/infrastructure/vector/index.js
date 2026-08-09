const config = require('../../config');
const InMemoryVectorStore = require('./inMemoryVectorStore');
const QdrantClient = require('./qdrantClient');

function getVectorStore() {
  const v = process.env.VECTOR_STORE || 'memory';
  if (v === 'qdrant') {
    return new QdrantClient(process.env.QDRANT_URL, process.env.QDRANT_API_KEY);
  }
  return new InMemoryVectorStore();
}

module.exports = { getVectorStore };
