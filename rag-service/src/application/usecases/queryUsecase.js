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

    // Build structured sources from Qdrant payloads
    const sources = retrieval.results
      .map((item) => ({
        schemeId: item.payload?.schemeId || item.payload?.documentId || item.id,
        title: item.payload?.title || null,
        sourceUrl: item.payload?.source || null,
        state: item.payload?.state || null,
        category: item.payload?.category || null,
        score: item.finalScore || item.score || null
      }))
      .filter((s) => s.schemeId);

    return {
      answer: answer.answer,
      sources,
      citations: answer.citations || [],
      language: retrieval.language,
      query: input.query
    };
  }
};
