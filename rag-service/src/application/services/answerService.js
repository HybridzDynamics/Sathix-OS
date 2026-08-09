const { getAnswerGenerator } = require('../../infrastructure/answers');

const generator = getAnswerGenerator();

async function generateAnswer({ prompt, retrieval, query, options = {} }) {
  const response = await generator.generate({ prompt, retrieval, metadata: {
    query,
    options,
    returnedAt: new Date().toISOString()
  }});
  return {
    answer: response.answer,
    citations: response.citations || [],
    metadata: response.metadata || {}
  };
}

module.exports = { generateAnswer };
