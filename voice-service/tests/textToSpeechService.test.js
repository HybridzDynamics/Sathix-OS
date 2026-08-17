const test = require('node:test');
const assert = require('node:assert/strict');
const TextToSpeechService = require('../services/tts/textToSpeechService');
const PythonHttpTtsProvider = require('../services/tts/pythonHttpTtsProvider');

test('uses a language-registry-approved matching TTS model', async () => {
  let selected;
  const service = new TextToSpeechService({
    languageEngine: { getLanguage: async () => ({ language: { code: 'en' } }) },
    modelRegistry: { getTts: (id, language) => language === 'en' ? { id: 'voice-en' } : null },
    provider: { synthesize: async (input, options) => { selected = options.model.id; return { buffer: Buffer.from('RIFF'), mimeType: 'audio/wav' }; } }
  });
  const audio = await service.synthesize({ text: 'Hello', language: 'en' });
  assert.equal(selected, 'voice-en');
  assert.equal(audio.mimeType, 'audio/wav');
});

test('does not substitute a voice for an unsupported language', async () => {
  const service = new TextToSpeechService({ languageEngine: { getLanguage: async () => ({ language: { code: 'hi' } }) }, modelRegistry: { getTts: () => null }, provider: {} });
  await assert.rejects(() => service.synthesize({ text: 'नमस्ते', language: 'hi' }), { code: 'LANGUAGE_NOT_SUPPORTED' });
});

test('HTTP TTS provider rejects a non-audio upstream response', async () => {
  const provider = new PythonHttpTtsProvider({ post: async () => ({ data: Buffer.from('not audio'), headers: { 'content-type': 'application/json' } }) });
  await assert.rejects(() => provider.synthesize({ text: 'Hello', language: 'en' }, { model: { id: 'voice-en' } }), { code: 'TTS_FAILURE' });
});
