const express = require('express');
const router = express.Router();
const languageController = require('../controllers/language.controller');

router.get('/', languageController.getAllLanguages);
router.get('/:code', languageController.getLanguageByCode);

module.exports = router;
