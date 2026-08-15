const config = require('../../config');
const PythonHttpSttProvider = require('./pythonHttpSttProvider');

function createSttProvider() {
  if (config.providers.stt === 'python-http') return new PythonHttpSttProvider();
  const error = new Error(`STT provider '${config.providers.stt}' is not configured.`);
  error.code = 'STT_NOT_CONFIGURED';
  error.status = 503;
  throw error;
}
module.exports = { createSttProvider };
