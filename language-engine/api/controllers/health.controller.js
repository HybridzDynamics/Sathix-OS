const axios = require('axios');
const config = require('../../config');

async function getHealth(req, res) {
  const health = {
    status: 'ok',
    service: 'sathix-language-engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    components: {
      api: 'healthy',
      pythonMlService: 'unknown'
    }
  };

  try {
    const pyHealth = await axios.get(`${config.pythonServiceUrl}/health`, { timeout: 2000 });
    health.components.pythonMlService = pyHealth.data?.status || 'ok';
  } catch {
    health.components.pythonMlService = 'unreachable';
  }

  const statusCode = health.status === 'ok' ? 200 : 207;
  return res.status(statusCode).json(health);
}

module.exports = { getHealth };
