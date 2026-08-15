const { inspectAudio } = require('./audioInspector');

class AudioPipeline {
  // Keep the uploaded bytes untouched until a chosen provider requires conversion.
  // This prevents needless decode/re-encode cycles at the API boundary.
  async prepare(file) {
    const metadata = inspectAudio(file.buffer, file.mimetype);
    return { buffer: file.buffer, mimeType: metadata.mimeType, metadata, originalName: file.originalname || null };
  }
}
module.exports = AudioPipeline;
