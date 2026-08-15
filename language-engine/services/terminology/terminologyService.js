const path = require('path');
const fs = require('fs');

class TerminologyService {
  constructor() {
    this.dictionaries = {
      schemes: require('../../datasets/terminology/schemes.json'),
      ministries: require('../../datasets/terminology/ministries.json'),
      certificates: require('../../datasets/terminology/certificates.json'),
      occupations: require('../../datasets/terminology/occupations.json'),
      governmentTerms: require('../../datasets/terminology/government_terms.json')
    };

    this.termsIndex = [];
    this._buildAliasIndex();
  }

  _buildAliasIndex() {
    this.termsIndex = [];

    for (const [category, dict] of Object.entries(this.dictionaries)) {
      for (const [termKey, data] of Object.entries(dict)) {
        const canonical = data.canonicalName || termKey;
        const aliases = new Set([termKey, canonical, ...(data.aliases || [])]);

        for (const alias of aliases) {
          if (!alias || alias.length < 2) continue;
          this.termsIndex.push({
            alias,
            aliasLower: alias.toLowerCase(),
            canonical,
            category,
            translations: data.translations || {}
          });
        }
      }
    }

    // Sort by alias length descending so longer phrases match before shorter sub-terms
    this.termsIndex.sort((a, b) => b.alias.length - a.alias.length);
  }

  /**
   * Mask official terminology in text with placeholders to protect from translation corruption
   * @param {string} text
   * @param {string} targetLang (e.g. 'hi', 'ta', 'bn')
   * @returns {{ maskedText: string, placeholderMap: Map<string, string>, termsFound: string[] }}
   */
  maskTerms(text, targetLang) {
    if (!text || typeof text !== 'string') {
      return { maskedText: text, placeholderMap: new Map(), termsFound: [] };
    }

    const placeholderMap = new Map();
    const termsFound = [];
    let maskedText = text;
    let placeholderCounter = 0;

    for (const item of this.termsIndex) {
      const translation = item.translations[targetLang];
      if (!translation) continue;

      // Case-insensitive regex with word boundary check
      const escaped = item.alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

      if (regex.test(maskedText)) {
        const placeholder = `__SATHIX_TERM_${placeholderCounter++}__`;
        maskedText = maskedText.replace(regex, placeholder);
        placeholderMap.set(placeholder, translation);
        termsFound.push(item.canonical);
      }
    }

    return {
      maskedText,
      placeholderMap,
      termsFound: [...new Set(termsFound)]
    };
  }

  /**
   * Unmask placeholders back to official government terminology
   * @param {string} text
   * @param {Map<string, string>} placeholderMap
   * @returns {string}
   */
  unmaskTerms(text, placeholderMap) {
    if (!text || !placeholderMap || placeholderMap.size === 0) {
      return text;
    }

    let unmasked = text;
    for (const [placeholder, translation] of placeholderMap.entries()) {
      // Regex replace placeholder (including potential whitespace adjustments)
      const regex = new RegExp(placeholder, 'g');
      unmasked = unmasked.replace(regex, translation);
    }
    return unmasked;
  }

  /**
   * Get all registered terms or search for a specific term
   * @param {string} [category]
   * @returns {object}
   */
  getTerms(category) {
    if (category && this.dictionaries[category]) {
      return { [category]: this.dictionaries[category] };
    }
    return this.dictionaries;
  }
}

module.exports = new TerminologyService();
