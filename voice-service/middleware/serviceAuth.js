const config = require('../config');
module.exports = (req, res, next) => {
  if (!config.internalServiceToken) return next();
  const token = req.headers['x-internal-token'];
  if (token !== config.internalServiceToken) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid service token.' }, requestId: req.id });
  next();
};
