const EmbeddingProvider = require('../../domain/ports/embeddingProvider');
const config = require('../../config');

function getProvider() {
  const provider = config.EMBEDDING_PROVIDER;
  if (!provider || provider === 'none' || provider === 'noop') {
    const Noop = require('./providers/noopProvider');
    return new Noop();
  }
  // Future: load 'openai', 'hf' providers here dynamically
  throw new Error(`Unknown embedding provider: ${provider}`);
}

module.exports = { getProvider };
