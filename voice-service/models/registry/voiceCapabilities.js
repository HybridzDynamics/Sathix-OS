// Speech capabilities are an overlay. The Language Engine remains canonical for language metadata.
const capabilities = {};
function all() { return capabilities; }
function supports(language, capability) { return Boolean(capabilities[language]?.[capability]); }
module.exports = { all, supports };
