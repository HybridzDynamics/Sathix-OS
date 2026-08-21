const db = require('../db');

const submitApplication = async (req, res, next) => {
  try {
    const { schemeId } = req.body;
    if (!schemeId) return res.status(400).json({ message: 'Scheme ID is required' });
    const application = await db.createApplication(req.user.id, schemeId);
    const applications = await db.findApplicationsByUser(req.user.id);
    const created = applications.find((item) => item.id === application.id);
    res.status(201).json({ application: created || application });
  } catch (error) { next(error); }
};

const listApplications = async (req, res, next) => {
  try {
    const applications = await db.findApplicationsByUser(req.user.id);
    res.json({ applications });
  } catch (error) { next(error); }
};

const getApplication = async (req, res, next) => {
  try {
    const application = await db.findApplicationById(req.params.id);
    if (!application || application.userId !== req.user.id) return res.status(404).json({ message: 'Application not found' });
    res.json({ application });
  } catch (error) { next(error); }
};

module.exports = { submitApplication, listApplications, getApplication };
