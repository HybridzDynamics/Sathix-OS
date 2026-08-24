const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const schemeRoutes = require('./routes/scheme.routes');
const assistantRoutes = require('./routes/assistant.routes');
const applicationRoutes = require('./routes/application.routes');
const scraperRoutes = require('./routes/scraper.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');
const integrationRoutes = require('./routes/integration.routes');
const internalRoutes = require('./routes/internal.routes');
const { getSystemStatus } = require('./controllers/system');
const { getHealth } = require('./controllers/health.controller');
const { requestId } = require('./middleware/request-id');
const { createRateLimiter } = require('./middleware/rate-limit');
const { securityHeaders } = require('./middleware/security-headers');

const app = express();

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || [
  'https://sathix-os-admin.vercel.app',
  'https://sathix-os-1.onrender.com/',
  'https://sathix-os-user.vercel.app',
  'https://sathix-os-languageengine.onrender.com'

].join(','))
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(securityHeaders);
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
app.use('/api/internal', internalRoutes);
app.use('/api', integrationRoutes);
app.use('/api', healthRoutes);
app.get('/api/system/status', getSystemStatus);

// Health check
app.get('/health', getHealth);

app.use(errorHandler);

module.exports = app;
