const config = require('../../config');
const InMemoryVectorStore = require('./inMemoryVectorStore');
const QdrantClient = require('./qdrantClient');

let vectorStore;

function getVectorStore() {
  if (vectorStore) return vectorStore;
  const v = process.env.VECTOR_STORE || 'memory';
  if (v === 'qdrant') {
    vectorStore = new QdrantClient(process.env.QDRANT_URL, process.env.QDRANT_API_KEY);
    return vectorStore;
  }
  vectorStore = new InMemoryVectorStore();
  return vectorStore;
}

module.exports = { getVectorStore };
