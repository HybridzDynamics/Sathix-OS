const reindexUsecase = require('../../application/usecases/reindexUsecase');
const queryUsecase = require('../../application/usecases/queryUsecase');
const vectorFactory = require('../../infrastructure/vector');
const logger = require('../../infrastructure/logging/logger');

// Create default vector store for this process (in-memory unless configured)
const vectorStore = vectorFactory.getVectorStore();

exports.query = async (req, res) => {
  try {
    const result = await queryUsecase.execute(req.body);
    res.json({ status: 'ok', data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.reindex = async (req, res) => {
  try {
    const result = await reindexUsecase.execute();
    // ensure vector collection exists for 'schemes'
    try {
      await vectorStore.ensureCollection('schemes', { size: Number(process.env.EMBEDDING_DIM || 384) });
    } catch (err) {
      logger.warn('vector ensureCollection failed', { error: err.message });
    }
    res.json({ status: 'reindex completed', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
