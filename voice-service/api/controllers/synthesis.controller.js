const config = require('../../config');
const TextToSpeechService = require('../../services/tts/textToSpeechService');
const { createTtsProvider } = require('../../services/tts/providerFactory');
const LanguageEngineClient = require('../../services/language/languageEngineClient');
const modelRegistry = require('../../models/registry/modelRegistry');

async function synthesize(req, res, next) {
  try {
    const { text, language, voice, modelId } = req.body || {};
    if (typeof text === 'string' && text.length > config.maxTtsTextLength) {
      const error = new Error(`Text exceeds the ${config.maxTtsTextLength}-character limit.`); error.code = 'TEXT_TOO_LONG'; error.status = 413; throw error;
    }
    const service = new TextToSpeechService({ provider: createTtsProvider(), modelRegistry, languageEngine: new LanguageEngineClient() });
    const audio = await service.synthesize({ text, language, voice, modelId, requestId: req.id });
    res.setHeader('Content-Type', audio.mimeType);
    res.setHeader('Content-Length', audio.buffer.length);
    res.setHeader('X-TTS-Model', audio.modelId);
    res.send(audio.buffer);
  } catch (error) { next(error); }
}
module.exports = { synthesize };
