const config = require('../../config');
const PythonHttpTtsProvider = require('./pythonHttpTtsProvider');
function createTtsProvider() {
  if (config.providers.tts === 'python-http') return new PythonHttpTtsProvider();
  const error = new Error(`TTS provider '${config.providers.tts}' is not configured.`);
  error.code = 'TTS_NOT_CONFIGURED'; error.status = 503;
  throw error;
}
module.exports = { createTtsProvider };
