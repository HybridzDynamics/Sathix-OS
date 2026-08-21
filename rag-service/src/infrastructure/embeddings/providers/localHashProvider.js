const crypto = require('crypto');
const EmbeddingProvider = require('../../../domain/ports/embeddingProvider');

/**
 * Deterministic local embeddings for Docker/dev without external API keys.
 * Produces normalized vectors suitable for Qdrant cosine search.
 */
class LocalHashProvider extends EmbeddingProvider {
  constructor(options = {}) {
    super();
    this.dim = Number(process.env.EMBEDDING_DIM || options.dim || 384);
  }

  async embed(text) {
    const vector = new Array(this.dim).fill(0);
    const tokens = String(text || '').toLowerCase().split(/\W+/).filter(Boolean);
    for (const token of tokens) {
      const hash = crypto.createHash('sha256').update(token).digest();
      for (let i = 0; i < this.dim; i += 1) {
        vector[i] += (hash[i % hash.length] / 255) - 0.5;
      }
    }
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return {
      vector: vector.map((value) => value / norm),
      model: 'local-hash',
      meta: { tokenCount: tokens.length, dim: this.dim }
    };
  }
}

module.exports = LocalHashProvider;
