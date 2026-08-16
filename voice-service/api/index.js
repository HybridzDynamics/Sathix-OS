const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const speechRoute = require('./routes/speech.route');
const synthesisRoute = require('./routes/synthesis.route');
const conversationRoute = require('./routes/conversation.route');
const healthRoute = require('./routes/health.route');
const registryRoute = require('./routes/registry.route');
const serviceAuth = require('../middleware/serviceAuth');

const router = express.Router();
router.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max, standardHeaders: true, legacyHeaders: false }));
router.use('/speech-to-text', serviceAuth, speechRoute);
router.use('/text-to-speech', serviceAuth, synthesisRoute);
router.use('/voice', serviceAuth, conversationRoute);
router.use('/health', healthRoute);
router.use('/', serviceAuth, registryRoute);
module.exports = router;
