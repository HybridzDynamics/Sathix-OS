const config = require('../config');

function authMiddleware(req, res, next) {
  // If no internalToken configured, bypass in development
  if (!config.internalToken) return next();

  const token = req.headers['x-internal-token'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!token || token !== config.internalToken) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or missing service token',
      requestId: req.id
    });
  }
  next();
}

module.exports = authMiddleware;
