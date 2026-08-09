async function chat(prisma, userId, data) {
  const { message, language } = data;
  const normalizedLanguage = language ? language.toLowerCase() : 'english';
  const answer = `AI response for message: ${message}. Language: ${normalizedLanguage}.`;

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

  return { answer, schemes: [], session };
}

async function getHistory(prisma, userId) {
  return prisma.chatSession.findMany({
    where: { userId },
    include: { messages: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { chat, getHistory };
