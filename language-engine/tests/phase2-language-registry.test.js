/**
 * Phase 2 — Language Registry Comprehensive Test Suite
 */
const http = require('http');
const app = require('../src/app');
const registry = require('../models/registry/languageRegistry');

let server;
const PORT = 4098;

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runPhase2Tests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 2: Language Registry Tests');
  console.log('======================================================\n');

  // Test 1: Unit testing LanguageRegistry methods
  console.log('[Unit 1] LanguageRegistry normalization and lookups');
  if (registry.normalizeCode('hindi') !== 'hi') throw new Error('Failed to normalize "hindi" to "hi"');
  if (registry.normalizeCode('TAMIL') !== 'ta') throw new Error('Failed to normalize "TAMIL" to "ta"');
  if (registry.normalizeCode('ben') !== 'bn') throw new Error('Failed to normalize "ben" to "bn"');
  if (registry.normalizeCode('english') !== 'en') throw new Error('Failed to normalize "english" to "en"');
  console.log('   ✅ PASS: Code & alias normalization');

  console.log('[Unit 2] IndicTrans2 tag resolution');
  if (registry.getIndicTrans2Code('hi') !== 'hin_Deva') throw new Error('Expected hin_Deva for hi');
  if (registry.getIndicTrans2Code('ta') !== 'tam_Taml') throw new Error('Expected tam_Taml for ta');
  if (registry.getIndicTrans2Code('en') !== 'eng_Latn') throw new Error('Expected eng_Latn for en');
  if (registry.getIndicTrans2Code('bn') !== 'ben_Beng') throw new Error('Expected ben_Beng for bn');
  console.log('   ✅ PASS: IndicTrans2 FLORES tags resolution');

  console.log('[Unit 3] Translation pair validation');
  const pair1 = registry.validateTranslationPair('en', 'hi');
  if (!pair1.valid) throw new Error('en -> hi should be valid');
  const pair2 = registry.validateTranslationPair('hi', 'hi');
  if (pair2.valid) throw new Error('Identical pair hi -> hi should be invalid');
  const pair3 = registry.validateTranslationPair('xx', 'hi');
  if (pair3.valid) throw new Error('Unknown language xx should be invalid');
  console.log('   ✅ PASS: Translation pair validation logic');

  // API HTTP Testing
  server = app.listen(PORT, '127.0.0.1');

  try {
    console.log('[API 1] GET /api/v1/languages (All languages)');
    const resAll = await get('/api/v1/languages');
    if (resAll.status !== 200) throw new Error(`Expected 200, got ${resAll.status}`);
    if (resAll.body.total < 23) throw new Error(`Expected at least 23 languages, got ${resAll.body.total}`);
    console.log(`   ✅ PASS: Fetched ${resAll.body.total} supported languages from registry`);

    console.log('[API 2] GET /api/v1/languages?isIndic=true');
    const resIndic = await get('/api/v1/languages?isIndic=true');
    if (resIndic.status !== 200) throw new Error(`Expected 200, got ${resIndic.status}`);
    if (resIndic.body.languages.en) throw new Error('English should not be in isIndic=true list');
    if (!resIndic.body.languages.hi) throw new Error('Hindi should be in isIndic=true list');
    console.log(`   ✅ PASS: Filtered Indic languages (${resIndic.body.total} total)`);

    console.log('[API 3] GET /api/v1/languages/hi (Single language query)');
    const resHi = await get('/api/v1/languages/hi');
    if (resHi.status !== 200) throw new Error(`Expected 200, got ${resHi.status}`);
    if (resHi.body.language.name !== 'Hindi' || resHi.body.language.indictrans2Code !== 'hin_Deva') {
      throw new Error('Hindi metadata mismatch');
    }
    console.log(`   ✅ PASS: Specific language lookup for "hi"`);

    console.log('[API 4] GET /api/v1/languages/unknown (404 handling)');
    const res404 = await get('/api/v1/languages/klingon');
    if (res404.status !== 404) throw new Error(`Expected 404, got ${res404.status}`);
    console.log(`   ✅ PASS: Graceful 404 for unknown language`);

    console.log('\n======================================================');
    console.log('🎉 Phase 2 Language Registry Verification PASSED!');
    console.log('======================================================\n');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runPhase2Tests().catch(err => {
    console.error('\n❌ Phase 2 Test Failed:', err.message);
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = runPhase2Tests;
