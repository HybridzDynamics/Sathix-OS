const router = require('express').Router();
const controller = require('../controllers/registry.controller');
router.get('/languages', controller.languages);
router.get('/models', controller.models);
module.exports = router;
