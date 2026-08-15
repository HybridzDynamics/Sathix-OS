const express = require('express');
const cors = require('cors');
const requestIdMiddleware = require('../middleware/requestId');
const errorHandler = require('../middleware/errorHandler');
const apiV1Router = require('../api');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);

// Base health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'sathix-language-engine' }));

// Versioned APIs
app.use('/api/v1', apiV1Router);

app.use(errorHandler);

module.exports = app;
