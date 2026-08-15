const multer = require('multer');
const config = require('../config');
const AudioPipeline = require('../services/audio/audioPipeline');

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
    next();
  } catch (error) { next(error); }
}

module.exports = { audioUpload, validateAudio };
