/**
 * Phase 4 — Translation API Comprehensive HTTP Test Suite
 */
const http = require('http');
const app = require('../src/app');

let server;
const PORT = 4097;

function post(path, body = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-Internal-Token': process.env.INTERNAL_SERVICE_TOKEN || 'sathix_internal_secret_2024',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runPhase4Tests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 4: Translation API (POST /api/v1/translate) Tests');
  console.log('======================================================\n');

  server = app.listen(PORT, '127.0.0.1');

  try {
    // Test 1: Single Sentence En -> Hi
    console.log('[API 1] POST /api/v1/translate (en -> hi single sentence)');
    const res1 = await post('/api/v1/translate', {
      text: 'I want to know about farmer schemes',
      sourceLanguage: 'en',
      targetLanguage: 'hi'
    });
    if (res1.status !== 200) throw new Error(`Expected 200, got ${res1.status}: ${JSON.stringify(res1.body)}`);
    console.log(`   Response:`, JSON.stringify(res1.body));
    if (!res1.body.translation || res1.body.sourceLanguage !== 'en' || res1.body.targetLanguage !== 'hi') {
      throw new Error('Response payload fields mismatch');
    }
    if (typeof res1.body.processingTimeMs !== 'number') throw new Error('Missing processingTimeMs');
    console.log('   ✅ PASS: English -> Hindi single sentence translation');

    // Test 2: Single Sentence Hi -> En
    console.log('\n[API 2] POST /api/v1/translate (hi -> en single sentence)');
    const res2 = await post('/api/v1/translate', {
      text: 'मुझे किसान योजना चाहिए',
      sourceLanguage: 'hi',
      targetLanguage: 'en'
    });
    if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
    console.log(`   Translation: "${res2.body.translation}"`);
    if (!res2.body.translation) throw new Error('Empty translation output');
    console.log('   ✅ PASS: Hindi -> English translation');

    // Test 3: Batch Translation
    console.log('\n[API 3] POST /api/v1/translate (Batch translation)');
    const res3 = await post('/api/v1/translate', {
      texts: [
        'I want to know about farmer schemes',
        'What financial assistance is available?'
      ],
      sourceLanguage: 'en',
      targetLanguage: 'hi'
    });
    if (res3.status !== 200) throw new Error(`Expected 200, got ${res3.status}`);
    if (!Array.isArray(res3.body.translations) || res3.body.translations.length !== 2) {
      throw new Error('Batch translation output length mismatch');
    }
    console.log(`   Batch Count: ${res3.body.translations.length}`);
    console.log('   ✅ PASS: Batch translation');

    // Test 4: Validation — Missing text
    console.log('\n[API 4] POST /api/v1/translate (Validation: Missing text)');
    const res4 = await post('/api/v1/translate', {
      sourceLanguage: 'en',
      targetLanguage: 'hi'
    });
    if (res4.status !== 400) throw new Error(`Expected 400, got ${res4.status}`);
    console.log(`   Caught expected 400: "${res4.body.error}"`);
    console.log('   ✅ PASS: Missing text validation');

    // Test 5: Validation — Identical languages
    console.log('\n[API 5] POST /api/v1/translate (Validation: Identical src & tgt)');
    const res5 = await post('/api/v1/translate', {
      text: 'Hello',
      sourceLanguage: 'hi',
      targetLanguage: 'hi'
    });
    if (res5.status !== 400) throw new Error(`Expected 400, got ${res5.status}`);
    console.log(`   Caught expected 400: "${res5.body.error}"`);
    console.log('   ✅ PASS: Identical language pair rejection');

    // Test 6: Validation — Unknown language
    console.log('\n[API 6] POST /api/v1/translate (Validation: Unknown language)');
    const res6 = await post('/api/v1/translate', {
      text: 'Hello',
      sourceLanguage: 'en',
      targetLanguage: 'elvish'
    });
    if (res6.status !== 400) throw new Error(`Expected 400, got ${res6.status}`);
    console.log(`   Caught expected 400: "${res6.body.error}"`);
    console.log('   ✅ PASS: Unknown language rejection');

    console.log('\n======================================================');
    console.log('🎉 Phase 4 Translation API Verification PASSED!');
    console.log('======================================================\n');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runPhase4Tests().catch(err => {
    console.error('\n❌ Phase 4 Test Failed:', err.message);
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = runPhase4Tests;
