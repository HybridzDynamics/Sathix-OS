const translationService = require('../../services/translation/translationService');
const languageRegistry = require('../../models/registry/languageRegistry');

/**
 * POST /api/v1/translate
 * Translates single sentence or batch of sentences between supported languages.
 */
async function translate(req, res, next) {
  const startTime = Date.now();
  try {
    const { text, texts, sourceLanguage, targetLanguage, provider } = req.body || {};

    // 1. Input presence validation
    if (!text && (!texts || !Array.isArray(texts) || texts.length === 0)) {
      return res.status(400).json({
        error: "Either 'text' (string) or 'texts' (array of strings) must be provided",
        statusCode: 400,
        requestId: req.id
      });
    }

    if (!sourceLanguage || typeof sourceLanguage !== 'string') {
      return res.status(400).json({
        error: "'sourceLanguage' is required (e.g. 'en', 'hi', 'ta')",
        statusCode: 400,
        requestId: req.id
      });
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({
        error: "'targetLanguage' is required (e.g. 'en', 'hi', 'ta')",
        statusCode: 400,
        requestId: req.id
      });
    }

    // 2. Language normalization and validation
    const src = languageRegistry.normalizeCode(sourceLanguage);
    const tgt = languageRegistry.normalizeCode(targetLanguage);

    if (!src) {
      return res.status(400).json({
        error: `Unsupported source language: '${sourceLanguage}'`,
        statusCode: 400,
        requestId: req.id
      });
    }

    if (!tgt) {
      return res.status(400).json({
        error: `Unsupported target language: '${targetLanguage}'`,
        statusCode: 400,
        requestId: req.id
      });
    }

    if (src === tgt) {
      return res.status(400).json({
        error: 'Source and target languages cannot be identical',
        statusCode: 400,
        requestId: req.id
      });
    }

    // 3. Execute translation via TranslationService orchestrator
    const result = await translationService.translate({
      text,
      texts,
      sourceLanguage: src,
      targetLanguage: tgt,
      provider
    });

    const elapsed = Date.now() - startTime;

    // 4. Clean response ensuring zero internal filesystem or model paths are exposed
    const response = {
      sourceLanguage: src,
      targetLanguage: tgt,
      model: result.model || 'indictrans2',
      modelVersion: result.modelVersion || '2.0.0',
      processingTimeMs: result.processingTimeMs || elapsed,
      requestId: req.id
    };

    if (result.translations) {
      response.translations = result.translations;
    } else {
      response.translation = result.translation || '';
    }

    return res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  translate
};
