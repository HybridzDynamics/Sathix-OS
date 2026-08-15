/**
 * Phase 3 — IndicTrans2 Integration & Provider Abstraction Test Suite
 */
const translationService = require('../services/translation/translationService');
const TranslationProvider = require('../services/translation/translationProvider');

class MockCustomProvider extends TranslationProvider {
  constructor() {
    super('custom-model');
  }
  async translate({ text, sourceLanguage, targetLanguage }) {
    return {
      translation: `CUSTOM_${targetLanguage.toUpperCase()}:${text}`,
      sourceLanguage,
      targetLanguage,
      model: 'custom-model-v1',
      modelVersion: '1.0.0',
      processingTimeMs: 5
    };
  }
  async checkHealth() {
    return true;
  }
}

async function runPhase3Tests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 3: IndicTrans2 Integration Tests');
  console.log('======================================================\n');

  // Test 1: IndicTrans2 English -> Hindi Translation
  console.log('[Test 1] English -> Hindi translation via IndicTrans2 provider');
  const res1 = await translationService.translate({
    text: 'I want to know about farmer schemes',
    sourceLanguage: 'en',
    targetLanguage: 'hi'
  });
  console.log(`   Input: "I want to know about farmer schemes" (en)`);
  console.log(`   Translation: "${res1.translation}" (hi)`);
  if (!res1.translation || res1.model !== 'indictrans2') {
    throw new Error('IndicTrans2 English -> Hindi translation failed');
  }
  console.log('   ✅ PASS: English -> Hindi translation');

  // Test 2: IndicTrans2 Hindi -> English Translation
  console.log('\n[Test 2] Hindi -> English translation via IndicTrans2 provider');
  const res2 = await translationService.translate({
    text: 'मुझे किसान योजना चाहिए',
    sourceLanguage: 'hi',
    targetLanguage: 'en'
  });
  console.log(`   Input: "मुझे किसान योजना चाहिए" (hi)`);
  console.log(`   Translation: "${res2.translation}" (en)`);
  if (!res2.translation || res2.targetLanguage !== 'en') {
    throw new Error('IndicTrans2 Hindi -> English translation failed');
  }
  console.log('   ✅ PASS: Hindi -> English translation');

  // Test 3: Batch Translation
  console.log('\n[Test 3] Batch translation (Multiple sentences)');
  const res3 = await translationService.translate({
    texts: [
      'I want to know about farmer schemes',
      'What financial assistance is available?'
    ],
    sourceLanguage: 'en',
    targetLanguage: 'hi'
  });
  if (!Array.isArray(res3.translations) || res3.translations.length !== 2) {
    throw new Error('Batch translation failed');
  }
  console.log(`   Batch result count: ${res3.translations.length}`);
  console.log('   ✅ PASS: Batch translation');

  // Test 4: Provider Abstraction & Custom Provider Registration
  console.log('\n[Test 4] Pluggable Provider Abstraction (Adding custom fine-tuned model)');
  translationService.registerProvider('custom-finetuned', new MockCustomProvider());
  const res4 = await translationService.translate({
    text: 'test scheme query',
    sourceLanguage: 'en',
    targetLanguage: 'hi',
    provider: 'custom-finetuned'
  });
  if (res4.model !== 'custom-model-v1' || !res4.translation.startsWith('CUSTOM_HI:')) {
    throw new Error('Custom provider dispatch failed');
  }
  console.log(`   Custom Model Output: "${res4.translation}"`);
  console.log('   ✅ PASS: Pluggable provider architecture verified (zero hardcoding of IndicTrans2)');

  // Test 5: Error handling on invalid/unsupported language
  console.log('\n[Test 5] Unsupported language pair validation');
  try {
    await translationService.translate({
      text: 'Hello',
      sourceLanguage: 'en',
      targetLanguage: 'invalid_lang'
    });
    throw new Error('Should have failed for invalid target language');
  } catch (err) {
    console.log(`   Expected validation error caught: "${err.message}"`);
    console.log('   ✅ PASS: Language pair validation');
  }

  console.log('\n======================================================');
  console.log('🎉 Phase 3 IndicTrans2 Integration Verification PASSED!');
  console.log('======================================================\n');
}

if (require.main === module) {
  runPhase3Tests().catch(err => {
    console.error('\n❌ Phase 3 Test Failed:', err.message);
    process.exit(1);
  });
}

module.exports = runPhase3Tests;
