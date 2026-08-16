const rag = require('../integrations/rag.client');

async function getStatus(prisma) {
  const [schemeCount, health] = await Promise.all([
    prisma.scheme.count(),
    rag.health().then((data) => ({ available: true, status: data?.status || 'ok', qdrant: data?.qdrant || 'unknown' })).catch(() => ({ available: false, status: 'unavailable', qdrant: 'unknown' }))
  ]);
  return {
    service: health,
    totalSchemes: schemeCount,
    indexedDocuments: { value: null, tracked: false, reason: 'RAG does not currently expose a document-count metric.' },
    indexedChunks: { value: null, tracked: false, reason: 'RAG does not currently expose a chunk-count metric.' },
    embeddingModel: { value: null, tracked: false, reason: 'RAG does not expose active embedding-model metadata.' },
    embeddingDimensions: { value: null, tracked: false, reason: 'RAG does not expose embedding dimensions.' },
    lastIndexRun: { value: null, tracked: false, reason: 'RAG indexing runs are not persisted as backend jobs yet.' }
  };
}

async function reindexAll(prisma, { actorId, requestId }) {
  try {
    const response = await rag.reindex(requestId);
    const count = response?.result?.count ?? null;
    await prisma.auditLog.create({ data: { action: 'RAG_REINDEX_COMPLETED', entity: 'RagIndex', details: JSON.stringify({ actorId, requestId, count }) } });
    return { completed: true, count };
  } catch (cause) {
    const error = new Error('RAG re-indexing is currently unavailable or failed.'); error.code = 'RAG_UNAVAILABLE'; error.status = 503; throw error;
  }
}

module.exports = { getStatus, reindexAll };
