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
  res.json({ user: { id: req.user.id, role: req.user.role } });
}

async function getOverview(req, res, next) { try { res.json(await overviewService.getOverview()); } catch (error) { next(error); } }
async function listUsers(req, res, next) { try { res.json(await userService.listUsers(req.query)); } catch (error) { next(error); } }
async function getUser(req, res, next) {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
}
async function updateUserStatus(req, res, next) {
  try {
    if (typeof req.body?.isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be a boolean' });
    res.json({ user: await userService.updateStatus({ actorId: req.user.id, actorRole: req.user.role, userId: req.params.id, isActive: req.body.isActive, requestId: req.headers['x-request-id'] || null }) });
  } catch (error) { next(error); }
}
async function updateUserRole(req, res, next) {
  try {
    res.json({ user: await userService.updateRole({ actorId: req.user.id, actorRole: req.user.role, userId: req.params.id, role: req.body?.role, requestId: req.headers['x-request-id'] || null }) });
  } catch (error) { next(error); }
}
async function listSchemes(req, res, next) { try { res.json(await schemeService.listSchemes(req.query)); } catch (error) { next(error); } }
async function updateSchemeStatus(req, res, next) { try { res.json({ scheme: await schemeService.changeStatus({ actorId: req.user.id, schemeId: req.params.id, status: req.body?.status, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function reindexScheme(req, res, next) { try { res.json({ scheme: await schemeService.reindex({ actorId: req.user.id, schemeId: req.params.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function createScraperJob(req, res, next) { try { res.status(202).json({ job: await scraperService.createJob({ sourceUrl: req.body?.sourceUrl, sourceName: req.body?.sourceName, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listScraperJobs(req, res, next) { try { res.json(await scraperService.listJobs(req.query)); } catch (error) { next(error); } }
async function scraperStatus(req, res, next) { try { res.json(await scraperService.getStatus()); } catch (error) { next(error); } }
async function retryScraperJob(req, res, next) { try { res.json({ job: await scraperService.retryJob({ id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function cancelScraperJob(req, res, next) { try { res.json({ job: await scraperService.cancelJob({ id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function ragStatus(req, res, next) { try { res.json(await ragService.getStatus()); } catch (error) { next(error); } }
async function reindexAll(req, res, next) { try { res.json(await ragService.reindexAll({ actorId: req.user.id, requestId: req.headers['x-request-id'] || null })); } catch (error) { next(error); } }
async function listLogs(req, res, next) { try { res.json(await logsService.listLogs(req.query)); } catch (error) { next(error); } }
async function getAnalytics(req, res, next) { try { res.json(await analyticsService.getAnalytics()); } catch (error) { next(error); } }
async function listSources(req, res, next) { try { res.json(await sourcesService.listSources(req.query)); } catch (error) { next(error); } }
async function createSource(req, res, next) { try { res.status(201).json({ source: await sourcesService.createSource({ url: req.body?.url, title: req.body?.title, state: req.body?.state, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function deleteSource(req, res, next) { try { res.json({ source: await sourcesService.deleteSource({ id: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listApprovals(req, res, next) { try { res.json(await approvalsService.listPending(req.query)); } catch (error) { next(error); } }
async function approveScheme(req, res, next) { try { res.json({ scheme: await approvalsService.approve({ schemeId: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function rejectScheme(req, res, next) { try { res.json({ scheme: await approvalsService.reject({ schemeId: req.params.id, actorId: req.user.id, requestId: req.headers['x-request-id'] || null }) }); } catch (error) { next(error); } }
async function listLanguages(req, res, next) { try { res.json(await languagesService.listLanguages()); } catch (error) { next(error); } }

module.exports = {
  getSession, getOverview, listUsers, getUser, updateUserStatus, updateUserRole,
  listSchemes, updateSchemeStatus, reindexScheme, createScraperJob, listScraperJobs,
  scraperStatus, retryScraperJob, cancelScraperJob, ragStatus, reindexAll,
  listLogs, getAnalytics, listSources, createSource, deleteSource,
  listApprovals, approveScheme, rejectScheme, listLanguages
};
