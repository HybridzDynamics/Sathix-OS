class VectorStore {
  async ensureCollection(name, config) { throw new Error('not implemented'); }
  async upsert(collection, items) { throw new Error('not implemented'); }
  async search(collection, vector, topK, filters) { throw new Error('not implemented'); }
  async delete(collection, ids) { throw new Error('not implemented'); }
}

module.exports = VectorStore;
