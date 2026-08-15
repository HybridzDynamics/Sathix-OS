const express = require('express');
const router = express.Router();
const terminologyController = require('../controllers/terminology.controller');

router.get('/', terminologyController.getTerminology);

module.exports = router;
