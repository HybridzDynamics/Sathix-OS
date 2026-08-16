const express = require('express');
const { getHealth } = require('../controllers/health.controller');
const router = express.Router();

router.get('/health', getHealth);
// Compatibility alias for clients already using the requested misspelling.
router.get('/heath', getHealth);

module.exports = router;
