const express = require('express');
const router = express.Router();
const controller = require('../controllers/rag.controller');
const { serviceAuth } = require('../../middleware/serviceAuth');

router.post('/query', serviceAuth, controller.query);
router.post('/reindex', serviceAuth, controller.reindex);
router.post('/ingest', serviceAuth, controller.ingest);
router.get('/health', controller.health);

module.exports = router;
