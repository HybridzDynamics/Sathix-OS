const normalizer = require('../normalization/normalizer');
const detectionService = require('../detection/detectionService');
const transliterationEngine = require('./transliterationEngine');
const languageRegistry = require('../../models/registry/languageRegistry');

class TransliterationService {
  /**
   * Complete Romanized pipeline:
   * Romanized Input -> Detection -> Normalization -> Transliteration -> Native Script
   * @param {object} params
   * @param {string} params.text
   * @param {string} [params.sourceLanguage] (e.g. 'hi-Latn' or 'hi')
   * @param {string} [params.targetLanguage] (e.g. 'hi')
   * @param {string} [params.targetScript] (e.g. 'Devanagari')
   * @returns {Promise<object>}
   */
  async transliterate({ text, sourceLanguage, targetLanguage, targetScript }) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new Error("Field 'text' must be a non-empty string");
    }

    const startTime = Date.now();

    // 1. Language & Script Detection (if not explicitly specified)
    let srcLang = sourceLanguage;
    let isRomanized = true;

    if (!srcLang) {
      const detection = await detectionService.detect(text);
      srcLang = detection.language;
      isRomanized = detection.isRomanized;
    }

    const targetLang = languageRegistry.normalizeCode(targetLanguage || srcLang || 'hi');
    const targetLangInfo = languageRegistry.getLanguage(targetLang);

    if (!targetLangInfo) {
      throw new Error(`Unsupported target language for transliteration: '${targetLanguage}'`);
    }

    // 2. Normalization
    const normalizedText = normalizer.normalize(text);

    // 3. Transliteration
    const transliterated = transliterationEngine.transliterate(normalizedText, targetLang);

    const elapsed = Date.now() - startTime;

    return {
      transliteration: transliterated,
      originalText: text,
      normalizedText,
      sourceLanguage: srcLang.includes('-Latn') ? srcLang : `${srcLang}-Latn`,
      targetLanguage: targetLang,
      targetScript: targetScript || targetLangInfo.script,
      processingTimeMs: Math.max(1, elapsed)
    };
  }
}

module.exports = new TransliterationService();
