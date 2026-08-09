const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/scheme.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, schemeController.getSchemes);
router.post('/recommend', authenticate, schemeController.recommendSchemes);

module.exports = router;
