const axios = require('axios');
class BackendClient {
  constructor(config, http = axios) { this.config = config; this.http = http; }
  headers(correlationId) { return { 'x-internal-token': this.config.internalToken, 'x-request-id': correlationId }; }
  async message(message, correlationId) { return (await this.http.post(`${this.config.backendUrl}/api/internal/whatsapp/messages`, message, { timeout: this.config.backendTimeoutMs, headers: this.headers(correlationId) })).data; }
  async event(event, correlationId) { return (await this.http.post(`${this.config.backendUrl}/api/internal/whatsapp/events`, event, { timeout: this.config.backendTimeoutMs, headers: this.headers(correlationId) })).data; }
}
module.exports = { BackendClient };
