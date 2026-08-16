class ConversationService {
  constructor({ stt, languageEngine, backend, tts }) { Object.assign(this, { stt, languageEngine, backend, tts }); }

  async queryBackend({ transcript, language, filters, topK, requestId }) {
    if (!transcript || !transcript.trim()) {
      const error = new Error('A non-empty transcript is required before querying Backend.');
      error.code = 'EMPTY_TRANSCRIPT';
      error.status = 400;
      throw error;
    }
    const response = await this.backend.query({ query: transcript, language, filters: filters || {}, topK: topK || 5 }, requestId);
    if (!response || typeof response.answer !== 'string' || !response.answer.trim()) {
      const error = new Error('Backend returned no grounded answer.');
      error.code = 'BACKEND_RESPONSE_INVALID';
      error.status = 502;
      throw error;
    }
    return { answer: response.answer, sources: Array.isArray(response.sources) ? response.sources : [] };
  }

  async queryVoice({ audio, modelId, responseLanguage, filters, topK, requestId, includeAudio = true }) {
    const transcript = await this.stt.transcribe(audio, { modelId, requestId, durationMs: audio.metadata.durationMs });
    const resolved = await this.languageEngine.resolve({ text: transcript.text, sttLanguage: transcript.language, requestId });
    const backend = await this.queryBackend({ transcript: transcript.text, language: resolved.language, filters, topK, requestId });
    const answerLanguage = responseLanguage || resolved.language;
    let answer = backend.answer;
    if (answerLanguage !== resolved.language) {
      const translated = await this.languageEngine.translate({ text: answer, sourceLanguage: resolved.language, targetLanguage: answerLanguage }, requestId);
      answer = translated.translation;
    }
    if (!includeAudio) return { transcript: transcript.text, language: resolved.language, answer, answerLanguage, sources: backend.sources, audio: null, audioError: null };
    try {
      const synthesized = await this.tts.synthesize({ text: answer, language: answerLanguage, requestId });
      return { transcript: transcript.text, language: resolved.language, answer, answerLanguage, sources: backend.sources, audio: synthesized, audioError: null };
    } catch (error) {
      if (!['LANGUAGE_NOT_SUPPORTED', 'TTS_UNAVAILABLE', 'TTS_FAILURE', 'TTS_NOT_CONFIGURED', 'LANGUAGE_ENGINE_UNAVAILABLE'].includes(error.code)) throw error;
      return { transcript: transcript.text, language: resolved.language, answer, answerLanguage, sources: backend.sources, audio: null, audioError: { code: error.code, message: error.message } };
    }
  }
}
module.exports = ConversationService;
