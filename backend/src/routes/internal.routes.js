const router = require('express').Router();
const { authenticateService } = require('../middleware/service-auth');
const { voiceQuery, whatsappMessage, whatsappEvent } = require('../controllers/internal.controller');

router.post('/voice/query', authenticateService, voiceQuery);
router.post('/whatsapp/messages', authenticateService, whatsappMessage);
router.post('/whatsapp/events', authenticateService, whatsappEvent);
module.exports = router;
