const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { processUrl } = require('./pipeline');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined
});

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new IORedis(redisUrl);
const queueName = 'sathix-crawl';

/**
 * Worker that processes 'crawl' jobs from BullMQ and runs the pipeline.
 * Usage: `node src/jobs/worker.js` to start a worker.
 */

const concurrency = Number(process.env.WORKER_CONCURRENCY || 2);
async function updateAdminJob(id, data) {
  if (!id) return;
  try {
    const fields = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(data)) {
      fields.push(`"${key}" = $${i++}`);
      values.push(value);
    }
    values.push(id);
    await pool.query(`UPDATE "ScraperJob" SET ${fields.join(', ')} WHERE id = $${i}`, values);
  } catch (error) {
    console.error('Unable to update scraper job status', error.message);
  }
}
const worker = new Worker(queueName, async job => {
  const { url, meta } = job.data;
  const adminJobId = meta?.adminJobId;
  await updateAdminJob(adminJobId, { status: 'RUNNING', startedAt: new Date(), error: null });
  console.log('Worker: processing', url, 'meta=', meta || {});
  const results = await processUrl(url, { name: meta && meta.source });
  const failedItems = results.filter((item) => item.status === 'error' || item.status === 'rejected').length;
  await updateAdminJob(adminJobId, { status: 'COMPLETED', completedAt: new Date(), pagesProcessed: 1, pagesFailed: 0, schemesDiscovered: results.length, failedItems });
  return { url, results };
}, { connection, concurrency });

worker.on('completed', job => console.log('Job completed', job.id));
worker.on('failed', async (job, err) => { await updateAdminJob(job.data?.meta?.adminJobId, { status: 'FAILED', completedAt: new Date(), error: err.message, pagesFailed: 1, failedItems: 1 }); console.error('Job failed', job.id, err); });

process.on('SIGINT', async () => {
  await worker.close();
  process.exit(0);
});
