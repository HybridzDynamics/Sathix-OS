const crypto = require('crypto');
module.exports = (req, res, next) => {
  req.id = req.headers['x-request-id'] || `voice-${crypto.randomUUID()}`;
  res.setHeader('X-Request-Id', req.id);
  next();
};
