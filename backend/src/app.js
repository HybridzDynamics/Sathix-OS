const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const schemeRoutes = require('./routes/scheme.routes');
const assistantRoutes = require('./routes/assistant.routes');
const applicationRoutes = require('./routes/application.routes');
const scraperRoutes = require('./routes/scraper.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/scraper', scraperRoutes);

// Stateless RAG query proxy — for clients that call without a user session
app.post('/api/v1/ai/query', async (req, res, next) => {
  try {
    const { query, language, filters, topK } = req.body || {};
    if (!query) return res.status(400).json({ error: 'query is required' });

    const RAG_URL = process.env.RAG_ENGINE_URL || 'http://localhost:3001';
    const token = process.env.INTERNAL_SERVICE_TOKEN || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['x-internal-token'] = token;

    const ragResp = await axios.post(
      `${RAG_URL}/rag/query`,
      { query, language: language || 'en', filters: filters || {}, topK: topK || 5 },
      { timeout: Number(process.env.RAG_TIMEOUT_MS || 15000), headers }
    );
    const data = ragResp.data?.data || ragResp.data;
    return res.json({ answer: data.answer, sources: data.sources || [] });
  } catch (err) {
    // Distinguish RAG unavailable from other errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({ error: 'RAG engine is currently unavailable' });
    }
    next(err);
  }
});

// Health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    services: { database: 'unknown', rag: 'unknown' }
  };

  // Check DB
  try {
    const prisma = req.app.locals.prisma;
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = 'ok';
    }
  } catch {
    health.services.database = 'error';
    health.status = 'degraded';
  }

  // Check RAG engine
  try {
    const RAG_URL = process.env.RAG_ENGINE_URL || 'http://localhost:3001';
    await axios.get(`${RAG_URL}/rag/health`, { timeout: 3000 });
    health.services.rag = 'ok';
  } catch {
    health.services.rag = 'error';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 207).json(health);
});

app.use(errorHandler);

module.exports = app;
