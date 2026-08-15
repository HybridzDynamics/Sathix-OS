class TextToSpeechService {
  constructor({ provider, modelRegistry, capabilities }) { this.provider = provider; this.modelRegistry = modelRegistry; this.capabilities = capabilities; }
  async synthesize(input) {
    if (!this.capabilities.supports(input.language, 'tts')) {
      const error = new Error('Voice processing is not currently available for this language.');
      error.code = 'LANGUAGE_NOT_SUPPORTED';
      error.status = 422;
      throw error;
    }
    return this.provider.synthesize(input, { model: this.modelRegistry.get(input.modelId, 'tts') });
  }
}
module.exports = TextToSpeechService;
