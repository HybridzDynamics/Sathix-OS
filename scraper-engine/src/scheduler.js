const { Queue, QueueScheduler } = require('bullmq');
const IORedis = require('ioredis');
const path = require('path');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

/**
 * Scheduler: enqueues seed URLs for crawling using BullMQ.
 * Provides a simple periodic scheduler and an API to enqueue seeds immediately.
 * @module scheduler
 */

const connection = new IORedis(redisUrl);
const queueName = 'sathix-crawl';
const queue = new Queue(queueName, { connection });
const scheduler = new QueueScheduler(queueName, { connection });

/**
 * Schedule periodic enqueuing of seeds using a repeatable job.
 * @param {string} cronExpr cron expression (defaults to SCHEDULE_CRON env var or daily at 2 AM)
 */
async function schedulePeriodicSeeds(cronExpr = process.env.SCHEDULE_CRON || '0 2 * * *') {
  // Add a repeatable job that calls enqueueAllSeeds
  await queue.add('enqueue-seeds', {}, { repeat: { cron: cronExpr }, removeOnComplete: true, removeOnFail: false });
}

/**
 * Remove all repeatable seed scheduling jobs.
 */
async function removePeriodicSeeds() {
  const jobs = await queue.getRepeatableJobs();
  for (const j of jobs) {
    if (j.name === 'enqueue-seeds') await queue.removeRepeatableByKey(j.key);
  }
}

/**
 * Enqueue a URL for crawling.
 * @param {string} url
 * @param {object} [meta]
 */
async function enqueueUrl(url, meta = {}) {
  await queue.add('crawl', { url, meta }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
}

/**
 * Read sources from `src/sources` and enqueue seeds.
 */
function loadSources() {
  const sourcesDir = path.join(__dirname, 'sources');
  const sources = [];
  try {
    const central = require('./sources/central/schemes');
    const delhi = require('./sources/states/delhi');
    sources.push(central, delhi);
  } catch (e) {
    // ignore if not present
  }
  return sources;
}

/**
 * Enqueue all seeds from sources.
 */
async function enqueueAllSeeds() {
  const sources = loadSources();
  for (const s of sources) {
    if (!s || !s.seeds) continue;
    for (const url of s.seeds) {
      await enqueueUrl(url, { source: s.name });
    }
  }
}

module.exports = { enqueueUrl, enqueueAllSeeds, queue, scheduler, schedulePeriodicSeeds, removePeriodicSeeds };
