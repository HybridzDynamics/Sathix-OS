const rag = require('../integrations/rag.client');

const MAX_MESSAGE_LENGTH = 4000;

function invalid(message, code = 'INVALID_WHATSAPP_MESSAGE') {
  const error = new Error(message);
  error.code = code;
  error.status = 422;
  throw error;
}

function validateWhatsAppMessage(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) invalid('Message payload must be an object.');
  if (body.provider !== 'whatsapp') invalid('provider must be whatsapp.');
  if (typeof body.messageId !== 'string' || !body.messageId || body.messageId.length > 256) invalid('messageId is required.');
  if (!body.sender || typeof body.sender !== 'object' || typeof body.sender.providerUserId !== 'string' || !body.sender.providerUserId) invalid('sender.providerUserId is required.');
  if (body.type !== 'text') invalid('Only text WhatsApp messages are currently supported.', 'UNSUPPORTED_WHATSAPP_MESSAGE');
  if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > MAX_MESSAGE_LENGTH) invalid(`text must be a non-empty string no longer than ${MAX_MESSAGE_LENGTH} characters.`);
  if (body.language !== undefined && (typeof body.language !== 'string' || !/^[A-Za-z-]{2,20}$/.test(body.language))) invalid('language must be a valid language code.');
}

async function voiceQuery(req, res, next) {
  try {
    const { query, language = 'en', filters = {}, topK = 5 } = req.body || {};
    if (typeof query !== 'string' || !query.trim() || query.length > 4000) {
      const error = new Error('query must be a non-empty string no longer than 4000 characters.');
      error.code = 'INVALID_QUERY'; error.status = 422; throw error;
    }
    if (typeof language !== 'string' || language.length > 20 || !/^[A-Za-z-]+$/.test(language)) {
      const error = new Error('language must be a valid language code.'); error.code = 'INVALID_LANGUAGE'; error.status = 422; throw error;
    }
    if (!filters || Array.isArray(filters) || typeof filters !== 'object') {
      const error = new Error('filters must be an object.'); error.code = 'INVALID_FILTERS'; error.status = 422; throw error;
    }
    const data = await rag.query({ query: query.trim(), language, filters, topK: Math.min(20, Math.max(1, Number(topK) || 5)), requestId: req.id });
    res.json({ answer: data.answer || '', sources: data.sources || [], documents: data.documents || [] });
  } catch (error) { next(error); }
}

async function whatsappMessage(req, res, next) {
  try {
    validateWhatsAppMessage(req.body);
    const message = req.body.text.trim();
    const command = message.toLowerCase();
    if (['help', 'start', 'status'].includes(command)) {
      return res.json({ reply: command === 'status' ? 'SathiX is available. Send a question about government schemes to get started.' : 'Welcome to SathiX. Send a question about Indian government schemes and I will help you find relevant information.', sources: [] });
    }
    if (['stop', 'language'].includes(command)) {
      return res.json({ reply: command === 'stop' ? 'You can return anytime by sending a new question.' : 'Reply in your preferred supported language; SathiX will use it where available.', sources: [] });
    }
    const data = await rag.query({ query: message, language: req.body.language || 'en', filters: {}, topK: 5, requestId: req.id });
    res.json({ reply: data.answer || 'I could not find relevant scheme information at this time.', sources: data.sources || [] });
  } catch (error) { next(error); }
}

async function whatsappEvent(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) || typeof req.body.eventType !== 'string') invalid('eventType is required.');
    // Events are acknowledged here for operational observability. They deliberately do not mutate user state.
    console.info(JSON.stringify({ event: 'WHATSAPP_PROVIDER_EVENT', requestId: req.id, eventType: req.body.eventType, messageId: req.body.messageId || null }));
    res.status(202).json({ accepted: true });
  } catch (error) { next(error); }
}

module.exports = { voiceQuery, whatsappMessage, whatsappEvent, validateWhatsAppMessage };
