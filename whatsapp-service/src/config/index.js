function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured.`);
  return value;
}

function loadConfig() {
  const config = {
    port: Number(process.env.PORT || 4003),
    provider: process.env.WHATSAPP_PROVIDER || 'meta-cloud',
    graphApiVersion: process.env.WHATSAPP_GRAPH_API_VERSION || 'v23.0',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    appSecret: process.env.WHATSAPP_APP_SECRET,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
    internalToken: process.env.INTERNAL_SERVICE_TOKEN,
    backendTimeoutMs: Number(process.env.BACKEND_TIMEOUT_MS || 20000),
    rateLimitWindowMs: Number(process.env.WEBHOOK_RATE_LIMIT_WINDOW_MS || 60000),
    rateLimitMax: Number(process.env.WEBHOOK_RATE_LIMIT_MAX || 120),
    idempotencyTtlMs: Number(process.env.IDEMPOTENCY_TTL_MS || 86400000)
  };
  if (config.provider !== 'meta-cloud') throw new Error('Only the supported meta-cloud provider may be configured.');
  return config;
}

function validateRuntimeConfig(config) {
  if (process.env.WHATSAPP_DEV_MODE === 'true') {
    return config;
  }
  ['accessToken', 'appSecret', 'verifyToken', 'phoneNumberId', 'internalToken'].forEach((key) => required({ accessToken: 'WHATSAPP_ACCESS_TOKEN', appSecret: 'WHATSAPP_APP_SECRET', verifyToken: 'WHATSAPP_VERIFY_TOKEN', phoneNumberId: 'WHATSAPP_PHONE_NUMBER_ID', internalToken: 'INTERNAL_SERVICE_TOKEN' }[key]));
  return config;
}
module.exports = { loadConfig, validateRuntimeConfig };
