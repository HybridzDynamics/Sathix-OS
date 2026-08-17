const config = require('../../config');
const axios = require('axios');
function getHealth(req, res) {
  res.json({ status: 'ok', service: config.serviceName, requestId: req.id || null });
}

async function readiness(req, res) {
  const headers = config.internalServiceToken ? { 'x-internal-token': config.internalServiceToken } : {};
  const probes = {
    languageEngine: `${config.languageEngineUrl}/api/v1/health`,
    backend: `${config.backendUrl}/health`,
    sttInference: `${config.sttInferenceUrl}/health`,
    ttsInference: `${config.ttsInferenceUrl}/health`
  };
  const results = await Promise.all(Object.entries(probes).map(async ([name, url]) => {
    try { await axios.get(url, { headers, timeout: Math.min(config.requestTimeoutMs, 3000) }); return [name, 'available']; }
    catch { return [name, 'unavailable']; }
  }));
  const dependencies = Object.fromEntries(results);
  const ready = Object.values(dependencies).every((status) => status === 'available');
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'degraded', service: config.serviceName, dependencies, requestId: req.id || null });
}
module.exports = { getHealth, readiness };
