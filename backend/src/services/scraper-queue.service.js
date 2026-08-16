const { Queue } = require('bullmq');
const IORedis = require('ioredis');

let queue;
function getQueue() {
  if (queue) return queue;
  const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', { maxRetriesPerRequest: null, connectTimeout: 3000, retryStrategy: (times) => times > 2 ? null : Math.min(times * 500, 1000) });
  queue = new Queue('sathix-crawl', { connection });
  return queue;
}
function queueError(cause) { const error = new Error('Scraper queue is unavailable.'); error.code = 'SCRAPER_QUEUE_UNAVAILABLE'; error.status = 503; error.cause = cause; return error; }
async function enqueue({ jobId, sourceUrl, sourceName, attempt }) {
  try {
    const queueJobId = `${jobId}-${attempt}`;
    await getQueue().add('crawl', { url: sourceUrl, meta: { source: sourceName || null, adminJobId: jobId } }, { jobId: queueJobId, attempts: 3, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: false, removeOnFail: false });
    return queueJobId;
  } catch (cause) { throw queueError(cause); }
}
async function cancel(queueJobId) {
  try {
    const job = await getQueue().getJob(queueJobId);
    if (!job) return false;
    const state = await job.getState();
    if (!['waiting', 'delayed', 'paused'].includes(state)) return false;
    await job.remove();
    return true;
  } catch (cause) { throw queueError(cause); }
}
async function counts() { try { return await getQueue().getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'); } catch { return null; } }
module.exports = { enqueue, cancel, counts };
