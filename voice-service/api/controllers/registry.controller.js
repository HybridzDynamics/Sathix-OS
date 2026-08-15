const modelRegistry = require('../../models/registry/modelRegistry');
const voiceCapabilities = require('../../models/registry/voiceCapabilities');
function models(req, res) { res.json({ active: modelRegistry.active(), models: modelRegistry.all() }); }
function languages(req, res) { res.json({ source: 'language-engine-with-voice-overlay', languages: voiceCapabilities.all() }); }
module.exports = { models, languages };
