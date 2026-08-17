const router = require('express').Router();
const { getHealth, readiness } = require('../controllers/health.controller');
router.get('/', getHealth);
router.get('/ready', readiness);
module.exports = router;
