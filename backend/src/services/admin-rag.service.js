const axios = require('axios');

function ragUrl(path) { return `${process.env.RAG_ENGINE_URL || 'http://localhost:3001'}${path}`; }
function headers(requestId) { return { 'Content-Type': 'application/json', ...(process.env.INTERNAL_SERVICE_TOKEN ? { 'x-internal-token': process.env.INTERNAL_SERVICE_TOKEN } : {}), ...(requestId ? { 'x-request-id': requestId } : {}) }; }

async function getStatus(prisma) {
  const [schemeCount, health] = await Promise.all([
    prisma.scheme.count(),
    axios.get(ragUrl('/rag/health'), { headers: headers(), timeout: 3000 }).then((response) => ({ available: true, status: response.data?.status || 'ok', qdrant: response.data?.qdrant || 'unknown' })).catch(() => ({ available: false, status: 'unavailable', qdrant: 'unknown' }))
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
    const response = await axios.post(ragUrl('/rag/reindex'), {}, { headers: headers(requestId), timeout: Number(process.env.RAG_REINDEX_TIMEOUT_MS || 120000) });
    const count = response.data?.result?.count ?? null;
    await prisma.auditLog.create({ data: { action: 'RAG_REINDEX_COMPLETED', entity: 'RagIndex', details: JSON.stringify({ actorId, requestId, count }) } });
    return { completed: true, count };
  } catch (cause) {
    const error = new Error('RAG re-indexing is currently unavailable or failed.'); error.code = 'RAG_UNAVAILABLE'; error.status = 503; throw error;
  }
}

module.exports = { getStatus, reindexAll };
