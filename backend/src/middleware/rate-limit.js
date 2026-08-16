function createRateLimiter({ windowMs, max, key = (req) => req.ip }) {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const bucketKey = key(req) || 'unknown';
    const current = buckets.get(bucketKey);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    buckets.set(bucketKey, bucket);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - bucket.count));
    res.setHeader('RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));
    if (bucket.count > max) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.', requestId: req.id });
    }
    next();
  };
}

module.exports = { createRateLimiter };
