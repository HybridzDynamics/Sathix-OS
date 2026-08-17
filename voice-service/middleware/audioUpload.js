const multer = require('multer');
const config = require('../config');
const AudioPipeline = require('../services/audio/audioPipeline');
const lowBandwidth = require('../utils/lowBandwidth');

const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.maxAudioBytes, files: 1 } });
const pipeline = new AudioPipeline();

async function validateAudio(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error("Submit one multipart file using the 'audio' field.");
      error.code = 'AUDIO_REQUIRED';
      error.status = 400;
      throw error;
    }
    req.audio = await pipeline.prepare(req.file);
    if (req.audio.voiceActivity.state === 'silence') {
      const error = new Error('No speech was detected in the supplied audio.'); error.code = 'NO_SPEECH_DETECTED'; error.status = 422; throw error;
    }
    if (lowBandwidth.enabled(req.body?.lowBandwidth)) lowBandwidth.validate(req.audio);
    next();
  } catch (error) { next(error); }
}

module.exports = { audioUpload, validateAudio };
