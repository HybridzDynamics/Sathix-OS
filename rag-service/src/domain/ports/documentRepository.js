class DocumentRepository {
  async listPendingForEmbedding(limit = 100) { throw new Error('not implemented'); }
  async getById(id) { throw new Error('not implemented'); }
  async streamDocuments(filters = {}) { throw new Error('not implemented'); }
}

module.exports = DocumentRepository;
