const catalog = require('./models.json');
const config = require('../../config');
function all() { return catalog.models; }
function get(id, type) {
  const selected = id || (type === 'tts' ? catalog.activeTtsModel : catalog.activeSttModel);
  return catalog.models.find((model) => model.id === selected) || null;
}
function active() { return { stt: activeStt(), tts: config.models.activeTts || catalog.activeTtsModel || null }; }
function activeStt() { return config.models.activeStt || catalog.activeSttModel || null; }
function getStt(id) { return catalog.models.find((model) => model.id === (id || activeStt()) && model.capabilities?.includes('stt')) || null; }
module.exports = { all, get, getStt, active };
