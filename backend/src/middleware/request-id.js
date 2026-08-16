const { randomUUID } = require('crypto');

function requestId(req, res, next) {
  const supplied = req.get('x-request-id');
  // Keep correlation IDs bounded and printable; never reflect arbitrary header data.
  req.id = supplied && /^[A-Za-z0-9_-]{8,128}$/.test(supplied) ? supplied : randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
}

module.exports = { requestId };
