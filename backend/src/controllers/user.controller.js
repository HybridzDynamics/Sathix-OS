const getProfile = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const { age, gender, state, district, occupation, income, education, category, disability, familyDetails } = req.body;

    const profileData = {
      age,
      gender,
      state,
      district,
      occupation,
      income,
      education,
      category,
      disability,
      familyDetails,
    };

    const existingProfile = await prisma.citizenProfile.findUnique({ where: { userId: req.user.id } });

    let profile;
    if (existingProfile) {
      profile = await prisma.citizenProfile.update({
        where: { id: existingProfile.id },
        data: profileData,
      });
    } else {
      profile = await prisma.citizenProfile.create({
        data: {
          userId: req.user.id,
          ...profileData,
        },
      });
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
