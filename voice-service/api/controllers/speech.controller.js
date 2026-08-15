const SpeechToTextService = require('../../services/stt/speechToTextService');
const { createSttProvider } = require('../../services/stt/providerFactory');
const modelRegistry = require('../../models/registry/modelRegistry');

async function transcribe(req, res, next) {
  try {
    const service = new SpeechToTextService({ provider: createSttProvider(), modelRegistry });
    const transcript = await service.transcribe(req.audio, { modelId: req.body?.modelId, requestId: req.id, durationMs: req.audio.metadata.durationMs });
    res.json(transcript);
  } catch (error) { next(error); }
}
module.exports = { transcribe };
