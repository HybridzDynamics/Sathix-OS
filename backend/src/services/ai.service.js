const axios = require('axios');

const RAG_ENGINE_URL = process.env.RAG_ENGINE_URL || 'http://localhost:3001';
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || '';
const RAG_TIMEOUT_MS = Number(process.env.RAG_TIMEOUT_MS || 15000);

async function queryRag({ query, language, filters, topK }) {
  const headers = { 'Content-Type': 'application/json' };
  if (INTERNAL_SERVICE_TOKEN) headers['x-internal-token'] = INTERNAL_SERVICE_TOKEN;

  const response = await axios.post(
    `${RAG_ENGINE_URL}/rag/query`,
    { query, language, filters, topK: topK || 5 },
    { timeout: RAG_TIMEOUT_MS, headers }
  );
  return response.data?.data || response.data;
}

async function chat(prisma, userId, data) {
  const { message, language, filters } = data;
  const normalizedLanguage = language ? language.toLowerCase() : 'en';

  let answer = 'I could not find relevant scheme information at this time.';
  let sources = [];

  try {
    const ragResult = await queryRag({
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
