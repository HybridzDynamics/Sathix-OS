const LanguageDetector = require('../../domain/ports/languageDetector');

class SimpleDetector extends LanguageDetector {
  async detect(text) {
    if (!text || typeof text !== 'string') {
      return { language: 'und', confidence: 0.0 };
    }

    // Basic multilingual heuristic: Devanagari => Hindi; otherwise default to English.
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasLatin = /[A-Za-z]/.test(text);

    if (hasDevanagari && !hasLatin) {
      return { language: 'hi', confidence: 0.75 };
    }
    if (hasDevanagari && hasLatin) {
      return { language: 'hi', confidence: 0.55 };
    }
    return { language: 'en', confidence: 0.84 };
  }
}

module.exports = SimpleDetector;
