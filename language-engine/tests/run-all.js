/**
 * Phase 1 Architecture & Health Smoke Test
 */
const http = require('http');
const app = require('../src/app');

let server;
const PORT = 4099;

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'GET',
      headers
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
    req.end();
  });
}

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

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Running Phase 1: Architecture & Endpoints Smoke Test');
  console.log('======================================================\n');

  server = app.listen(PORT, '127.0.0.1');

  try {
    // Test 1: Base Health
    const res1 = await get('/health');
    console.log(`[Test 1] GET /health -> Status: ${res1.status}, Service: ${res1.body.service}`);
    if (res1.status !== 200 || res1.body.status !== 'ok') throw new Error('Base health check failed');
    console.log('   ✅ PASS: Base health check');

    // Test 2: API v1 Health
    const res2 = await get('/api/v1/health');
    console.log(`[Test 2] GET /api/v1/health -> Status: ${res2.status}, Component: ${res2.body.components.api}`);
    if (res2.status !== 200 && res2.status !== 207) throw new Error('v1 health check failed');
    console.log('   ✅ PASS: API v1 health check');

    // Test 3: Request ID Middleware
    if (!res1.headers['x-request-id']) throw new Error('Request ID header missing');
    console.log(`   ✅ PASS: Request ID middleware verified (${res1.headers['x-request-id']})`);

    // Test 4: Languages Route Stub (Public)
    const res4 = await get('/api/v1/languages');
    console.log(`[Test 4] GET /api/v1/languages -> Status: ${res4.status}`);
    if (res4.status !== 200) throw new Error('Languages endpoint unreachable');
    console.log('   ✅ PASS: Language route reachable');

    console.log('\n======================================================');
    console.log('🎉 Phase 1 Architecture Verification PASSED!');
    console.log('======================================================\n');
  } finally {
    server.close();
  }

  // Run Phase 2
  const runPhase2 = require('./phase2-language-registry.test');
  await runPhase2();

  // Run Phase 3
  const runPhase3 = require('./phase3-indictrans2-integration.test');
  await runPhase3();

  // Run Phase 4
  const runPhase4 = require('./phase4-translation-api.test');
  await runPhase4();

  // Run Phase 5
  const runPhase5 = require('./phase5-language-detection.test');
  await runPhase5();

  // Run Phase 6
  const runPhase6 = require('./phase6-transliteration.test');
  await runPhase6();
}

runTests().catch(err => {
  console.error('\n❌ Phase 1 Test Failed:', err.message);
  if (server) server.close();
  process.exit(1);
});
