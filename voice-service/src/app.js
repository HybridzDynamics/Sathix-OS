const express = require('express');
const cors = require('cors');
const config = require('../config');
const apiRouter = require('../api');
const requestId = require('../middleware/requestId');
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.use(cors({
  origin(origin, callback) {
    // Voice processing is an internal API; service calls do not send Origin.
    if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS policy.'); error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Internal-Token', 'X-Request-ID'],
  credentials: false,
  maxAge: 600
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestId);
app.get('/health', require('../api/controllers/health.controller').getHealth);
app.get('/ready', require('../api/controllers/health.controller').readiness);
app.use('/api/v1', apiRouter);
app.use(errorHandler);

module.exports = app;
