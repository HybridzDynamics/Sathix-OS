const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, applicationController.listApplications);
router.post('/', authenticate, applicationController.submitApplication);
router.get('/:id', authenticate, applicationController.getApplication);

module.exports = router;
