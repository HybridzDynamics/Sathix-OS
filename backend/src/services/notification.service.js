async function sendNotification(prisma, userId, title, body) {
  return prisma.notification.create({
    data: { userId, title, body },
  });
}

module.exports = { sendNotification };
