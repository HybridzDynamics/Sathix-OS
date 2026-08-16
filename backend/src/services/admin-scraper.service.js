const queue = require('./scraper-queue.service');
const select = { id: true, queueJobId: true, sourceUrl: true, sourceName: true, status: true, startedAt: true, completedAt: true, pagesProcessed: true, pagesFailed: true, schemesDiscovered: true, newSchemes: true, updatedSchemes: true, failedItems: true, error: true, retryCount: true, triggeredBy: true, requestId: true, createdAt: true };
function validUrl(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol); } catch { return false; } }
function paging(query = {}) { const page = Math.max(1, Number.parseInt(query.page, 10) || 1); const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25)); return { page, limit, skip: (page - 1) * limit }; }
async function createJob(prisma, { sourceUrl, sourceName, actorId, requestId }) {
  if (!validUrl(sourceUrl)) { const error = new Error('sourceUrl must be a valid HTTP(S) URL.'); error.status = 422; throw error; }
  const job = await prisma.scraperJob.create({ data: { sourceUrl, sourceName: sourceName || null, triggeredBy: actorId, requestId, status: 'QUEUED' }, select });
  try {
    const queueJobId = await queue.enqueue({ jobId: job.id, sourceUrl, sourceName, attempt: 1 });
    const queued = await prisma.scraperJob.update({ where: { id: job.id }, data: { queueJobId }, select });
    await prisma.auditLog.create({ data: { action: 'SCRAPER_JOB_QUEUED', entity: 'ScraperJob', entityId: job.id, details: JSON.stringify({ actorId, sourceUrl, requestId }) } });
    return queued;
  } catch (error) {
    await prisma.scraperJob.update({ where: { id: job.id }, data: { status: 'FAILED', completedAt: new Date(), error: error.message } });
    throw error;
  }
}
async function listJobs(prisma, query) { const { page, limit, skip } = paging(query); const where = query.status ? { status: query.status } : {}; const [items, total] = await prisma.$transaction([prisma.scraperJob.findMany({ where, select, orderBy: { createdAt: 'desc' }, skip, take: limit }), prisma.scraperJob.count({ where })]); return { items, page, limit, total, totalPages: Math.ceil(total / limit) }; }
async function getStatus(prisma) { const [byStatus, latest, queueCounts] = await Promise.all([prisma.scraperJob.groupBy({ by: ['status'], _count: { _all: true } }), prisma.scraperJob.findFirst({ select, orderBy: { createdAt: 'desc' } }), queue.counts()]); return { byStatus: Object.fromEntries(byStatus.map((item) => [item.status, item._count._all])), latest, queue: queueCounts }; }
async function retryJob(prisma, { id, actorId, requestId }) {
  const job = await prisma.scraperJob.findUnique({ where: { id }, select });
  if (!job) { const error = new Error('Scraper job not found.'); error.status = 404; throw error; }
  if (!['FAILED', 'CANCELLED'].includes(job.status)) { const error = new Error('Only failed or cancelled jobs can be retried.'); error.status = 409; throw error; }
  const retryCount = job.retryCount + 1;
  const queueJobId = await queue.enqueue({ jobId: job.id, sourceUrl: job.sourceUrl, sourceName: job.sourceName, attempt: retryCount + 1 });
  const retried = await prisma.scraperJob.update({ where: { id }, data: { status: 'QUEUED', queueJobId, retryCount, error: null, startedAt: null, completedAt: null, requestId }, select });
  await prisma.auditLog.create({ data: { action: 'SCRAPER_JOB_RETRIED', entity: 'ScraperJob', entityId: id, details: JSON.stringify({ actorId, requestId }) } });
  return retried;
}
async function cancelJob(prisma, { id, actorId, requestId }) {
  const job = await prisma.scraperJob.findUnique({ where: { id }, select });
  if (!job) { const error = new Error('Scraper job not found.'); error.status = 404; throw error; }
  if (!job.queueJobId || !await queue.cancel(job.queueJobId)) { const error = new Error('This job cannot be cancelled after processing has started.'); error.status = 409; throw error; }
  const cancelled = await prisma.scraperJob.update({ where: { id }, data: { status: 'CANCELLED', completedAt: new Date(), requestId }, select });
  await prisma.auditLog.create({ data: { action: 'SCRAPER_JOB_CANCELLED', entity: 'ScraperJob', entityId: id, details: JSON.stringify({ actorId, requestId }) } });
  return cancelled;
}
module.exports = { createJob, listJobs, getStatus, retryJob, cancelJob };
