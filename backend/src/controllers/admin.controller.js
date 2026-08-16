const overviewService = require('../services/admin-overview.service');
const userService = require('../services/admin-user.service');
const schemeService = require('../services/admin-scheme.service');

function getSession(req, res) {
  // Return only identity data required for the admin shell. Never return credentials.
  res.json({ user: { id: req.user.id, role: req.user.role } });
}

async function getOverview(req, res, next) {
  try { res.json(await overviewService.getOverview(req.app.locals.prisma)); } catch (error) { next(error); }
}

async function listUsers(req, res, next) {
  try { res.json(await userService.listUsers(req.app.locals.prisma, req.query)); } catch (error) { next(error); }
}

async function getUser(req, res, next) {
  try {
    const user = await userService.getUser(req.app.locals.prisma, req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
}

async function updateUserStatus(req, res, next) {
  try {
    if (typeof req.body?.isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be a boolean' });
    res.json({ user: await userService.updateStatus(req.app.locals.prisma, { actorId: req.user.id, actorRole: req.user.role, userId: req.params.id, isActive: req.body.isActive, requestId: req.headers['x-request-id'] || null }) });
  } catch (error) { next(error); }
}

async function updateUserRole(req, res, next) {
  try {
    res.json({ user: await userService.updateRole(req.app.locals.prisma, { actorId: req.user.id, actorRole: req.user.role, userId: req.params.id, role: req.body?.role, requestId: req.headers['x-request-id'] || null }) });
  } catch (error) { next(error); }
}

async function listSchemes(req, res, next) { try { res.json(await schemeService.listSchemes(req.app.locals.prisma, req.query)); } catch (error) { next(error); } }
async function updateSchemeStatus(req, res, next) { try { res.json({ scheme: await schemeService.changeStatus(req.app.locals.prisma, { actorId: req.user.id, schemeId: req.params.id, status: req.body?.status, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function reindexScheme(req, res, next) { try { res.json({ scheme: await schemeService.reindex(req.app.locals.prisma, { actorId: req.user.id, schemeId: req.params.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }

module.exports = { getSession, getOverview, listUsers, getUser, updateUserStatus, updateUserRole, listSchemes, updateSchemeStatus, reindexScheme };
