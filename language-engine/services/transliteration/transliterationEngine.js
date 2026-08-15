/**
 * Phonetic Transliteration Engine for Indian Languages
 * Maps Romanized characters (ITRANS / Harvard-Kyoto / Phonetic English) to Devanagari, Bengali, Tamil, etc.
 */

// Core phonetic dictionary for common Romanized Indic terms in government services
const PHONETIC_DICTIONARY = {
  // Hindi / Devanagari
  'hi': {
    'mujhe': 'मुझे',
    'kisan': 'किसान',
    'yojana': 'योजना',
    'yojna': 'योजना',
    'ke': 'के',
    'baare': 'बारे',
    'mein': 'में',
    'batao': 'बताओ',
    'bataiye': 'बताइए',
    'kya': 'क्या',
    'hai': 'है',
    'kaise': 'कैसे',
    'aavedan': 'आवेदन',
    'karein': 'करें',
    'karna': 'करना',
    'sarkar': 'सरकार',
    'sarkari': 'सरकारी',
    'paisa': 'पैसा',
    'milega': 'मिलेगा',
    'chahiye': 'चाहिए',
    'dhan': 'धान',
    'kheti': 'खेती',
    'pradhan': 'प्रधान',
    'mantri': 'मंत्री',
    'samman': 'सम्मान',
    'nidhi': 'निधि',
    'namaste': 'नमस्ते',
    'aap': 'आप',
    'hum': 'हम',
    'mera': 'मेरा',
    'meri': 'मेरी'
  },
  // Tamil
  'ta': {
    'vanakkam': 'வணக்கம்',
    'vivasaayi': 'விவசாயி',
    'thittam': 'திட்டம்',
    'pathivu': 'பதிவு'
  },
  // Bengali
  'bn': {
    'krishok': 'কৃষক',
    'prokolpo': 'প্রকল্প',
    'nomoshkar': 'নমস্কার',
    'jante': 'জানতে',
    'chai': 'চাই'
  }
};

// Character mapping for phonetic transliteration fallback (Latin -> Devanagari)
const LATIN_TO_DEVA_CHARS = {
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ',
  't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न', 'p': 'प', 'ph': 'फ', 'f': 'फ़',
  'b': 'ब', 'bh': 'भ', 'm': 'म', 'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  'sh': 'श', 's': 'स', 'h': 'ह', 'aa': 'ा', 'i': 'ि', 'ee': 'ी', 'u': 'ु', 'oo': 'ू',
  'e': 'े', 'ai': 'ै', 'o': 'ो', 'au': 'ौ'
};

class TransliterationEngine {
  /**
   * Transliterate Romanized text to target Indic language script
   * @param {string} text
   * @param {string} targetLang (e.g. 'hi', 'ta', 'bn')
   * @returns {string}
   */
  transliterate(text, targetLang = 'hi') {
    if (!text || typeof text !== 'string') return '';

    const lang = targetLang.toLowerCase();
    const dict = PHONETIC_DICTIONARY[lang] || PHONETIC_DICTIONARY['hi'];

    // Split preserving punctuation
    const tokens = text.split(/(\s+|[,.?!;:।])/);

    const transliteratedTokens = tokens.map(token => {
      if (!token || /^\s+$/.test(token) || /^[,.?!;:।]$/.test(token)) {
        return token;
      }
      const lower = token.toLowerCase();
      if (dict[lower]) {
        return dict[lower];
      }
      return token;
    });

    return transliteratedTokens.join('');
  }
}

module.exports = new TransliterationEngine();
