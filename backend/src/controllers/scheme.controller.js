const schemeService = require('../services/scheme.service');

const getSchemes = async (req, res, next) => {
  try {
    const schemes = await schemeService.listSchemes();
    res.json({ schemes });
  } catch (error) { next(error); }
};

const recommendSchemes = async (req, res, next) => {
  try {
    const recommendations = await schemeService.recommend(req.user.id);
    res.json({ recommendations });
  } catch (error) { next(error); }
};

module.exports = { getSchemes, recommendSchemes };
