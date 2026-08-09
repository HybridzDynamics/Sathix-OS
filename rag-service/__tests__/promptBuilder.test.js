const { buildPrompt } = require('../src/application/services/promptBuilder');

test('buildPrompt includes instruction and context passages', () => {
  const prompt = buildPrompt({
    query: 'What is X?',
    results: [
      { id: '1', payload: { content: 'This is content about X', source: 'gov' } }
    ],
    maxTokens: 500
  });

  expect(prompt).toMatch(/Use only the context above/);
  expect(prompt).toMatch(/SOURCE 1 \[id=1/);
});
