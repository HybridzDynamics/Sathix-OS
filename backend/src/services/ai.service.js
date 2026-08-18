const rag = require('../integrations/rag.client');

async function chat(prisma, userId, data) {
  const { message, language, filters, sessionId } = data;
  const normalizedLanguage = language ? language.toLowerCase() : 'en';
  let existingSession = null;
  if (sessionId) {
    existingSession = await prisma.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!existingSession) {
      const error = new Error('Chat session was not found.');
      error.status = 404;
      throw error;
    }
  }

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

  let session;
  if (sessionId) {
    await prisma.chatMessage.createMany({ data: [
      { sessionId: existingSession.id, role: 'user', content: message },
      { sessionId: existingSession.id, role: 'assistant', content: answer },
    ] });
    session = await prisma.chatSession.findUnique({ where: { id: existingSession.id }, include: { messages: true } });
  } else {
    session = await prisma.chatSession.create({
      data: { userId, messages: { create: [{ role: 'user', content: message }, { role: 'assistant', content: answer }] } },
      include: { messages: true },
    });
  }

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
