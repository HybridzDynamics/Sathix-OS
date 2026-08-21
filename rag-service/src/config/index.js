module.exports = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  QDRANT_URL: process.env.QDRANT_URL,
  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  VECTOR_STORE: process.env.VECTOR_STORE || 'memory',
  EMBEDDING_PROVIDER: process.env.EMBEDDING_PROVIDER || 'none',
  EMBEDDING_DIM: Number(process.env.EMBEDDING_DIM || 384),
  EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY,
  ANSWER_GENERATOR: process.env.ANSWER_GENERATOR || 'noop',
  WORKER_CONCURRENCY: Number(process.env.WORKER_CONCURRENCY || 2)
};
