const config = require('../../config');
function getHealth(req, res) {
  res.json({ status: 'ok', service: config.serviceName, requestId: req.id || null });
}
module.exports = { getHealth };
