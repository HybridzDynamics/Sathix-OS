const express = require('express');
const router = express.Router();
const transliterateController = require('../controllers/transliterate.controller');

router.post('/', transliterateController.transliterate);

module.exports = router;
