// Qdrant client adapter stub. Implement in Phase 4.
class QdrantClient {
  constructor() {}
  async ensureCollection(name, config) { throw new Error('not implemented'); }
  async upsert(collection, items) { throw new Error('not implemented'); }
  async search(collection, vector, topK, filters) { throw new Error('not implemented'); }
}

module.exports = QdrantClient;
