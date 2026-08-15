const express = require('express');
const router = express.Router();
const controller = require('../controllers/rag.controller');

router.post('/query', controller.query);
router.post('/reindex', controller.reindex);
router.post('/ingest', controller.ingest);
router.get('/health', controller.health);

module.exports = router;
