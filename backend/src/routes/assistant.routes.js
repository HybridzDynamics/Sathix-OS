const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistant.controller');
const { authenticate } = require('../middleware/auth');

router.post('/chat', authenticate, assistantController.chat);
router.get('/history', authenticate, assistantController.history);

module.exports = router;
