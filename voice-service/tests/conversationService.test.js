const test = require('node:test');
const assert = require('node:assert/strict');
const ConversationService = require('../services/conversation/conversationService');

test('sends a language-resolved transcript to Backend and preserves sources', async () => {
  let request;
  const service = new ConversationService({ backend: { query: async (input) => { request = input; return { answer: 'PM-KISAN is available.', sources: [{ schemeId: 'pm-kisan' }] }; } } });
  const result = await service.queryBackend({ transcript: 'मुझे किसान योजना चाहिए', language: 'hi', requestId: 'voice-1' });
  assert.equal(request.query, 'मुझे किसान योजना चाहिए');
  assert.equal(request.language, 'hi');
  assert.deepEqual(result.sources, [{ schemeId: 'pm-kisan' }]);
});

test('does not fabricate an answer when Backend returns an invalid result', async () => {
  const service = new ConversationService({ backend: { query: async () => ({ sources: [] }) } });
  await assert.rejects(() => service.queryBackend({ transcript: 'schemes', language: 'en' }), { code: 'BACKEND_RESPONSE_INVALID' });
});
