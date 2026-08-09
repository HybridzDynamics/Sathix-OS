const AnswerGenerator = require('../../domain/ports/answerGenerator');

class NoopGenerator extends AnswerGenerator {
  async generate({ prompt, retrieval, metadata = {} }) {
    return {
      answer: 'Answer generation is not configured. Provide a real generator implementation.',
      citations: retrieval.results.map((item) => ({ id: item.id, source: item.payload?.source || null })),
      metadata: {
        provider: 'noop',
        generatedAt: new Date().toISOString(),
        ...metadata
      }
    };
  }
}

module.exports = NoopGenerator;
