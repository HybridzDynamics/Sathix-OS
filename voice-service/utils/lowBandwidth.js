const config = require('../config');

function enabled(value) { return value === true || value === 'true' || value === '1'; }

function reject(code, message) {
  const error = new Error(message); error.code = code; error.status = 413; throw error;
}

function validate(audio) {
  const { metadata } = audio;
  if (metadata.sizeBytes > config.lowBandwidth.maxAudioBytes) reject('LOW_BANDWIDTH_AUDIO_TOO_LARGE', `Low-bandwidth audio exceeds ${config.lowBandwidth.maxAudioBytes} bytes.`);
  if (metadata.durationMs !== null && metadata.durationMs > config.lowBandwidth.maxAudioDurationMs) reject('LOW_BANDWIDTH_AUDIO_TOO_LONG', `Low-bandwidth audio exceeds ${config.lowBandwidth.maxAudioDurationMs} ms.`);
  if (metadata.bitRate !== null && metadata.bitRate > config.lowBandwidth.maxBitrate) reject('LOW_BANDWIDTH_BITRATE_TOO_HIGH', `Audio bitrate exceeds ${config.lowBandwidth.maxBitrate} bps for low-bandwidth mode.`);
}

module.exports = { enabled, validate };
