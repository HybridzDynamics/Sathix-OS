class LanguageResolutionService {
  constructor({ client }) { this.client = client; }

  async resolve({ text, sttLanguage, requestId }) {
    if (sttLanguage) return { language: sttLanguage, confidence: null, source: 'stt' };
    try {
      const detected = await this.client.detect(text, requestId);
      if (!detected?.language) {
        const error = new Error('Language Engine did not return a language.');
        error.code = 'LANGUAGE_DETECTION_FAILED';
        error.status = 502;
        throw error;
      }
      return { language: detected.language, confidence: detected.confidence ?? null, source: 'language-engine', script: detected.script || null, isRomanized: Boolean(detected.isRomanized) };
    } catch (cause) {
      if (cause.code === 'LANGUAGE_DETECTION_FAILED') throw cause;
      const error = new Error(cause.response?.data?.error || 'Language Engine is unavailable.');
      error.code = cause.code === 'ECONNREFUSED' || cause.code === 'ETIMEDOUT' ? 'LANGUAGE_ENGINE_UNAVAILABLE' : 'LANGUAGE_DETECTION_FAILED';
      error.status = error.code === 'LANGUAGE_ENGINE_UNAVAILABLE' ? 503 : 502;
      throw error;
    }
  }
}
module.exports = LanguageResolutionService;
