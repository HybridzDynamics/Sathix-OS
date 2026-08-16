function errorHandler(err, req, res, next) {
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  const message = status >= 500 ? 'An unexpected server error occurred.' : (err.message || 'Request failed.');
  console.error(JSON.stringify({ event: 'REQUEST_FAILED', requestId: req.id, status, message: err.message }));
  res.status(status).json({ message, requestId: req.id });
}

module.exports = { errorHandler };
