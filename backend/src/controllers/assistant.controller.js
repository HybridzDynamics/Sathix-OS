const aiService = require('../services/ai.service');

const chat = async (req, res, next) => {
  try {
    const { message, language, sessionId } = req.body;
    if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
      const error = new Error('message must be a non-empty string no longer than 4000 characters.');
      error.status = 422;
      throw error;
    }
    const response = await aiService.chat(req.user.id, { message: message.trim(), language, sessionId });
    res.json(response);
  } catch (error) { next(error); }
};

const history = async (req, res, next) => {
  try {
    const sessions = await aiService.getHistory(req.user.id);
    res.json({ sessions });
  } catch (error) { next(error); }
};

module.exports = { chat, history };
