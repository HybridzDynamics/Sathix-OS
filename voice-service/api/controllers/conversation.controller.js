function query(req, res) {
  res.status(501).json({ error: { code: 'VOICE_QUERY_NOT_CONFIGURED', message: 'Voice query orchestration is not configured yet.' }, requestId: req.id });
}
module.exports = { query };
