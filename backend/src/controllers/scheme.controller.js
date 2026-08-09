const schemeService = require('../services/scheme.service');

const getSchemes = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const schemes = await schemeService.listSchemes(prisma);
    res.json({ schemes });
  } catch (error) {
    next(error);
  }
};

const recommendSchemes = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const userId = req.user.id;
    const input = req.body;
    const recommendations = await schemeService.recommendSchemes(prisma, userId, input);
    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSchemes, recommendSchemes };
