process.env.EMBEDDING_DIM = '8';
const LocalHash = require('../src/infrastructure/embeddings/providers/localHashProvider');

describe('localHashProvider', () => {
  test('embeddings are normalized and deterministic', async () => {
    const provider = new LocalHash();
    const first = await provider.embed('farmer support scheme');
    const second = await provider.embed('farmer support scheme');
    const different = await provider.embed('student scholarship program');

    expect(first.vector.length).toBe(8);
    const norm = Math.sqrt(first.vector.reduce((sum, value) => sum + value * value, 0));
    expect(Math.abs(norm - 1)).toBeLessThan(0.001);
    expect(first.vector).toEqual(second.vector);
    expect(first.vector).not.toEqual(different.vector);
  });
});
