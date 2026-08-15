const router = require('express').Router();
const controller = require('../controllers/speech.controller');
const { audioUpload, validateAudio } = require('../../middleware/audioUpload');
router.post('/', audioUpload.single('audio'), validateAudio, controller.transcribe);
module.exports = router;
