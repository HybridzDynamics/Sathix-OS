const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// This is the backend enforcement point used by the Admin Panel after login.
router.get('/session', authenticate, authorize(['ADMIN']), adminController.getSession);
router.get('/overview', authenticate, authorize(['ADMIN']), adminController.getOverview);
router.get('/users', authenticate, authorize(['ADMIN']), adminController.listUsers);
router.get('/users/:id', authenticate, authorize(['ADMIN']), adminController.getUser);
router.patch('/users/:id/status', authenticate, authorize(['ADMIN']), adminController.updateUserStatus);
router.patch('/users/:id/role', authenticate, authorize(['ADMIN']), adminController.updateUserRole);
router.get('/schemes', authenticate, authorize(['ADMIN']), adminController.listSchemes);
router.patch('/schemes/:id/status', authenticate, authorize(['ADMIN']), adminController.updateSchemeStatus);
router.post('/schemes/:id/reindex', authenticate, authorize(['ADMIN']), adminController.reindexScheme);

module.exports = router;
