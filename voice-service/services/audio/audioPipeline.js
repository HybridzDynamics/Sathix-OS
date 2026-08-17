const { inspectAudio } = require('./audioInspector');
const EnergyVoiceActivityDetector = require('../vad/energyVoiceActivityDetector');

class AudioPipeline {
  constructor({ vad = new EnergyVoiceActivityDetector() } = {}) { this.vad = vad; }
  // Keep the uploaded bytes untouched until a chosen provider requires conversion.
  // This prevents needless decode/re-encode cycles at the API boundary.
  async prepare(file) {
    const metadata = inspectAudio(file.buffer, file.mimetype);
    const audio = { buffer: file.buffer, mimeType: metadata.mimeType, metadata, originalName: file.originalname || null };
    audio.voiceActivity = await this.vad.detect(audio);
    return audio;
  }
}
module.exports = AudioPipeline;
