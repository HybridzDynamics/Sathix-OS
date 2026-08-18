const crypto = require('crypto');
function requestId(req, res, next) { req.id = req.get('x-request-id') || crypto.randomUUID(); res.set('x-request-id', req.id); next(); }
module.exports = { requestId };
