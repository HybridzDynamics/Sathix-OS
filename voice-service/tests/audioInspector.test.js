const test = require('node:test');
const assert = require('node:assert/strict');
const { inspectAudio } = require('../services/audio/audioInspector');

function wav({ sampleRate = 16000, seconds = 1 } = {}) {
  const dataSize = sampleRate * seconds * 2;
  const file = Buffer.alloc(44 + dataSize);
  file.write('RIFF', 0); file.writeUInt32LE(36 + dataSize, 4); file.write('WAVE', 8);
  file.write('fmt ', 12); file.writeUInt32LE(16, 16); file.writeUInt16LE(1, 20); file.writeUInt16LE(1, 22);
  file.writeUInt32LE(sampleRate, 24); file.writeUInt32LE(sampleRate * 2, 28); file.writeUInt16LE(2, 32); file.writeUInt16LE(16, 34);
  file.write('data', 36); file.writeUInt32LE(dataSize, 40);
  return file;
}

test('inspects a PCM WAV file without altering it', () => {
  const result = inspectAudio(wav(), 'audio/wav');
  assert.equal(result.mimeType, 'audio/wav');
  assert.equal(result.durationMs, 1000);
  assert.equal(result.sampleRate, 16000);
  assert.equal(result.bitRate, 256000);
});

test('rejects empty and malformed audio', () => {
  assert.throws(() => inspectAudio(Buffer.alloc(0)), { code: 'EMPTY_AUDIO' });
  assert.throws(() => inspectAudio(Buffer.from('not audio')), { code: 'UNSUPPORTED_AUDIO' });
});

test('rejects a declared non-audio MIME type', () => {
  assert.throws(() => inspectAudio(wav(), 'text/plain'), { code: 'UNSUPPORTED_AUDIO' });
});
