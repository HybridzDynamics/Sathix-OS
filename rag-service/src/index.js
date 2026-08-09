require('dotenv').config();
const express = require('express');
const config = require('./config');
const ragRoutes = require('./api/routes/rag.routes');

const app = express();
app.use(express.json());

app.use('/rag', ragRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const logger = require('./infrastructure/logging/logger');
const port = config.PORT || 3001;
app.listen(port, () => logger.info('RAG service listening', { port }));

module.exports = app;
