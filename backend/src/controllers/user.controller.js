const db = require('../db');

const getProfile = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id, true);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { age, gender, state, district, occupation, income, education, category, disability, familyDetails } = req.body;
    const profile = await db.upsertProfile(req.user.id, { age, gender, state, district, occupation, income, education, category, disability, familyDetails });
    res.json({ profile });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile };
