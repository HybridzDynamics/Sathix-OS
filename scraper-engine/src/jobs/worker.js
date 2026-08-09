const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { processUrl } = require('./pipeline');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new IORedis(redisUrl);
const queueName = 'sathix-crawl';

/**
 * Worker that processes 'crawl' jobs from BullMQ and runs the pipeline.
 * Usage: `node src/jobs/worker.js` to start a worker.
 */

const concurrency = Number(process.env.WORKER_CONCURRENCY || 2);
const worker = new Worker(queueName, async job => {
  const { url, meta } = job.data;
  console.log('Worker: processing', url, 'meta=', meta || {});
  const results = await processUrl(url, { name: meta && meta.source });
  return { url, results };
}, { connection, concurrency });

worker.on('completed', job => console.log('Job completed', job.id));
worker.on('failed', (job, err) => console.error('Job failed', job.id, err));

process.on('SIGINT', async () => {
  await worker.close();
  process.exit(0);
});
