class SpeechToTextProvider {
  async transcribe() { throw new Error('SpeechToTextProvider.transcribe must be implemented'); }
  async health() { return { status: 'unknown' }; }
}
module.exports = SpeechToTextProvider;
