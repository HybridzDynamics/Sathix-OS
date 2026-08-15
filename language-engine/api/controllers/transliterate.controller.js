const transliterationService = require('../../services/transliteration/transliterationService');

/**
 * POST /api/v1/transliterate
 * Transliterates Romanized Indic text to Native Indic Script (e.g. Hinglish -> Devanagari)
 */
async function transliterate(req, res, next) {
  try {
    const { text, sourceLanguage, targetLanguage, targetScript } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        error: "'text' field must be a non-empty string",
        statusCode: 400,
        requestId: req.id
      });
    }

    const result = await transliterationService.transliterate({
      text,
      sourceLanguage,
      targetLanguage,
      targetScript
    });

    return res.json({
      transliteration: result.transliteration,
      originalText: result.originalText,
      normalizedText: result.normalizedText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage,
      targetScript: result.targetScript,
      processingTimeMs: result.processingTimeMs,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  transliterate
};
