const config = require('../../config');
const SpeechToTextService = require('../../services/stt/speechToTextService');
const { createSttProvider } = require('../../services/stt/providerFactory');
const TextToSpeechService = require('../../services/tts/textToSpeechService');
const { createTtsProvider } = require('../../services/tts/providerFactory');
const LanguageEngineClient = require('../../services/language/languageEngineClient');
const LanguageResolutionService = require('../../services/language/languageResolutionService');
const BackendClient = require('../../services/conversation/backendClient');
const ConversationService = require('../../services/conversation/conversationService');
const modelRegistry = require('../../models/registry/modelRegistry');
const { enabled: lowBandwidthEnabled } = require('../../utils/lowBandwidth');

function parseFilters(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch {
    const error = new Error('filters must be a JSON object.'); error.code = 'INVALID_FILTERS'; error.status = 400; throw error;
  }
}

async function query(req, res, next) {
  try {
    const languageClient = new LanguageEngineClient();
    const lowBandwidth = lowBandwidthEnabled(req.body?.lowBandwidth);
    const audioMode = req.body?.audioMode || (lowBandwidth ? 'none' : 'inline');
    if (!['inline', 'none'].includes(audioMode)) {
      const error = new Error("audioMode must be either 'inline' or 'none'."); error.code = 'INVALID_AUDIO_MODE'; error.status = 400; throw error;
    }
    const service = new ConversationService({
      stt: new SpeechToTextService({ provider: createSttProvider(), modelRegistry }),
      languageEngine: {
        resolve: (input) => new LanguageResolutionService({ client: languageClient }).resolve(input),
        translate: (input, requestId) => languageClient.translate(input, requestId)
      },
      backend: new BackendClient(),
      tts: {
        synthesize: (input) => new TextToSpeechService({ provider: createTtsProvider(), modelRegistry, languageEngine: languageClient }).synthesize(input)
      }
    });
    const result = await service.queryVoice({
      audio: req.audio,
      modelId: req.body?.modelId,
      responseLanguage: req.body?.responseLanguage || null,
      filters: parseFilters(req.body?.filters),
      topK: req.body?.topK ? Number(req.body.topK) : undefined,
      requestId: req.id,
      includeAudio: audioMode === 'inline'
    });
    const audio = result.audio && result.audio.buffer.length <= config.maxResponseAudioBytes
      ? `data:${result.audio.mimeType};base64,${result.audio.buffer.toString('base64')}`
      : null;
    const audioError = result.audio && !audio
      ? { code: 'AUDIO_RESPONSE_TOO_LARGE', message: 'Grounded text is available but generated audio exceeds the response limit.' }
      : result.audioError;
    res.json({ operationId: req.id, resumeSupported: false, lowBandwidth, audioMode, transcript: result.transcript, language: result.language, answer: result.answer, answerLanguage: result.answerLanguage, audio, audioError, sources: result.sources });
  } catch (error) { next(error); }
}
module.exports = { query };
