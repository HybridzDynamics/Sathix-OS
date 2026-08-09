const retrievalService = require('../services/retrievalService');
const { buildPrompt } = require('../services/promptBuilder');
const answerService = require('../services/answerService');

module.exports = {
  async execute(input) {
    if (!input || !input.query) {
      throw new Error('Query text is required');
    }

    const retrieval = await retrievalService.retrieve(input.query, {
      topK: input.topK,
      filters: input.filters
    });

    const prompt = buildPrompt({
      query: retrieval.query,
      results: retrieval.results,
      maxTokens: input.maxTokens || 1200
    });

    const answer = await answerService.generateAnswer({
      prompt,
      retrieval,
      query: input.query,
      options: { topK: input.topK, filters: input.filters }
    });

    return {
      query: input.query,
      prompt,
      retrieval,
      answer
    };
  }
};
