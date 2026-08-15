/**
 * Phase 5 — Automatic Language Detection Test Suite
 */
const http = require('http');
const app = require('../src/app');

let server;
const PORT = 4096;

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

async function runPhase5Tests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 5: Language Detection (POST /api/v1/detect) Tests');
  console.log('======================================================\n');

  server = app.listen(PORT, '127.0.0.1');

  try {
    // Test 1: Native Hindi (Devanagari)
    console.log('[Test 1] Native Hindi Devanagari detection');
    const res1 = await post('/api/v1/detect', { text: 'मुझे किसान योजना चाहिए' });
    if (res1.status !== 200) throw new Error(`Expected 200, got ${res1.status}`);
    console.log(`   Result:`, JSON.stringify(res1.body));
    if (res1.body.language !== 'hi' || res1.body.script !== 'Devanagari' || res1.body.confidence < 0.9) {
      throw new Error('Hindi detection mismatch');
    }
    console.log('   ✅ PASS: Native Hindi detection');

    // Test 2: Native Tamil
    console.log('\n[Test 2] Native Tamil script detection');
    const res2 = await post('/api/v1/detect', { text: 'விவசாயிகள் திட்டம்' });
    if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
    console.log(`   Result: language=${res2.body.language}, script=${res2.body.script}`);
    if (res2.body.language !== 'ta' || res2.body.script !== 'Tamil') {
      throw new Error('Tamil detection mismatch');
    }
    console.log('   ✅ PASS: Native Tamil detection');

    // Test 3: Pure English
    console.log('\n[Test 3] Pure English detection');
    const res3 = await post('/api/v1/detect', { text: 'I want to know about farmer subsidy schemes' });
    if (res3.status !== 200) throw new Error(`Expected 200, got ${res3.status}`);
    console.log(`   Result: language=${res3.body.language}, isRomanized=${res3.body.isRomanized}`);
    if (res3.body.language !== 'en' || res3.body.isRomanized !== false) {
      throw new Error('English detection mismatch');
    }
    console.log('   ✅ PASS: Pure English detection');

    // Test 4: Romanized Indic (Hinglish)
    console.log('\n[Test 4] Romanized Hindi (Hinglish) detection');
    const res4 = await post('/api/v1/detect', { text: 'Mujhe kisan yojana ke baare mein batao' });
    if (res4.status !== 200) throw new Error(`Expected 200, got ${res4.status}`);
    console.log(`   Result:`, JSON.stringify(res4.body));
    if (res4.body.language !== 'hi' || res4.body.isRomanized !== true) {
      throw new Error('Romanized Hindi detection mismatch');
    }
    console.log('   ✅ PASS: Romanized Indic / Hinglish detection');

    // Test 5: Validation - Empty text
    console.log('\n[Test 5] Validation on empty text');
    const res5 = await post('/api/v1/detect', { text: '   ' });
    if (res5.status !== 400) throw new Error(`Expected 400, got ${res5.status}`);
    console.log(`   Caught expected 400: "${res5.body.error}"`);
    console.log('   ✅ PASS: Empty text validation');

    console.log('\n======================================================');
    console.log('🎉 Phase 5 Language Detection Verification PASSED!');
    console.log('======================================================\n');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runPhase5Tests().catch(err => {
    console.error('\n❌ Phase 5 Test Failed:', err.message);
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = runPhase5Tests;
