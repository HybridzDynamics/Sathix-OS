const crypto = require('crypto');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class MessageProcessor {
  constructor({ provider, backend, idempotency, logger = console }) { Object.assign(this, { provider, backend, idempotency, logger }); }
  async withRetry(action, label) { let lastError; for (let attempt = 0; attempt < 3; attempt += 1) { try { return await action(); } catch (error) { lastError = error; if (attempt < 2) await delay(250 * (2 ** attempt)); } } this.logger.error(JSON.stringify({ event: 'WHATSAPP_RETRY_EXHAUSTED', label, error: lastError.message })); throw lastError; }
  async process(event, correlationId = crypto.randomUUID()) {
    if (!event.messageId || !this.idempotency.claim(event.messageId)) return { duplicate: true };
    if (event.kind === 'status') return this.backend.event({ eventType: event.eventType, messageId: event.messageId, metadata: event.metadata }, correlationId);
    if (event.type !== 'text') return this.withRetry(() => this.provider.sendMessage(event.sender.providerUserId, 'Sorry, I can currently help with text questions only.'), 'unsupported-message-response');
    await this.withRetry(() => this.provider.markAsRead(event.messageId), 'mark-read');
    const result = await this.withRetry(() => this.backend.message(event, correlationId), 'backend-message');
    const reply = String(result.reply || 'I could not process that request right now.').slice(0, 4000);
    return this.withRetry(() => this.provider.sendMessage(event.sender.providerUserId, reply), 'send-message');
  }
}
module.exports = { MessageProcessor };
