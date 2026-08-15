const test = require('node:test');
const assert = require('node:assert/strict');
const SpeechToTextService = require('../services/stt/speechToTextService');

test('STT service preserves provider language, confidence and duration', async () => {
  const service = new SpeechToTextService({
    modelRegistry: { getStt: () => ({ id: 'test', capabilities: ['stt'] }) },
    provider: { transcribe: async () => ({ text: 'नमस्ते', language: 'hi', confidence: 0.95 }) }
  });
  const result = await service.transcribe({ buffer: Buffer.from('audio') }, { durationMs: 4200 });
  assert.deepEqual(result, { text: 'नमस्ते', language: 'hi', confidence: 0.95, durationMs: 4200 });
});

test('STT service rejects a missing active model', async () => {
  const service = new SpeechToTextService({ modelRegistry: { getStt: () => null }, provider: {} });
  await assert.rejects(() => service.transcribe({}), { code: 'MODEL_UNAVAILABLE' });
});
