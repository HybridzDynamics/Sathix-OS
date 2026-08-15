const test = require('node:test');
const assert = require('node:assert/strict');
const LanguageResolutionService = require('../services/language/languageResolutionService');

test('preserves language prediction from STT without a detection call', async () => {
  const client = { detect: async () => { throw new Error('should not run'); } };
  const result = await new LanguageResolutionService({ client }).resolve({ text: 'नमस्ते', sttLanguage: 'hi' });
  assert.equal(result.language, 'hi');
  assert.equal(result.source, 'stt');
});

test('uses Language Engine when STT has no language prediction', async () => {
  const client = { detect: async () => ({ language: 'hi', confidence: 0.91, script: 'Devanagari' }) };
  const result = await new LanguageResolutionService({ client }).resolve({ text: 'नमस्ते' });
  assert.deepEqual(result, { language: 'hi', confidence: 0.91, source: 'language-engine', script: 'Devanagari', isRomanized: false });
});
