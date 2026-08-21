const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async (req, res, next) => {
  try {
    const { name, mobile, email, password, language } = req.body;
    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Name, mobile and password are required' });
    }
    const existingUser = await db.findUserByMobile(mobile);
    if (existingUser) return res.status(400).json({ message: 'Mobile already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({ name, mobile, email, passwordHash, language: language ? language.toUpperCase() : 'ENGLISH' });
    res.status(201).json({ id: user.id, name: user.name, mobile: user.mobile, role: user.role });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) return res.status(400).json({ message: 'Mobile and password are required' });
    const user = await db.findUserByMobile(mobile);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'This account has been deactivated' });
    await db.updateUser(user.id, { lastActiveAt: new Date() });
    if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      await db.createAuditLog({ action: 'ADMIN_LOGIN', entity: 'User', entityId: user.id, details: JSON.stringify({ actorId: user.id, requestId: req.id }) }).catch(() => undefined);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, mobile: user.mobile, role: user.role, language: user.language } });
  } catch (error) { next(error); }
};

module.exports = { register, login };
