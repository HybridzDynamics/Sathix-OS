const languageRegistry = require('../../models/registry/languageRegistry');

/**
 * GET /api/v1/languages
 * Returns all supported languages with metadata and filtering
 */
function getAllLanguages(req, res) {
  const { capability, isIndic } = req.query;
  const filter = {};

  if (capability) filter[capability] = true;
  if (isIndic !== undefined) filter.isIndic = isIndic === 'true';

  const languages = languageRegistry.getAllLanguages(filter);
  return res.json({
    status: 'ok',
    total: Object.keys(languages).length,
    languages
  });
}

/**
 * GET /api/v1/languages/:code
 * Returns metadata for a specific language
 */
function getLanguageByCode(req, res) {
  const { code } = req.params;
  const language = languageRegistry.getLanguage(code);

  if (!language) {
    return res.status(404).json({
      error: `Language code or name '${code}' not found in registry`,
      statusCode: 404,
      requestId: req.id
    });
  }

  return res.json({
    status: 'ok',
    language
  });
}

module.exports = {
  getAllLanguages,
  getLanguageByCode
};
