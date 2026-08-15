const modelRegistry = require('../../models/registry/modelRegistry');
const voiceCapabilities = require('../../models/registry/voiceCapabilities');
const LanguageEngineClient = require('../../services/language/languageEngineClient');
const VoiceLanguageRegistry = require('../../services/language/voiceLanguageRegistry');
function models(req, res) { res.json({ active: modelRegistry.active(), models: modelRegistry.all() }); }
async function languages(req, res, next) {
  try {
    const registry = new VoiceLanguageRegistry({ languageEngine: new LanguageEngineClient(), modelRegistry, capabilities: voiceCapabilities });
    res.json(await registry.list(req.id));
  } catch (error) { next(error); }
}
module.exports = { models, languages };
