class TextToSpeechProvider {
  async synthesize() { throw new Error('TextToSpeechProvider.synthesize must be implemented'); }
  async health() { return { status: 'unknown' }; }
}
module.exports = TextToSpeechProvider;
