const detectionService = require('../../services/detection/detectionService');

/**
 * POST /api/v1/detect
 * Automatically detects language, script, and Romanized Indic / Hinglish properties
 */
async function detect(req, res, next) {
  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        error: "'text' field must be a non-empty string",
        statusCode: 400,
        requestId: req.id
      });
    }

    const result = await detectionService.detect(text);
    return res.json({
      language: result.language,
      confidence: result.confidence,
      script: result.script,
      isRomanized: result.isRomanized || false,
      detectedCode: result.detectedCode || result.language,
      model: result.model || 'hybrid-detector',
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  detect
};
