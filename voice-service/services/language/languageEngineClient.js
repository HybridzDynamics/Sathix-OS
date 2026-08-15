const axios = require('axios');
const config = require('../../config');

class LanguageEngineClient {
  constructor(client = axios) { this.client = client; }
  headers(requestId) {
    return { 'Content-Type': 'application/json', ...(config.internalServiceToken ? { 'x-internal-token': config.internalServiceToken } : {}), ...(requestId ? { 'x-request-id': requestId } : {}) };
  }
  async detect(text, requestId) {
    const response = await this.client.post(`${config.languageEngineUrl}/api/v1/detect`, { text }, { headers: this.headers(requestId), timeout: config.requestTimeoutMs });
    return response.data;
  }
  async getLanguages(requestId) {
    const response = await this.client.get(`${config.languageEngineUrl}/api/v1/languages`, { headers: this.headers(requestId), timeout: config.requestTimeoutMs });
    return response.data;
  }
  async getLanguage(code, requestId) {
    const response = await this.client.get(`${config.languageEngineUrl}/api/v1/languages/${encodeURIComponent(code)}`, { headers: this.headers(requestId), timeout: config.requestTimeoutMs });
    return response.data;
  }
  async translate(payload, requestId) {
    const response = await this.client.post(`${config.languageEngineUrl}/api/v1/translate`, payload, { headers: this.headers(requestId), timeout: config.requestTimeoutMs });
    return response.data;
  }
}
module.exports = LanguageEngineClient;
