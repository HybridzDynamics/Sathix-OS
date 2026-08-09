const repo = require('../../gateway/postgresDocumentRepository');
const queue = require('../../infrastructure/queue/inMemoryQueue');

let lastCheckedAt = new Date(0);

function normalizeDocument(doc) {
  return {
    id: doc.id,
    text: doc.summary || doc.content || '',
    meta: {
      source: doc.source || 'unknown',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      sourcePriority: doc.meta?.sourcePriority || undefined,
      language: doc.meta?.language || undefined
    }
  };
}

async function enqueueNewDocuments(documents) {
  for (const doc of documents) {
    const normalized = normalizeDocument(doc);
    await queue.enqueue('embed', normalized);
  }
}

async function execute({ since, limit = 100 } = {}) {
  const threshold = since || lastCheckedAt.toISOString();
  const docs = await repo.listDocumentsSince(threshold, limit);
  if (!Array.isArray(docs) || docs.length === 0) {
    return { count: 0, since: threshold };
  }

  await enqueueNewDocuments(docs);
  const latest = docs.reduce((latestDate, doc) => {
    const updated = doc.updatedAt || doc.createdAt;
    const date = updated ? new Date(updated) : null;
    if (date && date > latestDate) return date;
    return latestDate;
  }, new Date(lastCheckedAt));

  if (latest > lastCheckedAt) {
    lastCheckedAt = latest;
  }

  return { count: docs.length, since: lastCheckedAt.toISOString() };
}

async function startPolling(intervalMs = Number(process.env.EMBEDDING_POLL_INTERVAL_MS || 15000)) {
  await execute();
  setInterval(() => {
    execute().catch((err) => {
      logger.error('Auto-embed polling error', { error: err.message });
    });
  }, intervalMs);
}

module.exports = { execute, startPolling };
