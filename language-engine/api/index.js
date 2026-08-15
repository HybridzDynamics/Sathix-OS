const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const healthRoute = require('./routes/health.route');
const translateRoute = require('./routes/translate.route');
const detectRoute = require('./routes/detect.route');
const transliterateRoute = require('./routes/transliterate.route');
const summarizeRoute = require('./routes/summarize.route');
const languageRoute = require('./routes/language.route');
const embeddingsRoute = require('./routes/embeddings.route');

const router = express.Router();

// Rate limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(limiter);

// Public / Health routes
router.use('/health', healthRoute);
router.use('/languages', languageRoute);

// Service authenticated routes
router.use('/translate', authMiddleware, translateRoute);
router.use('/detect', authMiddleware, detectRoute);
router.use('/transliterate', authMiddleware, transliterateRoute);
router.use('/summarize', authMiddleware, summarizeRoute);
router.use('/embeddings', authMiddleware, embeddingsRoute);

module.exports = router;
