require('dotenv').config();
const { loadConfig, validateRuntimeConfig } = require('./config');
const { MetaCloudProvider } = require('./providers/meta-cloud.provider');
const { BackendClient } = require('./services/backend-client');
const { IdempotencyStore } = require('./services/idempotency-store');
const { MessageProcessor } = require('./services/message-processor');
const { createApp } = require('./app');

const config = validateRuntimeConfig(loadConfig());
const provider = new MetaCloudProvider(config);
const processor = new MessageProcessor({ provider, backend: new BackendClient(config), idempotency: new IdempotencyStore(config.idempotencyTtlMs) });
const app = createApp({ config, provider, processor });
const server = app.listen(config.port, () => console.log(`WhatsApp service listening on ${config.port}`));
function shutdown() { server.close(() => process.exit(0)); }
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
