function synthesize(req, res) {
  res.status(501).json({ error: { code: 'TTS_NOT_CONFIGURED', message: 'Text-to-speech is not configured yet.' }, requestId: req.id });
}
module.exports = { synthesize };
