class SpeechToTextService {
  constructor({ provider, modelRegistry }) { this.provider = provider; this.modelRegistry = modelRegistry; }
  async transcribe(audio, options = {}) {
    const model = this.modelRegistry.getStt(options.modelId);
    if (!model) {
      const error = new Error('The selected speech recognition model is unavailable.');
      error.code = 'MODEL_UNAVAILABLE';
      error.status = 503;
      throw error;
    }
    const result = await this.provider.transcribe(audio, { ...options, model });
    if (!result || typeof result.text !== 'string' || !result.text.trim()) {
      const error = new Error('No speech was detected in the supplied audio.');
      error.code = 'NO_SPEECH_DETECTED';
      error.status = 422;
      throw error;
    }
    return { text: result.text.trim(), language: result.language || null, confidence: Number.isFinite(result.confidence) ? result.confidence : null, durationMs: Number.isFinite(result.durationMs) ? result.durationMs : options.durationMs || null };
  }
}
module.exports = SpeechToTextService;
