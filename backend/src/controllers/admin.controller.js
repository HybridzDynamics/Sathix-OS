const overviewService = require('../services/admin-overview.service');

function getSession(req, res) {
  // Return only identity data required for the admin shell. Never return credentials.
  res.json({ user: { id: req.user.id, role: req.user.role } });
}

async function getOverview(req, res, next) {
  try { res.json(await overviewService.getOverview(req.app.locals.prisma)); } catch (error) { next(error); }
}

module.exports = { getSession, getOverview };
