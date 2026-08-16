function serviceAuth(req, res, next) {
  const expected = process.env.INTERNAL_SERVICE_TOKEN;
  if (!expected) return next();
  if (req.get('x-internal-token') !== expected) {
    return res.status(401).json({ error: 'Unauthorized service request.' });
  }
  next();
}

module.exports = { serviceAuth };
