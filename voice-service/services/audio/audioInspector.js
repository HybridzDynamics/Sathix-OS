const config = require('../../config');

const signatures = [
  { mimeType: 'audio/wav', matches: (b) => b.length >= 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WAVE' },
  { mimeType: 'audio/mpeg', matches: (b) => b.length >= 3 && (b.toString('ascii', 0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)) },
  { mimeType: 'audio/ogg', matches: (b) => b.length >= 4 && b.toString('ascii', 0, 4) === 'OggS' },
  { mimeType: 'audio/webm', matches: (b) => b.length >= 4 && b.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) },
  { mimeType: 'audio/mp4', matches: (b) => b.length >= 12 && b.toString('ascii', 4, 8) === 'ftyp' }
];

function audioError(code, message, status = 422) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

function inspectWav(buffer) {
  let offset = 12;
  let fmt;
  let dataSize = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    if (dataStart + size > buffer.length) throw audioError('MALFORMED_AUDIO', 'WAV chunk exceeds the audio file boundary.');
    if (id === 'fmt ' && size >= 16) {
      fmt = { format: buffer.readUInt16LE(dataStart), channels: buffer.readUInt16LE(dataStart + 2), sampleRate: buffer.readUInt32LE(dataStart + 4), byteRate: buffer.readUInt32LE(dataStart + 8), bitsPerSample: buffer.readUInt16LE(dataStart + 14) };
    }
    if (id === 'data') dataSize += size;
    offset = dataStart + size + (size % 2);
  }
  if (!fmt || !fmt.byteRate || !dataSize) throw audioError('MALFORMED_AUDIO', 'WAV audio is missing a valid format or data chunk.');
  return { durationMs: Math.round((dataSize / fmt.byteRate) * 1000), bitRate: fmt.byteRate * 8, sampleRate: fmt.sampleRate, channels: fmt.channels, bitsPerSample: fmt.bitsPerSample, codec: fmt.format === 1 ? 'pcm' : `wav-${fmt.format}` };
}

function inspectAudio(buffer, declaredMimeType = '') {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw audioError('EMPTY_AUDIO', 'Audio file is empty.', 400);
  if (buffer.length > config.maxAudioBytes) throw audioError('AUDIO_TOO_LARGE', `Audio exceeds the ${config.maxAudioBytes}-byte limit.`, 413);
  const normalizedDeclaredType = declaredMimeType.toLowerCase().split(';')[0].trim();
  if (normalizedDeclaredType && normalizedDeclaredType !== 'application/octet-stream' && !config.allowedAudioMimeTypes.includes(normalizedDeclaredType)) {
    throw audioError('UNSUPPORTED_AUDIO', 'The declared MIME type is not an enabled audio type.', 415);
  }
  const detected = signatures.find((signature) => signature.matches(buffer));
  if (!detected) throw audioError('UNSUPPORTED_AUDIO', 'Unsupported or malformed audio format.', 415);
  if (!config.allowedAudioMimeTypes.includes(detected.mimeType) && !(detected.mimeType === 'audio/wav' && config.allowedAudioMimeTypes.includes('audio/x-wav'))) {
    throw audioError('UNSUPPORTED_AUDIO', 'This audio format is not enabled.', 415);
  }
  const details = detected.mimeType === 'audio/wav' ? inspectWav(buffer) : { durationMs: null, bitRate: null, sampleRate: null, channels: null, codec: null };
  if (details.durationMs !== null && details.durationMs > config.maxAudioDurationMs) {
    throw audioError('AUDIO_TOO_LONG', `Audio exceeds the ${config.maxAudioDurationMs}-ms duration limit.`, 413);
  }
  return { mimeType: detected.mimeType, declaredMimeType: normalizedDeclaredType || null, sizeBytes: buffer.length, ...details };
}

module.exports = { inspectAudio, audioError };
