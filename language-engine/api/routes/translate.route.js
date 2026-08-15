const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translate.controller');

router.post('/', translateController.translate);

module.exports = router;
