const jwt = require('jsonwebtoken');
const db = require('../db');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findUserAuthById(payload.id);
    if (!user || !user.isActive) return res.status(401).json({ message: 'Account is inactive or unavailable' });
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const allowed = roles.includes(req.user.role) || (req.user.role === 'SUPER_ADMIN' && roles.includes('ADMIN'));
    if (roles.length && !allowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

module.exports = { authenticate, authorize };
