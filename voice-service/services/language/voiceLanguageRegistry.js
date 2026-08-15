class VoiceLanguageRegistry {
  constructor({ languageEngine, modelRegistry, capabilities }) { Object.assign(this, { languageEngine, modelRegistry, capabilities }); }

  async list(requestId) {
    try {
      const response = await this.languageEngine.getLanguages(requestId);
      const models = this.modelRegistry.all();
      const languages = Object.fromEntries(Object.entries(response.languages || {}).map(([code, language]) => {
        const stt = models.some((model) => model.capabilities?.includes('stt') && model.supportedLanguages?.includes(code));
        return [code, { ...language, stt, tts: this.capabilities.supports(code, 'tts') }];
      }));
      return { source: 'language-engine-with-voice-overlay', total: Object.keys(languages).length, languages };
    } catch (cause) {
      const error = new Error('Language Engine language registry is unavailable.');
      error.code = 'LANGUAGE_ENGINE_UNAVAILABLE';
      error.status = 503;
      throw error;
    }
  }
}
module.exports = VoiceLanguageRegistry;
