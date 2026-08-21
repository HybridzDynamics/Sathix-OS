const overviewService = require('../services/admin-overview.service');
const userService = require('../services/admin-user.service');
const schemeService = require('../services/admin-scheme.service');
const scraperService = require('../services/admin-scraper.service');
const ragService = require('../services/admin-rag.service');
const logsService = require('../services/admin-logs.service');
const analyticsService = require('../services/admin-analytics.service');
const sourcesService = require('../services/admin-sources.service');
const approvalsService = require('../services/admin-approvals.service');
const languagesService = require('../services/admin-languages.service');

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
async function createScraperJob(req, res, next) { try { res.status(202).json({ job: await scraperService.createJob(req.app.locals.prisma, { sourceUrl: req.body?.sourceUrl, sourceName: req.body?.sourceName, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listScraperJobs(req, res, next) { try { res.json(await scraperService.listJobs(req.app.locals.prisma, req.query)); } catch (error) { next(error); } }
async function scraperStatus(req, res, next) { try { res.json(await scraperService.getStatus(req.app.locals.prisma)); } catch (error) { next(error); } }
async function retryScraperJob(req, res, next) { try { res.json({ job: await scraperService.retryJob(req.app.locals.prisma, { id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function cancelScraperJob(req, res, next) { try { res.json({ job: await scraperService.cancelJob(req.app.locals.prisma, { id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function ragStatus(req, res, next) { try { res.json(await ragService.getStatus(req.app.locals.prisma)); } catch (error) { next(error); } }
async function reindexAll(req, res, next) { try { res.json(await ragService.reindexAll(req.app.locals.prisma, { actorId: req.user.id, requestId: req.headers['x-request-id'] || null })); } catch (error) { next(error); } }
async function listLogs(req, res, next) { try { res.json(await logsService.listLogs(req.app.locals.prisma, req.query)); } catch (error) { next(error); } }
async function getAnalytics(req, res, next) { try { res.json(await analyticsService.getAnalytics(req.app.locals.prisma)); } catch (error) { next(error); } }
async function listSources(req, res, next) { try { res.json(await sourcesService.listSources(req.app.locals.prisma, req.query)); } catch (error) { next(error); } }
async function createSource(req, res, next) { try { res.status(201).json({ source: await sourcesService.createSource(req.app.locals.prisma, { url: req.body?.url, title: req.body?.title, state: req.body?.state, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function deleteSource(req, res, next) { try { res.json({ source: await sourcesService.deleteSource(req.app.locals.prisma, { id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listApprovals(req, res, next) { try { res.json(await approvalsService.listPending(req.app.locals.prisma, req.query)); } catch (error) { next(error); } }
async function approveScheme(req, res, next) { try { res.json({ scheme: await approvalsService.approve(req.app.locals.prisma, { schemeId: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function rejectScheme(req, res, next) { try { res.json({ scheme: await approvalsService.reject(req.app.locals.prisma, { schemeId: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listLanguages(req, res, next) { try { res.json(await languagesService.listLanguages()); } catch (error) { next(error); } }

module.exports = {
  getSession, getOverview, listUsers, getUser, updateUserStatus, updateUserRole,
  listSchemes, updateSchemeStatus, reindexScheme, createScraperJob, listScraperJobs,
  scraperStatus, retryScraperJob, cancelScraperJob, ragStatus, reindexAll,
  listLogs, getAnalytics, listSources, createSource, deleteSource,
  listApprovals, approveScheme, rejectScheme, listLanguages
};
