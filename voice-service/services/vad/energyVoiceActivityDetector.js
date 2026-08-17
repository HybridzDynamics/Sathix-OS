const VoiceActivityDetector = require('./voiceActivityDetector');

class EnergyVoiceActivityDetector extends VoiceActivityDetector {
  async detect(audio) {
    // A bounded PCM WAV-only fallback. Compressed formats are left to the STT provider.
    if (audio.mimeType !== 'audio/wav' || audio.metadata.codec !== 'pcm' || audio.metadata.bitsPerSample !== 16) {
      return { state: 'unavailable', reason: 'VAD requires decoded 16-bit PCM WAV audio.' };
    }
    let offset = 12;
    const buffer = audio.buffer;
    while (offset + 8 <= buffer.length) {
      const id = buffer.toString('ascii', offset, offset + 4);
      const size = buffer.readUInt32LE(offset + 4);
      const start = offset + 8;
      if (id === 'data') {
        let peak = 0;
        for (let index = start; index + 1 < Math.min(start + size, buffer.length); index += 2) peak = Math.max(peak, Math.abs(buffer.readInt16LE(index)));
        return peak >= 350 ? { state: 'speech', peak } : { state: 'silence', peak };
      }
      offset = start + size + (size % 2);
    }
    return { state: 'unavailable', reason: 'No audio data chunk was found.' };
  }
}

module.exports = EnergyVoiceActivityDetector;
