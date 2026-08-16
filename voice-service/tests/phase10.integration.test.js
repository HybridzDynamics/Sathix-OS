const test = require('node:test');
const assert = require('node:assert/strict');
const ConversationService = require('../services/conversation/conversationService');
const SpeechToTextService = require('../services/stt/speechToTextService');
const LanguageResolutionService = require('../services/language/languageResolutionService');
const { inspectAudio } = require('../services/audio/audioInspector');

function pcmWav(seconds) {
  const sampleRate = 16000;
  const dataSize = sampleRate * seconds * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + dataSize, 4); buffer.write('WAVE', 8);
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

function error(code) { const value = new Error(code); value.code = code; value.status = 503; return value; }

function farmerFlow({ sttLanguage = 'en', ttsError = null, backendError = null } = {}) {
  return new ConversationService({
    stt: { transcribe: async () => ({ text: 'What farmer schemes are available for me?', language: sttLanguage, confidence: 0.96, durationMs: 1100 }) },
    languageEngine: { resolve: async ({ sttLanguage: language }) => ({ language: language || 'en', source: language ? 'stt' : 'language-engine' }), translate: async () => ({ translation: 'translated answer' }) },
    backend: { query: async () => { if (backendError) throw backendError; return { answer: 'PM-KISAN provides eligible farmer families ₹6,000 per year.', sources: [{ schemeId: 'pm-kisan', title: 'PM-KISAN', sourceUrl: 'https://pmkisan.gov.in' }] }; } },
    tts: { synthesize: async () => { if (ttsError) throw ttsError; return { buffer: Buffer.from('RIFF'), mimeType: 'audio/wav', modelId: 'voice-en' }; } }
  });
}

test('end-to-end farmer voice flow returns transcript, grounded sources, and audio', async () => {
  const result = await farmerFlow().queryVoice({ audio: { metadata: { durationMs: 1100 } }, requestId: 'e2e-farmer' });
  assert.equal(result.transcript, 'What farmer schemes are available for me?');
  assert.equal(result.language, 'en');
  assert.match(result.answer, /PM-KISAN/);
  assert.equal(result.sources[0].schemeId, 'pm-kisan');
  assert.equal(result.audio.mimeType, 'audio/wav');
  assert.ok(result.audio.buffer.length > 0);
});

test('preserves Hindi STT output and handles a noisy-audio transcript', async () => {
  const result = await farmerFlow({ sttLanguage: 'hi' }).queryVoice({ audio: { metadata: {} } });
  assert.equal(result.language, 'hi');
  assert.equal(result.sources.length, 1);
});

test('reports speech-not-detected instead of inventing a transcript', async () => {
  const service = new SpeechToTextService({ modelRegistry: { getStt: () => ({ id: 'mock' }) }, provider: { transcribe: async () => ({ text: '' }) } });
  await assert.rejects(() => service.transcribe({}), { code: 'NO_SPEECH_DETECTED' });
});

test('rejects audio longer than the configured maximum', () => {
  assert.throws(() => inspectAudio(pcmWav(121), 'audio/wav'), { code: 'AUDIO_TOO_LONG' });
});

test('maps Language Engine unavailability when STT language is absent', async () => {
  const client = { detect: async () => { throw error('ECONNREFUSED'); } };
  await assert.rejects(() => new LanguageResolutionService({ client }).resolve({ text: 'farmer schemes' }), { code: 'LANGUAGE_ENGINE_UNAVAILABLE' });
});

test('keeps a grounded text answer if TTS fails', async () => {
  const result = await farmerFlow({ ttsError: error('TTS_FAILURE') }).queryVoice({ audio: { metadata: {} } });
  assert.equal(result.audio, null);
  assert.equal(result.audioError.code, 'TTS_FAILURE');
  assert.match(result.answer, /PM-KISAN/);
});

test('propagates Backend and RAG availability failures without an answer', async () => {
  await assert.rejects(() => farmerFlow({ backendError: error('BACKEND_UNAVAILABLE') }).queryVoice({ audio: { metadata: {} } }), { code: 'BACKEND_UNAVAILABLE' });
  await assert.rejects(() => farmerFlow({ backendError: error('RAG_UNAVAILABLE') }).queryVoice({ audio: { metadata: {} } }), { code: 'RAG_UNAVAILABLE' });
});

test('processes repeated read-only voice queries independently', async () => {
  const service = farmerFlow();
  const [first, second] = await Promise.all([service.queryVoice({ audio: { metadata: {} }, requestId: 'retry-1' }), service.queryVoice({ audio: { metadata: {} }, requestId: 'retry-2' })]);
  assert.equal(first.answer, second.answer);
  assert.notEqual(first.audio, null);
});
