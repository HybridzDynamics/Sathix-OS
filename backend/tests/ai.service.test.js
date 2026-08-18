const test = require('node:test');
const assert = require('node:assert/strict');
const rag = require('../src/integrations/rag.client');
const ai = require('../src/services/ai.service');

test('adds a new message pair to an owned existing chat session', async () => {
  const originalQuery = rag.query;
  const writes = [];
  rag.query = async () => ({ answer: 'Grounded answer', sources: [] });
  const prisma = {
    chatSession: {
      findFirst: async ({ where }) => where.id === 'session-1' && where.userId === 'user-1' ? { id: 'session-1' } : null,
      findUnique: async () => ({ id: 'session-1', messages: [{ role: 'user', content: 'Question' }, { role: 'assistant', content: 'Grounded answer' }] }),
    },
    chatMessage: { createMany: async ({ data }) => { writes.push(...data); } },
  };
  try {
    const result = await ai.chat(prisma, 'user-1', { message: 'Question', language: 'en', sessionId: 'session-1' });
    assert.equal(result.session.id, 'session-1');
    assert.deepEqual(writes, [
      { sessionId: 'session-1', role: 'user', content: 'Question' },
      { sessionId: 'session-1', role: 'assistant', content: 'Grounded answer' },
    ]);
  } finally { rag.query = originalQuery; }
});

test('does not append messages to another user’s chat session', async () => {
  const prisma = { chatSession: { findFirst: async () => null } };
  await assert.rejects(
    () => ai.chat(prisma, 'user-1', { message: 'Question', sessionId: 'another-user-session' }),
    { message: 'Chat session was not found.', status: 404 },
  );
});
