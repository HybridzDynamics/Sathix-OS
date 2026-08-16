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
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');
const { getHealth } = require('./controllers/health.controller');
const { requestId } = require('./middleware/request-id');
const { createRateLimiter } = require('./middleware/rate-limit');

const app = express();

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(requestId);
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include service probes and same-origin tools.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS policy.');
    error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  credentials: false,
  maxAge: 600
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', createRateLimiter({
  windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.API_RATE_LIMIT_MAX || 300)
}));
app.use('/api/auth', createRateLimiter({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
  key: (req) => `${req.ip}:${req.body?.mobile || 'unknown'}`
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', healthRoutes);

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
app.get('/health', getHealth);

app.use(errorHandler);

module.exports = app;
