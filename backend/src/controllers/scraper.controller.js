const scraperService = require('../services/admin-scraper.service');

const startScraper = async (req, res, next) => {
  try {
    const { sourceUrl, sourceName } = req.body || {};
    if (!sourceUrl) {
      return res.status(422).json({ message: 'sourceUrl is required.' });
    }
    const job = await scraperService.createJob(req.app.locals.prisma, {
      sourceUrl,
      sourceName,
      actorId: req.user.id,
      requestId: req.headers['x-request-id'] || null
    });
    res.status(202).json({ job });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    res.json(await scraperService.getStatus(req.app.locals.prisma));
  } catch (error) {
    next(error);
  }
};

module.exports = { startScraper, getStatus };
