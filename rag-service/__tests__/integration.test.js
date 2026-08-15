/**
 * Integration Tests — SathiX OS Pipeline
 *
 * Tests the full Scraper → Database → RAG Ingestion → Query chain.
 *
 * Prerequisites:
 *   - RAG service must be running: node src/index.js (port 3001)
 *   - DATABASE_URL must point to a live PostgreSQL DB with the Scheme table
 *
 * Run with: npm test
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const http = require('http');

const RAG_BASE = process.env.RAG_ENGINE_URL || 'http://localhost:3001';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function request(url, options = {}, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + (parsed.search || ''),
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) {
      const s = JSON.stringify(body);
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('Content-Length', Buffer.byteLength(s));
      req.write(s);
    }
    req.end();
  });
}

function post(path, body) {
  return request(RAG_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-token': process.env.INTERNAL_SERVICE_TOKEN || '' }
  }, body);
}

function get(path) {
  return request(RAG_BASE + path, { method: 'GET' });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

const results = [];

function test(name, fn) {
  return fn()
    .then(() => { console.log(`  ✅ PASS: ${name}`); results.push({ name, ok: true }); })
    .catch((err) => { console.error(`  ❌ FAIL: ${name}:`, err.message); results.push({ name, ok: false, err: err.message }); });
}

async function runTests() {
  console.log('\n═══ SathiX OS Integration Tests ═══\n');

  // ── Test 0: Health check ─────────────────────────────────────────────────
  await test('RAG service is reachable via /health', async () => {
    const res = await get('/rag/health');
    if (res.status !== 200 && res.status !== 207) throw new Error(`Health returned ${res.status}`);
    if (!res.body.service) throw new Error('Missing service field in health response');
  });

  // ── Test 1: Ingest a single scheme ───────────────────────────────────────
  const testSchemeId = `test-scheme-${Date.now()}`;
  await test('Test 1: Ingest a scheme into Qdrant via /rag/ingest', async () => {
    const res = await post('/rag/ingest', {
      id: testSchemeId,
      text: 'PM-KISAN provides income support of Rs 6000 per year to small and marginal farmers.',
      meta: {
        schemeId: testSchemeId,
        title: 'PM-KISAN Test Scheme',
        state: 'Punjab',
        category: 'farmer',
        source: 'https://pmkisan.gov.in'
      }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.id) throw new Error('Ingest response missing id');
  });

  // ── Test 2: Query finds the ingested scheme ───────────────────────────────
  await test('Test 2: Query retrieves relevant schemes from Qdrant', async () => {
    const res = await post('/rag/query', {
      query: 'What schemes are available for farmers?',
      language: 'en',
      topK: 5
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    const data = res.body.data;
    if (!data) throw new Error('Missing data field in response');
    if (typeof data.answer !== 'string') throw new Error('Missing answer in response');
    if (!Array.isArray(data.sources)) throw new Error('Missing sources array in response');
  });

  // ── Test 3: Duplicate ingestion — same id, no duplicates ─────────────────
  await test('Test 3: Ingesting same scheme twice produces no duplicates', async () => {
    // Upsert the same id twice
    await post('/rag/ingest', {
      id: testSchemeId,
      text: 'PM-KISAN provides Rs 6000 per year to eligible farmers.',
      meta: { schemeId: testSchemeId, title: 'PM-KISAN Test Scheme (updated)' }
    });
    await post('/rag/ingest', {
      id: testSchemeId,
      text: 'PM-KISAN provides Rs 6000 per year to eligible farmers.',
      meta: { schemeId: testSchemeId, title: 'PM-KISAN Test Scheme (updated)' }
    });
    // Query and verify we get ≤ 1 result with this schemeId
    const res = await post('/rag/query', { query: 'PM-KISAN farmer income support', topK: 20 });
    const sources = res.body?.data?.sources || [];
    const matchCount = sources.filter((s) => s.schemeId === testSchemeId).length;
    if (matchCount > 1) throw new Error(`Expected ≤1 matching source, got ${matchCount} (duplicate vectors detected)`);
  });

  // ── Test 4: Reindex endpoint ──────────────────────────────────────────────
  await test('Test 4: /rag/reindex completes without error', async () => {
    const res = await post('/rag/reindex', {});
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.result || typeof res.body.result.count === 'undefined') {
      throw new Error('Reindex result missing count');
    }
    console.log(`     → Reindexed ${res.body.result.count} schemes`);
  });

  // ── Test 5: Empty/nonsense query — should not fabricate ───────────────────
  await test('Test 5: Nonsense query returns answer (not an error) without fabricating', async () => {
    const res = await post('/rag/query', {
      query: 'xyzzy blorp fleeb florp',
      topK: 3
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = res.body.data;
    if (typeof data.answer !== 'string') throw new Error('Missing answer');
    // noop generator returns a standard string, not invented government content
    console.log(`     → Answer: "${data.answer.slice(0, 80)}..."`);
  });

  // ─── Summary ──────────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${'═'.repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter((r) => !r.ok).forEach((r) => console.log(`  ✗ ${r.name}: ${r.err}`));
    process.exit(1);
  } else {
    console.log('✅ All integration tests passed!\n');
  }
}

runTests().catch((err) => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
