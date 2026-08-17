const axios = require('axios');
const config = require('../../config');

class BackendClient {
  constructor(client = axios) { this.client = client; }
  async query({ query, language, filters, topK }, requestId) {
    const headers = { 'Content-Type': 'application/json', ...(config.internalServiceToken ? { 'x-internal-token': config.internalServiceToken } : {}), ...(requestId ? { 'x-request-id': requestId } : {}) };
    try {
      const response = await this.client.post(`${config.backendUrl}/api/internal/voice/query`, { query, language, filters, topK }, { headers, timeout: config.requestTimeoutMs });
      return response.data;
    } catch (cause) {
      const upstreamMessage = cause.response?.data?.error || cause.response?.data?.message || '';
      const ragUnavailable = /rag.*unavailable/i.test(upstreamMessage);
      const error = new Error(upstreamMessage || (ragUnavailable ? 'RAG service is unavailable.' : 'Backend is unavailable.'));
      error.code = ragUnavailable ? 'RAG_UNAVAILABLE' : 'BACKEND_UNAVAILABLE';
      error.status = 503;
      throw error;
    }
  }
}
module.exports = BackendClient;
