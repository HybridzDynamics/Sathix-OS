class TextToSpeechService {
  constructor({ provider, modelRegistry, languageEngine }) { Object.assign(this, { provider, modelRegistry, languageEngine }); }
  async synthesize(input) {
    if (!input.text || typeof input.text !== 'string' || !input.text.trim()) {
      const error = new Error('Text is required for speech synthesis.');
      error.code = 'TEXT_REQUIRED';
      error.status = 400;
      throw error;
    }
    if (!input.language || typeof input.language !== 'string') {
      const error = new Error('Language is required for speech synthesis.');
      error.code = 'LANGUAGE_REQUIRED';
      error.status = 400;
      throw error;
    }
    let language;
    try { language = (await this.languageEngine.getLanguage(input.language, input.requestId)).language; } catch (cause) {
      const error = new Error(cause.response?.status === 404 ? 'The requested language is not supported.' : 'Language Engine is unavailable.');
      error.code = cause.response?.status === 404 ? 'LANGUAGE_NOT_SUPPORTED' : 'LANGUAGE_ENGINE_UNAVAILABLE';
      error.status = error.code === 'LANGUAGE_NOT_SUPPORTED' ? 422 : 503;
      throw error;
    }
    const model = this.modelRegistry.getTts(input.modelId, language.code);
    if (!model) {
      const error = new Error('Voice processing is not currently available for this language.');
      error.code = 'LANGUAGE_NOT_SUPPORTED';
      error.status = 422;
      throw error;
    }
    return this.provider.synthesize({ ...input, language: language.code }, { model });
  }
}
module.exports = TextToSpeechService;
