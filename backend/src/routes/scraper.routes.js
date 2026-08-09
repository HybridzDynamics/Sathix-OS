const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraper.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/start', authenticate, authorize(['ADMIN']), scraperController.startScraper);
router.get('/status', authenticate, authorize(['ADMIN']), scraperController.getStatus);

module.exports = router;
