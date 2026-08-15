const axios = require('axios');
const config = require('../../config');
const languageRegistry = require('../../models/registry/languageRegistry');

// Unicode ranges for local fast identification
const SCRIPT_RANGES = {
  Devanagari: [0x0900, 0x097F],
  Bengali: [0x0980, 0x09FF],
  Gurmukhi: [0x0A00, 0x0A7F],
  Gujarati: [0x0A80, 0x0AFF],
  Odia: [0x0B00, 0x0B7F],
  Tamil: [0x0B80, 0x0BFF],
  Telugu: [0x0C00, 0x0C7F],
  Kannada: [0x0C80, 0x0CFF],
  Malayalam: [0x0D00, 0x0D7F],
  Arabic: [0x0600, 0x06FF]
};

const SCRIPT_TO_LANG = {
  Devanagari: 'hi',
  Bengali: 'bn',
  Tamil: 'ta',
  Telugu: 'te',
  Kannada: 'kn',
  Malayalam: 'ml',
  Gujarati: 'gu',
  Gurmukhi: 'pa',
  Odia: 'or',
  Arabic: 'ur'
};

const HINGLISH_WORDS = new Set([
  'kisan', 'yojana', 'yojna', 'mujhe', 'chahiye', 'batao', 'kaise', 'karein',
  'apply', 'sarkar', 'sarkari', 'paisa', 'milega', 'aavedan', 'kya', 'hai',
  'nahi', 'karo', 'mera', 'meri', 'hum', 'aap', 'dhan', 'kheti', 'labh'
]);

class DetectionService {
  /**
   * Detect language and script of input text
   * @param {string} text
   * @returns {Promise<{ language: string, confidence: number, script: string, isRomanized: boolean, model: string }>}
   */
  async detect(text) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new Error('Text parameter must be a non-empty string');
    }

    const trimmed = text.trim();

    try {
      const res = await axios.post(`${config.pythonServiceUrl}/detect`, { text: trimmed }, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      return res.data;
    } catch {
      // Local fallback detection
      return this._localDetect(trimmed);
    }
  }

  _localDetect(text) {
    const counts = {};
    let totalIndic = 0;

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      for (const [script, [start, end]] of Object.entries(SCRIPT_RANGES)) {
        if (code >= start && code <= end) {
          counts[script] = (counts[script] || 0) + 1;
          totalIndic++;
          break;
        }
      }
    }

    if (totalIndic > 0) {
      const dominantScript = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      const lang = SCRIPT_TO_LANG[dominantScript] || 'hi';
      return {
        language: lang,
        confidence: 0.98,
        script: dominantScript,
        isRomanized: false,
        model: 'unicode-script-heuristic'
      };
    }

    // Latin Script: check for Romanized Indic (Hinglish)
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    let hinglishCount = 0;
    for (const w of words) {
      if (HINGLISH_WORDS.has(w)) hinglishCount++;
    }

    if (hinglishCount > 0 && hinglishCount >= words.length * 0.2) {
      return {
        language: 'hi',
        detectedCode: 'hi-Latn',
        confidence: 0.92,
        script: 'Latin',
        isRomanized: true,
        model: 'hinglish-lexicon-heuristic'
      };
    }

    return {
      language: 'en',
      confidence: 0.95,
      script: 'Latin',
      isRomanized: false,
      model: 'latin-english-heuristic'
    };
  }
}

module.exports = new DetectionService();
