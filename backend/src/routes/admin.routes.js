const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// This is the backend enforcement point used by the Admin Panel after login.
router.get('/session', authenticate, authorize(['ADMIN']), adminController.getSession);
router.get('/overview', authenticate, authorize(['ADMIN']), adminController.getOverview);

module.exports = router;
