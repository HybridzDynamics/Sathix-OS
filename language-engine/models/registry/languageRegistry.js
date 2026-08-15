const languages = require('./languages.json');

// Alias map for normalization
const ALIASES = {
  // Common names / ISO variants
  'english': 'en',
  'eng': 'en',
  'en-in': 'en',
  'en-us': 'en',
  'hindi': 'hi',
  'hin': 'hi',
  'bengali': 'bn',
  'bangla': 'bn',
  'ben': 'bn',
  'tamil': 'ta',
  'tam': 'ta',
  'telugu': 'te',
  'tel': 'te',
  'marathi': 'mr',
  'mar': 'mr',
  'gujarati': 'gu',
  'guj': 'gu',
  'kannada': 'kn',
  'kan': 'kn',
  'malayalam': 'ml',
  'mal': 'ml',
  'odia': 'or',
  'oriya': 'or',
  'ory': 'or',
  'punjabi': 'pa',
  'pan': 'pa',
  'assamese': 'as',
  'asm': 'as',
  'urdu': 'ur',
  'urd': 'ur',
  'nepali': 'ne',
  'npi': 'ne',
  'nep': 'ne',
  'sanskrit': 'sa',
  'san': 'sa',
  'sindhi': 'sd',
  'snd': 'sd',
  'kashmiri': 'ks',
  'kas': 'ks',
  'konkani': 'kok',
  'gom': 'kok',
  'maithili': 'mai',
  'santali': 'sat',
  'dogri': 'doi',
  'dgo': 'doi',
  'manipuri': 'mni',
  'meitei': 'mni',
  'bodo': 'brx'
};

class LanguageRegistry {
  /**
   * Normalize an input code or language name to standard ISO-639 key
   * @param {string} codeOrName
   * @returns {string|null}
   */
  normalizeCode(codeOrName) {
    if (!codeOrName || typeof codeOrName !== 'string') return null;
    const clean = codeOrName.trim().toLowerCase();
    if (languages[clean]) return clean;
    if (ALIASES[clean]) return ALIASES[clean];
    return null;
  }

  /**
   * Get metadata for a specific language
   * @param {string} codeOrName
   * @returns {object|null}
   */
  getLanguage(codeOrName) {
    const code = this.normalizeCode(codeOrName);
    if (!code) return null;
    return languages[code] || null;
  }

  /**
   * Check if language is supported for a specific capability
   * @param {string} codeOrName
   * @param {string} capability - 'translation', 'indictrans2', 'transliteration', 'detection', 'summarization', 'embeddings'
   * @returns {boolean}
   */
  isSupported(codeOrName, capability = 'translation') {
    const lang = this.getLanguage(codeOrName);
    if (!lang) return false;
    return !!lang[capability];
  }

  /**
   * Get all registered languages
   * @param {object} filter - e.g. { indictrans2: true, isIndic: true }
   * @returns {object}
   */
  getAllLanguages(filter = {}) {
    if (Object.keys(filter).length === 0) {
      return languages;
    }
    const filtered = {};
    for (const [code, info] of Object.entries(languages)) {
      const matches = Object.entries(filter).every(([k, v]) => info[k] === v);
      if (matches) {
        filtered[code] = info;
      }
    }
    return filtered;
  }

  /**
   * Get IndicTrans2 BCP-47 token (e.g. hin_Deva, eng_Latn)
   * @param {string} codeOrName
   * @returns {string|null}
   */
  getIndicTrans2Code(codeOrName) {
    const lang = this.getLanguage(codeOrName);
    return lang ? lang.indictrans2Code : null;
  }

  /**
   * Check if language pair is valid for IndicTrans2 translation
   * (IndicTrans2 supports En -> Indic, Indic -> En, and Indic -> Indic)
   * @param {string} src
   * @param {string} tgt
   * @returns {{ valid: boolean, error?: string }}
   */
  validateTranslationPair(src, tgt) {
    const srcCode = this.normalizeCode(src);
    const tgtCode = this.normalizeCode(tgt);

    if (!srcCode) {
      return { valid: false, error: `Unsupported or unknown source language: '${src}'` };
    }
    if (!tgtCode) {
      return { valid: false, error: `Unsupported or unknown target language: '${tgt}'` };
    }
    if (srcCode === tgtCode) {
      return { valid: false, error: 'Source and target languages cannot be identical' };
    }

    const srcLang = languages[srcCode];
    const tgtLang = languages[tgtCode];

    if (!srcLang.indictrans2 || !tgtLang.indictrans2) {
      return {
        valid: false,
        error: `IndicTrans2 does not support translation between ${srcLang.name} and ${tgtLang.name}`
      };
    }

    return { valid: true, sourceLanguage: srcCode, targetLanguage: tgtCode };
  }
}

module.exports = new LanguageRegistry();
