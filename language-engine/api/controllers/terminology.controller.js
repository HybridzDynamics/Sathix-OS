const terminologyService = require('../../services/terminology/terminologyService');

/**
 * GET /api/v1/terminology
 * Returns official government terminology dictionaries and schemes mappings
 */
function getTerminology(req, res) {
  const { category } = req.query;
  const terms = terminologyService.getTerms(category);
  return res.json({
    status: 'ok',
    category: category || 'all',
    data: terms
  });
}

module.exports = {
  getTerminology
};
