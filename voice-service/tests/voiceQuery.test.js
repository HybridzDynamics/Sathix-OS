const test = require('node:test');
const assert = require('node:assert/strict');
const ConversationService = require('../services/conversation/conversationService');

function makeService({ tts } = {}) {
  return new ConversationService({
    stt: { transcribe: async () => ({ text: 'What farmer schemes are available for me?', language: 'en', confidence: 0.9, durationMs: 1000 }) },
    languageEngine: { resolve: async () => ({ language: 'en', source: 'stt' }), translate: async () => ({ translation: 'translated answer' }) },
    backend: { query: async () => ({ answer: 'PM-KISAN is available for eligible farmers.', sources: [{ schemeId: 'pm-kisan' }] }) },
    tts: tts || { synthesize: async () => ({ buffer: Buffer.from('RIFF'), mimeType: 'audio/wav', modelId: 'voice-en' }) }
  });
}

test('runs STT, language resolution, Backend, and TTS in sequence', async () => {
  const result = await makeService().queryVoice({ audio: { metadata: { durationMs: 1000 } }, requestId: 'voice-1' });
  assert.equal(result.transcript, 'What farmer schemes are available for me?');
  assert.equal(result.answerLanguage, 'en');
  assert.equal(result.audio.mimeType, 'audio/wav');
  assert.deepEqual(result.sources, [{ schemeId: 'pm-kisan' }]);
});

test('returns a grounded text answer when TTS cannot support the language', async () => {
  const tts = { synthesize: async () => { const error = new Error('not supported'); error.code = 'LANGUAGE_NOT_SUPPORTED'; throw error; } };
  const result = await makeService({ tts }).queryVoice({ audio: { metadata: {} } });
  assert.equal(result.audio, null);
  assert.equal(result.answer, 'PM-KISAN is available for eligible farmers.');
  assert.equal(result.audioError.code, 'LANGUAGE_NOT_SUPPORTED');
});

test('skips TTS entirely for text-only low-bandwidth responses', async () => {
  const tts = { synthesize: async () => { throw new Error('TTS should not run'); } };
  const result = await makeService({ tts }).queryVoice({ audio: { metadata: {} }, includeAudio: false });
  assert.equal(result.audio, null);
  assert.equal(result.audioError, null);
});
