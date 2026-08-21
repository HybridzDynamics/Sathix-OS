const db = require('../db');
const rag = require('../integrations/rag.client');

async function chat(userId, data) {
  const { message, language, filters, sessionId } = data;
  const normalizedLanguage = language ? language.toLowerCase() : 'en';
  let existingSession = null;
  if (sessionId) {
    existingSession = await db.findChatSessionForUser(sessionId, userId);
    if (!existingSession) { const error = new Error('Chat session was not found.'); error.status = 404; throw error; }
  }

  let answer = 'I could not find relevant scheme information at this time.';
  let sources = [];
  try {
    const ragResult = await rag.query({ query: message, language: normalizedLanguage, filters: filters || {}, topK: 5 });
    answer = ragResult.answer || answer;
    sources = ragResult.sources || [];
  } catch (err) {
    console.error('[ai.service] RAG query failed:', err.message);
  }

  let session;
  if (sessionId) {
    await db.addChatMessages([
      { sessionId: existingSession.id, role: 'user', content: message },
      { sessionId: existingSession.id, role: 'assistant', content: answer }
    ]);
    session = await db.getChatSessionWithMessages(existingSession.id);
  } else {
    const created = await db.createChatSession(userId);
    await db.addChatMessages([
      { sessionId: created.id, role: 'user', content: message },
      { sessionId: created.id, role: 'assistant', content: answer }
    ]);
    session = await db.getChatSessionWithMessages(created.id);
  }
  return { answer, sources, session };
}

async function getHistory(userId) {
  return db.listChatSessionsByUser(userId);
}

module.exports = { chat, getHistory };
