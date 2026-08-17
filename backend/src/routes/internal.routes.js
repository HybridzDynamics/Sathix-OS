const router = require('express').Router();
const { authenticateService } = require('../middleware/service-auth');
const { voiceQuery } = require('../controllers/internal.controller');

router.post('/voice/query', authenticateService, voiceQuery);
module.exports = router;
