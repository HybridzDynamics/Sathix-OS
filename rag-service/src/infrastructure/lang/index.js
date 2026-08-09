const config = require('../../config');

function getLanguageDetector() {
  const provider = process.env.LANGUAGE_DETECTOR || 'simple';
  if (provider === 'simple') {
    const SimpleDetector = require('./simpleDetector');
    return new SimpleDetector();
  }
  throw new Error(`Unknown language detector: ${provider}`);
}

module.exports = { getLanguageDetector };
