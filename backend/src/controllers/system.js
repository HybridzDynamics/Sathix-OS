const axios = require('axios');
const db = require('../db');

/**
 * Global Status Endpoint
 * Checks the health of all dependent microservices in the SathiX-OS architecture.
 */
async function getSystemStatus(req, res) {
  const services = {
    backend: 'Healthy',
    database: 'Unknown',
    rag_engine: 'Unknown',
    language_engine: 'Unknown',
    voice_service: 'Unknown',
    whatsapp_service: 'Unknown'
  };

  // 1. Check Database
  try {
    await db.ping();
    services.database = 'Healthy';
  } catch (err) {
    services.database = 'Down';
  }

  // Helper to ping external services
  const pingService = async (url) => {
    if (!url) return 'Unconfigured';
    try {
      await axios.get(`${url}/health`, { timeout: 2000 });
      return 'Healthy';
    } catch (err) {
      return 'Down';
    }
  };

  // 2. Check Microservices
  services.rag_engine = await pingService(process.env.RAG_ENGINE_URL);
  services.language_engine = await pingService(process.env.LANGUAGE_ENGINE_URL);
  services.voice_service = await pingService(process.env.VOICE_SERVICE_URL);
  services.whatsapp_service = await pingService(process.env.WHATSAPP_SERVICE_URL);

  res.json({
    timestamp: new Date().toISOString(),
    status: Object.values(services).every(s => s === 'Healthy' || s === 'Unconfigured') ? 'Operational' : 'Degraded',
    services
  });
}

module.exports = {
  getSystemStatus
};
