const rankingService = require('../src/application/services/rankingService');

test('rankResults orders by finalScore and respects topK', () => {
  const results = [
    { id: 'a', score: 0.9, payload: { createdAt: new Date().toISOString(), source: 'blog' } },
    { id: 'b', score: 0.8, payload: { createdAt: new Date().toISOString(), source: 'government' } },
    { id: 'c', score: 0.5, payload: { createdAt: new Date().toISOString(), source: 'news' } }
  ];

  const ranked = rankingService.rankResults(results, { queryLanguage: 'en', topK: 2 });
  expect(ranked.length).toBe(2);
  // government source should be prioritized
  expect(ranked[0].id).toBe('b');
});
