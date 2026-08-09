const express = require('express');
const cors = require('cors');
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

app.use(errorHandler);

module.exports = app;
