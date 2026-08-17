const axios = require('axios');
const SpeechToTextProvider = require('./speechToTextProvider');
const config = require('../../config');

class PythonHttpSttProvider extends SpeechToTextProvider {
  constructor(client = axios) { super(); this.client = client; }

  async transcribe(audio, { model, requestId, durationMs }) {
    try {
      const response = await this.client.post(`${config.sttInferenceUrl}/v1/stt/transcribe`, audio.buffer, {
        timeout: config.requestTimeoutMs,
        maxBodyLength: config.maxAudioBytes,
        headers: {
          'Content-Type': audio.mimeType,
          'Content-Length': audio.buffer.length,
          'X-Model-Id': model.id,
          'X-Audio-Mime-Type': audio.mimeType,
          ...(requestId ? { 'X-Request-Id': requestId } : {})
        }
      });
      if (!response.data || typeof response.data.text !== 'string') {
        const error = new Error('Speech recognition provider returned an invalid response.'); error.code = 'STT_FAILURE'; error.status = 502; throw error;
      }
      return { ...response.data, durationMs: response.data.durationMs ?? durationMs ?? audio.metadata?.durationMs };
    } catch (cause) {
      const error = new Error(cause.response?.data?.error?.message || 'Speech recognition provider is unavailable.');
      error.code = cause.code === 'ECONNREFUSED' || cause.code === 'ETIMEDOUT' ? 'STT_UNAVAILABLE' : 'STT_FAILURE';
      error.status = error.code === 'STT_UNAVAILABLE' ? 503 : 502;
      throw error;
    }
  }
}
module.exports = PythonHttpSttProvider;
