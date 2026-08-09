const submitApplication = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const { schemeId } = req.body;

    if (!schemeId) {
      return res.status(400).json({ message: 'Scheme ID is required' });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        schemeId,
        status: 'SUBMITTED',
        submittedDate: new Date(),
      },
    });

    res.status(201).json({ application });
  } catch (error) {
    next(error);
  }
};

const listApplications = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { scheme: true },
    });
    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

const getApplication = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { scheme: true },
    });

    if (!application || application.userId !== req.user.id) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitApplication, listApplications, getApplication };
