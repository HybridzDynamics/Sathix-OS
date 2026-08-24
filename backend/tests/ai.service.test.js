const test = require('node:test');
const assert = require('node:assert/strict');
const rag = require('../src/integrations/rag.client');
const ai = require('../src/services/ai.service');
const db = require('../src/db');

test('adds a new message pair to an owned existing chat session', async () => {
  const originalQuery = rag.query;
  const originalFind = db.findChatSessionForUser;
  const originalAdd = db.addChatMessages;
  const originalGet = db.getChatSessionWithMessages;
  const writes = [];

  rag.query = async () => ({ answer: 'Grounded answer', sources: [] });
  db.findChatSessionForUser = async (sessionId, userId) =>
    sessionId === 'session-1' && userId === 'user-1' ? { id: 'session-1' } : null;
  db.addChatMessages = async (messages) => { writes.push(...messages); };
  db.getChatSessionWithMessages = async () => ({
    id: 'session-1',
    messages: [{ role: 'user', content: 'Question' }, { role: 'assistant', content: 'Grounded answer' }],
  });

  try {
    const result = await ai.chat('user-1', { message: 'Question', language: 'en', sessionId: 'session-1' });
    assert.equal(result.session.id, 'session-1');
    assert.deepEqual(writes, [
      { sessionId: 'session-1', role: 'user', content: 'Question' },
      { sessionId: 'session-1', role: 'assistant', content: 'Grounded answer' },
    ]);
  } finally {
    rag.query = originalQuery;
    db.findChatSessionForUser = originalFind;
    db.addChatMessages = originalAdd;
    db.getChatSessionWithMessages = originalGet;
  }
});

test('does not append messages to another user’s chat session', async () => {
  const originalFind = db.findChatSessionForUser;
  db.findChatSessionForUser = async () => null;
  try {
    await assert.rejects(
      () => ai.chat('user-1', { message: 'Question', sessionId: 'another-user-session' }),
      { message: 'Chat session was not found.', status: 404 },
    );
  } finally {
    db.findChatSessionForUser = originalFind;
  }
});
