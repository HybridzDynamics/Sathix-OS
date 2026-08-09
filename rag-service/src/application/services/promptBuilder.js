function buildPrompt({ query, results, instruction, maxTokens = 1500 }) {
  const header = instruction ||
    'You are a factual assistant. Answer only using the provided context. Do not invent details not present in the context. Cite sources by ID.';

  const contextBlocks = results.map((item, index) => {
    const payload = item.payload || {};
    const source = payload.source || payload.documentId || 'unknown';
    const title = payload.title || payload.summary || payload.content?.slice(0, 60) || 'context';
    const content = (payload.content || payload.summary || '').trim();
    return `SOURCE ${index + 1} [id=${item.id}, source=${source}]:\n${content}`;
  });

  const contextText = contextBlocks.join('\n\n');
  return [
    header,
    '---',
    'User question:',
    query,
    '---',
    'Context passages:',
    contextText,
    '---',
    'Instructions: Use only the context above to answer the question. If the answer is not contained in the context, say that you do not have enough information. Provide a short, factual response. List citations by source ID.',
    `Max tokens: ${maxTokens}`
  ].join('\n');
}

module.exports = { buildPrompt };
