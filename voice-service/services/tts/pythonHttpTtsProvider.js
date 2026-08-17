const axios = require('axios');
const TextToSpeechProvider = require('./textToSpeechProvider');
const config = require('../../config');

class PythonHttpTtsProvider extends TextToSpeechProvider {
  constructor(client = axios) { super(); this.client = client; }
  async synthesize(input, { model }) {
    try {
      const response = await this.client.post(`${config.ttsInferenceUrl}/v1/tts/synthesize`, { text: input.text, language: input.language, voice: input.voice || null }, {
        timeout: config.requestTimeoutMs,
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json', 'X-Model-Id': model.id, ...(input.requestId ? { 'X-Request-Id': input.requestId } : {}) }
      });
      const buffer = Buffer.from(response.data);
      if (!buffer.length) throw new Error('TTS provider returned empty audio.');
      const mimeType = response.headers['content-type'] || '';
      if (!mimeType.startsWith('audio/')) throw new Error('TTS provider returned a non-audio response.');
      return { buffer, mimeType, modelId: model.id };
    } catch (cause) {
      const error = new Error(cause.response?.data?.error?.message || cause.message || 'Text-to-speech provider is unavailable.');
      error.code = cause.code === 'ECONNREFUSED' || cause.code === 'ETIMEDOUT' ? 'TTS_UNAVAILABLE' : 'TTS_FAILURE';
      error.status = error.code === 'TTS_UNAVAILABLE' ? 503 : 502;
      throw error;
    }
  }
}
module.exports = PythonHttpTtsProvider;
