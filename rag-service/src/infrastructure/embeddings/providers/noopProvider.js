const EmbeddingProvider = require('../../../domain/ports/embeddingProvider');
const config = require('../../../config');

class NoopProvider extends EmbeddingProvider {
  constructor(options = {}) {
    super();
    this.dim = Number(process.env.EMBEDDING_DIM || options.dim || 384);
  }

  async embed(text, options = {}) {
    // deterministic zero vector for now; consumers should handle empty vectors.
    const vector = new Array(this.dim).fill(0.0);
    return { vector, model: 'noop', meta: { length: text ? text.length : 0 } };
  }
}

module.exports = NoopProvider;
