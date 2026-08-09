async function getProfile(prisma, userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

async function updateProfile(prisma, userId, data) {
  const existingProfile = await prisma.citizenProfile.findUnique({ where: { userId } });
  if (existingProfile) {
    return prisma.citizenProfile.update({
      where: { id: existingProfile.id },
      data,
    });
  }

  return prisma.citizenProfile.create({
    data: { userId, ...data },
  });
}

module.exports = { getProfile, updateProfile };
