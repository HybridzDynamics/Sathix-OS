const language = require('../integrations/language.client');

function normalizeLanguages(data) {
  const raw = data?.languages;
  if (Array.isArray(raw)) {
    return raw.map((entry) => ({
      code: entry.code || entry.iso639 || entry.id,
      name: entry.name || entry.englishName || entry.code,
      nativeName: entry.nativeName || entry.name || entry.code,
      isIndic: Boolean(entry.isIndic),
      script: entry.script || null
    }));
  }
  if (raw && typeof raw === 'object') {
    return Object.entries(raw).map(([code, entry]) => ({
      code: entry.code || code,
      name: entry.name || entry.englishName || code,
      nativeName: entry.nativeName || entry.name || code,
      isIndic: Boolean(entry.isIndic),
      script: entry.script || null
    }));
  }
  return [];
}

async function listLanguages() {
  const data = await language.languages();
  return {
    languages: normalizeLanguages(data),
    source: 'language-engine'
  };
}

module.exports = { listLanguages };
