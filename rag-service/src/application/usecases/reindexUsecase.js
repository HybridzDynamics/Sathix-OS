const repo = require('../../gateway/postgresDocumentRepository');
const queue = require('../../infrastructure/queue/inMemoryQueue');

module.exports = {
  async execute() {
    let count = 0;
    await repo.streamDocuments(async (doc) => {
      count += 1;
      const text = doc.summary || doc.content || '';
      await queue.enqueue('embed', {
        id: doc.id,
        text,
        meta: {
          source: doc.source || 'unknown',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          sourcePriority: doc.meta?.sourcePriority || undefined
        }
      });
    }, 200);
    return { ok: true, count };
  }
};
