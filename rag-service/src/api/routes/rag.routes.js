const express = require('express');
const router = express.Router();
const controller = require('../controllers/rag.controller');

router.post('/query', controller.query);
router.post('/reindex', controller.reindex);

module.exports = router;
