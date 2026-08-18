const crypto = require('crypto');
module.exports = (req, res, next) => {
  const supplied = req.headers['x-request-id'];
  req.id = supplied && /^[A-Za-z0-9_-]{8,128}$/.test(supplied) ? supplied : `voice-${crypto.randomUUID()}`;
  res.setHeader('X-Request-Id', req.id);
  next();
};
