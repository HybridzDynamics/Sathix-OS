const axios = require('axios');
const config = require('../../config');

class BackendClient {
  constructor(client = axios) { this.client = client; }
  async query({ query, language, filters, topK }, requestId) {
    const headers = { 'Content-Type': 'application/json', ...(config.internalServiceToken ? { 'x-internal-token': config.internalServiceToken } : {}), ...(requestId ? { 'x-request-id': requestId } : {}) };
    const response = await this.client.post(`${config.backendUrl}/api/v1/ai/query`, { query, language, filters, topK }, { headers, timeout: config.requestTimeoutMs });
    return response.data;
  }
}
module.exports = BackendClient;
