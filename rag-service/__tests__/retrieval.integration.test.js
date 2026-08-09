const embeddingService = require('../src/application/services/embeddingService');
const retrievalService = require('../src/application/services/retrievalService');

describe('retrieval integration (in-memory vector store)', () => {
  beforeAll(async () => {
    // populate vector store with two docs
    await embeddingService.embedDocument({ id: 'doc1', text: 'This scheme provides benefits to farmers', meta: { source: 'government', createdAt: new Date().toISOString(), language: 'en' } });
    await embeddingService.embedDocument({ id: 'doc2', text: 'This is unrelated content about sports', meta: { source: 'news', createdAt: new Date().toISOString(), language: 'en' } });
  });

  test('retrieve returns relevant document first', async () => {
    const res = await retrievalService.retrieve('benefits for farmers', { topK: 2 });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results[0].id).toBe('doc1');
  });
});
