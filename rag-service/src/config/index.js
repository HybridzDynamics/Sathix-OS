module.exports = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  QDRANT_URL: process.env.QDRANT_URL,
  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  EMBEDDING_PROVIDER: process.env.EMBEDDING_PROVIDER || 'none',
  EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY,
  WORKER_CONCURRENCY: Number(process.env.WORKER_CONCURRENCY || 2)
};
