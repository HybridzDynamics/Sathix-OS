const rag = require('../integrations/rag.client');

async function chat(prisma, userId, data) {
  const { message, language, filters } = data;
  const normalizedLanguage = language ? language.toLowerCase() : 'en';

  let answer = 'I could not find relevant scheme information at this time.';
  let sources = [];

  try {
    const ragResult = await rag.query({
      query: message,
      language: normalizedLanguage,
      filters: filters || {},
      topK: 5
    });
    answer = ragResult.answer || answer;
    sources = ragResult.sources || [];
  } catch (err) {
    // RAG unavailable — fail gracefully, log, still create session
    console.error('[ai.service] RAG query failed:', err.message);
  }

  const session = await prisma.chatSession.create({
    data: {
      userId,
      messages: {
        create: [
          { role: 'user', content: message },
          { role: 'assistant', content: answer },
        ],
      },
    },
    include: { messages: true },
  });

  return { answer, sources, session };
}

async function getHistory(prisma, userId) {
  return prisma.chatSession.findMany({
    where: { userId },
    include: { messages: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { chat, getHistory };
