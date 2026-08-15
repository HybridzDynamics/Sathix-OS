const SpeechToTextService = require('../../services/stt/speechToTextService');
const { createSttProvider } = require('../../services/stt/providerFactory');
const modelRegistry = require('../../models/registry/modelRegistry');
const LanguageEngineClient = require('../../services/language/languageEngineClient');
const LanguageResolutionService = require('../../services/language/languageResolutionService');

async function transcribe(req, res, next) {
  try {
    const service = new SpeechToTextService({ provider: createSttProvider(), modelRegistry });
    const transcript = await service.transcribe(req.audio, { modelId: req.body?.modelId, requestId: req.id, durationMs: req.audio.metadata.durationMs });
    const language = await new LanguageResolutionService({ client: new LanguageEngineClient() }).resolve({ text: transcript.text, sttLanguage: transcript.language, requestId: req.id });
    res.json({ ...transcript, language: language.language, languageConfidence: language.confidence, languageSource: language.source });
  } catch (error) { next(error); }
}
module.exports = { transcribe };
