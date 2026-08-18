const crypto = require('crypto');
const axios = require('axios');
const { WhatsAppProvider } = require('./whatsapp-provider');

class MetaCloudProvider extends WhatsAppProvider {
  constructor(config, http = axios) { super(); this.config = config; this.http = http; }
  apiUrl() { return `https://graph.facebook.com/${this.config.graphApiVersion}/${this.config.phoneNumberId}/messages`; }
  verifyWebhook(rawBody, signature) {
    if (!signature || !this.config.appSecret) return false;
    const expected = `sha256=${crypto.createHmac('sha256', this.config.appSecret).update(rawBody).digest('hex')}`;
    const supplied = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    return supplied.length === expectedBuffer.length && crypto.timingSafeEqual(supplied, expectedBuffer);
  }
  async request(data) {
    return this.http.post(this.apiUrl(), data, { timeout: 15000, headers: { Authorization: `Bearer ${this.config.accessToken}`, 'Content-Type': 'application/json' } });
  }
  async sendMessage(to, body) { return this.request({ messaging_product: 'whatsapp', to, type: 'text', text: { preview_url: false, body } }); }
  async sendMedia(to, media) { return this.request({ messaging_product: 'whatsapp', to, type: media.type, [media.type]: media.payload }); }
  async sendTemplate(to, template) { return this.request({ messaging_product: 'whatsapp', to, type: 'template', template }); }
  async markAsRead(messageId) { return this.request({ messaging_product: 'whatsapp', status: 'read', message_id: messageId }); }
  normalizeWebhook(payload) {
    const changes = payload?.entry?.flatMap((entry) => entry.changes || []) || [];
    const events = [];
    for (const change of changes) {
      const value = change.value || {};
      for (const status of value.statuses || []) events.push({ kind: 'status', eventType: status.status || 'unknown', messageId: status.id, metadata: { recipientId: status.recipient_id } });
      for (const message of value.messages || []) {
        const contact = (value.contacts || []).find((item) => item.wa_id === message.from);
        const type = message.type;
        events.push({ kind: 'message', provider: 'whatsapp', messageId: message.id, sender: { providerUserId: message.from, phone: message.from, displayName: contact?.profile?.name }, type, text: type === 'text' ? message.text?.body : undefined, timestamp: message.timestamp, metadata: { context: message.context, media: type !== 'text' ? message[type] : undefined } });
      }
    }
    return events;
  }
}
module.exports = { MetaCloudProvider };
