const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] || `lang-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  res.setHeader('X-Request-Id', req.id);
  next();
}

module.exports = requestIdMiddleware;
