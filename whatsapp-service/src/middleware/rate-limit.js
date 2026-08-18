function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return (req, res, next) => {
    const key = req.ip || 'unknown'; const now = Date.now(); const bucket = buckets.get(key);
    if (!bucket || bucket.reset <= now) { buckets.set(key, { count: 1, reset: now + windowMs }); return next(); }
    bucket.count += 1;
    if (bucket.count > max) return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many webhook requests.' }, requestId: req.id });
    next();
  };
}
module.exports = { createRateLimiter };
