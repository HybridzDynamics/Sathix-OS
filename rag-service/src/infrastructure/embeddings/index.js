const EmbeddingProvider = require('../../domain/ports/embeddingProvider');
const config = require('../../config');

function getProvider() {
  const provider = config.EMBEDDING_PROVIDER;
  if (!provider || provider === 'none' || provider === 'noop') {
    const Noop = require('./providers/noopProvider');
    return new Noop();
  }
  if (provider === 'local' || provider === 'local-hash') {
    const LocalHash = require('./providers/localHashProvider');
    return new LocalHash();
  }
  throw new Error(`Unknown embedding provider: ${provider}`);
}

module.exports = { getProvider };
