module.exports = (err, req, res, next) => {
  const multerTooLarge = err?.code === 'LIMIT_FILE_SIZE';
  const status = multerTooLarge ? 413 : (err.statusCode || err.status || 500);
  const code = multerTooLarge ? 'AUDIO_TOO_LARGE' : (err.code || 'INTERNAL_ERROR');
  console.error(JSON.stringify({ event: 'VOICE_REQUEST_FAILED', requestId: req.id, code: err.code, message: err.message }));
  res.status(status).json({ error: { code, message: status < 500 ? err.message : 'Voice service request failed.' }, requestId: req.id });
};
