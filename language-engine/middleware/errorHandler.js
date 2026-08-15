function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] [${req.id || 'N/A'}] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    error: message,
    statusCode,
    requestId: req.id || null,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
