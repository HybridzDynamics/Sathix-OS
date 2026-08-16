const axios = require('axios');

function serviceError(service, cause) {
  const error = new Error(`${service} is temporarily unavailable.`);
  error.code = `${service.toUpperCase().replace(/\s+/g, '_')}_UNAVAILABLE`;
  error.status = 503;
  error.cause = cause;
  return error;
}

function createServiceClient({ baseUrl, token, timeoutMs, service }) {
  const client = axios.create({ baseURL: baseUrl, timeout: timeoutMs });
  client.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...(token ? { 'x-internal-token': token } : {}) };
    return config;
  });

  async function request(config) {
    try {
      return await client.request(config);
    } catch (cause) {
      if (cause.response?.status >= 400 && cause.response?.status < 500) throw cause;
      throw serviceError(service, cause);
    }
  }
  return { request };
}

module.exports = { createServiceClient, serviceError };
