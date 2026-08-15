const express = require('express');
const router = express.Router();
const detectController = require('../controllers/detect.controller');

router.post('/', detectController.detect);

module.exports = router;
