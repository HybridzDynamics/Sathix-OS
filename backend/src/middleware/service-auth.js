function authenticateService(req, res, next) {
  const expected = process.env.INTERNAL_SERVICE_TOKEN;
  if (!expected || req.get('x-internal-token') !== expected) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid internal service token.' }, message: 'Invalid internal service token.', requestId: req.id });
  }
  next();
}

module.exports = { authenticateService };
