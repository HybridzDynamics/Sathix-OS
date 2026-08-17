const rag = require('../integrations/rag.client');

async function voiceQuery(req, res, next) {
  try {
    const { query, language = 'en', filters = {}, topK = 5 } = req.body || {};
    if (typeof query !== 'string' || !query.trim() || query.length > 4000) {
      const error = new Error('query must be a non-empty string no longer than 4000 characters.');
      error.code = 'INVALID_QUERY'; error.status = 422; throw error;
    }
    if (typeof language !== 'string' || language.length > 20 || !/^[A-Za-z-]+$/.test(language)) {
      const error = new Error('language must be a valid language code.'); error.code = 'INVALID_LANGUAGE'; error.status = 422; throw error;
    }
    if (!filters || Array.isArray(filters) || typeof filters !== 'object') {
      const error = new Error('filters must be an object.'); error.code = 'INVALID_FILTERS'; error.status = 422; throw error;
    }
    const data = await rag.query({ query: query.trim(), language, filters, topK: Math.min(20, Math.max(1, Number(topK) || 5)), requestId: req.id });
    res.json({ answer: data.answer || '', sources: data.sources || [], documents: data.documents || [] });
  } catch (error) { next(error); }
}

module.exports = { voiceQuery };
