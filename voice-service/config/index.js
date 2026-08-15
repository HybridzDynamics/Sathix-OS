require('dotenv').config();

const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

module.exports = {
  serviceName: 'sathix-voice-service',
  port: number('PORT', 4002),
  host: process.env.HOST || '0.0.0.0',
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || '',
  languageEngineUrl: process.env.LANGUAGE_ENGINE_URL || 'http://localhost:4001',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  requestTimeoutMs: number('REQUEST_TIMEOUT_MS', 15000),
  maxAudioBytes: number('MAX_AUDIO_BYTES', 10 * 1024 * 1024),
  maxAudioDurationMs: number('MAX_AUDIO_DURATION_MS', 120000),
  allowedAudioMimeTypes: (process.env.ALLOWED_AUDIO_MIME_TYPES || 'audio/wav,audio/x-wav,audio/mpeg,audio/ogg,audio/webm,audio/mp4,audio/aac').split(',').map((value) => value.trim()),
  rateLimit: { windowMs: number('RATE_LIMIT_WINDOW_MS', 60000), max: number('RATE_LIMIT_MAX', 60) },
  providers: {
    stt: process.env.STT_PROVIDER || 'unconfigured',
    tts: process.env.TTS_PROVIDER || 'unconfigured',
    vad: process.env.VAD_PROVIDER || 'unconfigured'
  },
  sttInferenceUrl: process.env.STT_INFERENCE_URL || 'http://127.0.0.1:8002',
  models: { activeStt: process.env.ACTIVE_STT_MODEL || '', activeTts: process.env.ACTIVE_TTS_MODEL || '' }
};
