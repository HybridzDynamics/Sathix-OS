const aiService = require('../services/ai.service');

const chat = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const { message, language } = req.body;
    const response = await aiService.chat(prisma, req.user.id, { message, language });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const history = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const sessions = await aiService.getHistory(prisma, req.user.id);
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, history };
