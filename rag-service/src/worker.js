const queue = require('./infrastructure/queue/inMemoryQueue');
const { embedDocument } = require('./application/services/embeddingService');
const autoEmbedUsecase = require('./application/usecases/autoEmbedUsecase');
const logger = require('./infrastructure/logging/logger');

async function runWorker() {
  logger.info('embed worker starting');
  queue.on('job', async (job) => {
    if (job.type !== 'embed') return;
    try {
      logger.info('processing embed job', { jobId: job.id });
      await embedDocument(job.payload);
      logger.info('embed job completed', { jobId: job.id });
    } catch (err) {
      logger.error('embed job failed', { jobId: job.id, error: err.message });
    }
  });

  await autoEmbedUsecase.startPolling();
}

runWorker().catch((err) => {
  logger.error('worker failed to start', { error: err.message });
  process.exit(1);
});
