const router = require('express').Router();
const controller = require('../controllers/conversation.controller');
const { audioUpload, validateAudio } = require('../../middleware/audioUpload');
router.post('/query', audioUpload.single('audio'), validateAudio, controller.query);
module.exports = router;
