const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const speechRoute = require('./routes/speech.route');
const synthesisRoute = require('./routes/synthesis.route');
const conversationRoute = require('./routes/conversation.route');
const healthRoute = require('./routes/health.route');
const registryRoute = require('./routes/registry.route');

const router = express.Router();
router.use(rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max, standardHeaders: true, legacyHeaders: false }));
router.use('/speech-to-text', speechRoute);
router.use('/text-to-speech', synthesisRoute);
router.use('/voice', conversationRoute);
router.use('/health', healthRoute);
router.use('/', registryRoute);
module.exports = router;
