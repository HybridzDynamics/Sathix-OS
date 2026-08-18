const express = require('express');
const { requestId } = require('./middleware/request-id');
const { createRateLimiter } = require('./middleware/rate-limit');

function createApp({ config, provider, processor }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(requestId);
  app.use(express.json({ limit: '1mb', verify: (req, res, buffer) => { req.rawBody = buffer; } }));
  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'whatsapp-service', provider: config.provider }));
  app.get('/ready', (req, res) => res.json({ status: 'ready', backendConfigured: Boolean(config.backendUrl && config.internalToken), providerConfigured: Boolean(config.phoneNumberId && config.accessToken) }));
  app.get('/webhooks/whatsapp', (req, res) => {
    if (req.query['hub.mode'] !== 'subscribe' || req.query['hub.verify_token'] !== config.verifyToken) return res.sendStatus(403);
    return res.status(200).send(req.query['hub.challenge']);
  });
  app.post('/webhooks/whatsapp', createRateLimiter({ windowMs: config.rateLimitWindowMs, max: config.rateLimitMax }), (req, res) => {
    if (!provider.verifyWebhook(req.rawBody, req.get('x-hub-signature-256'))) return res.status(401).json({ error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature.' }, requestId: req.id });
    let events;
    try { events = provider.normalizeWebhook(req.body); } catch (error) { return res.status(400).json({ error: { code: 'INVALID_PAYLOAD', message: 'Invalid webhook payload.' }, requestId: req.id }); }
    res.sendStatus(200);
    for (const event of events) processor.process(event, req.id).catch((error) => console.error(JSON.stringify({ event: 'WHATSAPP_PROCESSING_FAILED', requestId: req.id, messageId: event.messageId, error: error.message })));
  });
  app.use((error, req, res, next) => { console.error(JSON.stringify({ event: 'WHATSAPP_REQUEST_FAILED', requestId: req.id, error: error.message })); res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' }, requestId: req.id }); });
  return app;
}
module.exports = { createApp };
