const { QdrantClient: RealQdrantClient } = require('@qdrant/js-client-rest');
const config = require('../../config');

class QdrantClient {
  constructor() {
    const qdrantUrl = config.QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333';
    this.client = new RealQdrantClient({
      url: qdrantUrl,
      apiKey: config.QDRANT_API_KEY || process.env.QDRANT_API_KEY
    });
  }

  async ensureCollection(name, config) {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === name);
      if (!exists) {
        await this.client.createCollection(name, {
          vectors: {
            size: config.size,
            distance: 'Cosine'
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring collection:', error.message);
    }
  }

  async upsert(collection, items) {
    // items should be [{ id, vector, payload }]
    await this.client.upsert(collection, {
      wait: true,
      points: items
    });
  }

  async search(collection, vector, topK, filters) {
    const filterCondition = filters && Object.keys(filters).length > 0 ? {
      must: Object.entries(filters)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => ({
          key,
          match: { value }
        }))
    } : undefined;

    const result = await this.client.query(collection, {
      query: vector,
      limit: topK,
      filter: filterCondition,
      with_payload: true
    });

    if (Array.isArray(result)) return result;
    if (result && Array.isArray(result.points)) return result.points;
    return [];
  }
}

module.exports = QdrantClient;
