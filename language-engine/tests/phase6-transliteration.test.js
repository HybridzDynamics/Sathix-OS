/**
 * Phase 6 — Normalization & Transliteration Test Suite
 */
const http = require('http');
const app = require('../src/app');
const normalizer = require('../services/normalization/normalizer');

let server;
const PORT = 4095;

function post(path, body = {}) {
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
        'X-Internal-Token': process.env.INTERNAL_SERVICE_TOKEN || 'sathix_internal_secret_2024'
      }
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
    req.write(payload);
    req.end();
  });
}

async function runPhase6Tests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 6: Normalization & Transliteration Tests');
  console.log('======================================================\n');

  // Test 1: Normalizer Unit Test
  console.log('[Unit 1] Text Normalizer (Deduplication & cleanup)');
  const raw = '  Mujhe   kisaaaan   yojna   bataoooo  plz ! ';
  const cleaned = normalizer.normalize(raw);
  console.log(`   Raw input: "${raw}"`);
  console.log(`   Normalized: "${cleaned}"`);
  if (!cleaned.includes('kisaan') || !cleaned.includes('yojana') || !cleaned.includes('please')) {
    throw new Error('Normalization failed to clean characters and word contractions');
  }
  console.log('   ✅ PASS: Text Normalization');

  // API HTTP Testing
  server = app.listen(PORT, '127.0.0.1');

  try {
    // Test 2: Standard Hinglish Query Transliteration
    console.log('\n[API 1] POST /api/v1/transliterate (Hinglish -> Devanagari Hindi)');
    const res1 = await post('/api/v1/transliterate', {
      text: 'Mujhe kisan yojana ke baare mein batao'
    });
    if (res1.status !== 200) throw new Error(`Expected 200, got ${res1.status}: ${JSON.stringify(res1.body)}`);
    console.log(`   Input: "Mujhe kisan yojana ke baare mein batao"`);
    console.log(`   Transliteration: "${res1.body.transliteration}"`);
    console.log(`   Target Script: ${res1.body.targetScript}, Language: ${res1.body.targetLanguage}`);
    if (res1.body.transliteration !== 'मुझे किसान योजना के बारे में बताओ') {
      throw new Error('Transliteration output mismatch');
    }
    if (res1.body.targetScript !== 'Devanagari' || res1.body.targetLanguage !== 'hi') {
      throw new Error('Target language/script metadata mismatch');
    }
    console.log('   ✅ PASS: Hinglish -> Devanagari Hindi transliteration');

    // Test 3: Transliteration with explicit target language
    console.log('\n[API 2] POST /api/v1/transliterate with explicit target language (hi)');
    const res2 = await post('/api/v1/transliterate', {
      text: 'Pradhan Mantri Kisan Samman Nidhi',
      targetLanguage: 'hi'
    });
    if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
    console.log(`   Transliteration: "${res2.body.transliteration}"`);
    if (res2.body.transliteration !== 'प्रधान मंत्री किसान सम्मान निधि') {
      throw new Error('Government scheme transliteration mismatch');
    }
    console.log('   ✅ PASS: Explicit target language transliteration');

    // Test 4: Validation on missing text
    console.log('\n[API 3] POST /api/v1/transliterate (Validation on empty text)');
    const res3 = await post('/api/v1/transliterate', { text: '' });
    if (res3.status !== 400) throw new Error(`Expected 400, got ${res3.status}`);
    console.log(`   Caught expected 400: "${res3.body.error}"`);
    console.log('   ✅ PASS: Missing text validation');

    console.log('\n======================================================');
    console.log('🎉 Phase 6 Normalization & Transliteration Verification PASSED!');
    console.log('======================================================\n');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runPhase6Tests().catch(err => {
    console.error('\n❌ Phase 6 Test Failed:', err.message);
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = runPhase6Tests;
