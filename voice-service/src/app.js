const express = require('express');
const cors = require('cors');
const apiRouter = require('../api');
const requestId = require('../middleware/requestId');
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestId);
app.get('/health', require('../api/controllers/health.controller').getHealth);
app.use('/api/v1', apiRouter);
app.use(errorHandler);

module.exports = app;
