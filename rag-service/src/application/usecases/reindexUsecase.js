const repo = require('../../gateway/postgresDocumentRepository');
const queue = require('../../infrastructure/queue/inMemoryQueue');

module.exports = {
  async execute() {
    let count = 0;
    await repo.streamDocuments(async (doc) => {
      count += 1;
      const text = [doc.title, doc.summary, doc.content].filter(Boolean).join('\n\n');
      await queue.enqueue('embed', {
        id: doc.id,
        text,
        meta: {
          schemeId: doc.id,
          title: doc.title || null,
          source: doc.source || null,
          state: doc.meta?.state || null,
          category: doc.meta?.category || null,
          department: doc.meta?.department || null,
          language: doc.meta?.language || 'en',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          sourcePriority: doc.meta?.sourcePriority || undefined
        }
      });
    }, 200);
    return { ok: true, count };
  }
};
