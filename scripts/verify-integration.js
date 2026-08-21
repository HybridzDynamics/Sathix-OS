/**
 * Verifies SathiX-OS service integration with Backend as the central gateway.
 * Usage: node scripts/verify-integration.js
 */
const services = [
  { name: 'Backend', url: process.env.BACKEND_URL || 'http://localhost:5000', path: '/health' },
  { name: 'Backend Ready', url: process.env.BACKEND_URL || 'http://localhost:5000', path: '/api/ready' },
  { name: 'RAG', url: process.env.RAG_ENGINE_URL || 'http://localhost:3001', path: '/rag/health' },
  { name: 'Language Engine', url: process.env.LANGUAGE_ENGINE_URL || 'http://localhost:4001', path: '/health' },
  { name: 'Language ML', url: process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8001', path: '/health' },
  { name: 'Voice', url: process.env.VOICE_SERVICE_URL || 'http://localhost:4002', path: '/health' },
  { name: 'STT Inference', url: process.env.STT_INFERENCE_URL || 'http://localhost:8002', path: '/health' },
  { name: 'TTS Inference', url: process.env.TTS_INFERENCE_URL || 'http://localhost:8003', path: '/health' },
  { name: 'WhatsApp', url: process.env.WHATSAPP_SERVICE_URL || 'http://localhost:4003', path: '/health' },
];

async function probe({ name, url, path }) {
  try {
    const response = await fetch(`${url}${path}`, { signal: AbortSignal.timeout(5000) });
    const body = await response.text();
    return { name, ok: response.ok, status: response.status, detail: body.slice(0, 120) };
  } catch (error) {
    return { name, ok: false, status: 0, detail: error.message };
  }
}

async function probeRagQuery() {
  const token = process.env.INTERNAL_SERVICE_TOKEN;
  const url = process.env.RAG_ENGINE_URL || 'http://localhost:3001';
  if (!token) return { name: 'RAG Query (auth)', ok: false, status: 0, detail: 'INTERNAL_SERVICE_TOKEN not set' };
  try {
    const response = await fetch(`${url}/rag/query`, {
      method: 'POST',
      headers: { 'x-internal-token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'farmer scheme', language: 'en', topK: 3 }),
      signal: AbortSignal.timeout(10000)
    });
    const body = await response.json().catch(() => ({}));
    return { name: 'RAG Query (auth)', ok: response.ok, status: response.status, detail: body.status || body.error || 'ok' };
  } catch (error) {
    return { name: 'RAG Query (auth)', ok: false, status: 0, detail: error.message };
  }
}

async function probeBackendDeps() {
  const url = process.env.BACKEND_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${url}/api/ready`, { signal: AbortSignal.timeout(8000) });
    const body = await response.json().catch(() => ({}));
    const deps = body.dependencies || body.services || {};
    const ok = response.ok && !Object.values(deps).includes('error');
    return { name: 'Backend /api/ready dependencies', ok, status: response.status, detail: JSON.stringify(deps) };
  } catch (error) {
    return { name: 'Backend /api/ready dependencies', ok: false, status: 0, detail: error.message };
  }
}

async function probeBackendGatewayRoutes() {
  const url = process.env.BACKEND_URL || 'http://localhost:5000';
  const routes = [
    { name: 'Auth register route', path: '/api/auth/register', method: 'POST', expect: [400, 422] },
    { name: 'Schemes route', path: '/api/schemes', method: 'GET', expect: [401] },
    { name: 'Integration RAG gateway', path: '/api/rag/query', method: 'POST', expect: [401] },
    { name: 'Internal voice route', path: '/api/internal/voice/query', method: 'POST', expect: [401, 403] },
  ];
  const results = [];
  for (const route of routes) {
    try {
      const response = await fetch(`${url}${route.path}`, {
        method: route.method,
        headers: { 'Content-Type': 'application/json' },
        body: route.method === 'POST' ? '{}' : undefined,
        signal: AbortSignal.timeout(5000)
      });
      const ok = route.expect.includes(response.status);
      results.push({ name: route.name, ok, status: response.status, detail: ok ? 'route reachable' : `unexpected ${response.status}` });
    } catch (error) {
      results.push({ name: route.name, ok: false, status: 0, detail: error.message });
    }
  }
  return results;
}

async function main() {
  console.log('SathiX-OS Integration Verification\n');
  const gatewayRoutes = await probeBackendGatewayRoutes();
  const results = await Promise.all([
    ...services.map(probe),
    probeRagQuery(),
    probeBackendDeps()
  ]);
  const all = [...results, ...gatewayRoutes];
  let failed = 0;
  for (const row of all) {
    const mark = row.ok ? 'PASS' : 'FAIL';
    if (!row.ok) failed += 1;
    console.log(`[${mark}] ${row.name} (${row.status}) — ${row.detail}`);
  }
  console.log(`\n${all.length - failed}/${all.length} checks passed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
