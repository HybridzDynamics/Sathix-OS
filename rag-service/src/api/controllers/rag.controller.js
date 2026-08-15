const reindexUsecase = require('../../application/usecases/reindexUsecase');
const queryUsecase = require('../../application/usecases/queryUsecase');
const vectorFactory = require('../../infrastructure/vector');
const { embedDocument } = require('../../application/services/embeddingService');
const logger = require('../../infrastructure/logging/logger');

// Create default vector store for this process (in-memory unless configured)
const vectorStore = vectorFactory.getVectorStore();

exports.query = async (req, res) => {
  const requestId = req.headers['x-request-id'] || `rag-${Date.now()}`;
  logger.info('RAG_QUERY_STARTED', { requestId, query: req.body?.query });
  try {
    const result = await queryUsecase.execute(req.body);
    logger.info('RAG_QUERY_COMPLETED', { requestId });
    res.json({ status: 'ok', data: result });
  } catch (err) {
    logger.error('RAG_QUERY_FAILED', { requestId, error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.reindex = async (req, res) => {
  const requestId = req.headers['x-request-id'] || `reindex-${Date.now()}`;
  logger.info('RAG_INDEX_STARTED', { requestId });
  try {
    const result = await reindexUsecase.execute();
    // ensure vector collection exists for 'schemes'
    try {
      await vectorStore.ensureCollection('schemes', { size: Number(process.env.EMBEDDING_DIM || 384) });
    } catch (err) {
      logger.warn('vector ensureCollection failed', { error: err.message });
    }
    logger.info('RAG_INDEX_COMPLETED', { requestId, count: result.count });
    res.json({ status: 'reindex completed', result });
  } catch (err) {
    logger.error('RAG_INDEX_FAILED', { requestId, error: err.message });
    res.status(500).json({ error: err.message });
  }
};

exports.ingest = async (req, res) => {
  const requestId = req.headers['x-request-id'] || `ingest-${Date.now()}`;
  const { id, text, meta } = req.body || {};
  if (!id || !text) {
    return res.status(400).json({ error: 'id and text are required' });
  }
  logger.info('RAG_INDEX_STARTED', { requestId, schemeId: id });
  try {
    const result = await embedDocument({ id, text, meta: meta || {} });
    logger.info('RAG_INDEX_COMPLETED', { requestId, schemeId: id });
    res.json({ status: 'ok', id: result.id });
  } catch (err) {
    logger.error('RAG_INDEX_FAILED', { requestId, schemeId: id, error: err.message });
    res.status(500).json({ error: err.message });
  }
};

exports.health = async (req, res) => {
  const health = { status: 'ok', service: 'rag-service', qdrant: 'unknown', db: 'unknown' };
  try {
    await vectorStore.ensureCollection('schemes', { size: Number(process.env.EMBEDDING_DIM || 384) });
    health.qdrant = 'ok';
  } catch {
    health.qdrant = 'error';
    health.status = 'degraded';
  }
  res.status(health.status === 'ok' ? 200 : 207).json(health);
};
