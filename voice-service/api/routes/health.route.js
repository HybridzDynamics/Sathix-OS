const router = require('express').Router();
const { getHealth } = require('../controllers/health.controller');
router.get('/', getHealth);
module.exports = router;
