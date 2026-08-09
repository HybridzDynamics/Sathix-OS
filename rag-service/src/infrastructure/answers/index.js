function getAnswerGenerator() {
  const provider = process.env.ANSWER_GENERATOR || 'noop';
  if (provider === 'noop') {
    const NoopGenerator = require('./noopGenerator');
    return new NoopGenerator();
  }
  throw new Error(`Unknown answer generator: ${provider}`);
}

module.exports = { getAnswerGenerator };
