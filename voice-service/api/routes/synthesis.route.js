const router = require('express').Router();
const controller = require('../controllers/synthesis.controller');
router.post('/', controller.synthesize);
module.exports = router;
