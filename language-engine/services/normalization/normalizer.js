/**
 * SathiX Text Normalizer
 * Normalizes colloquial, Romanized, and OCR-corrupted Indian language text.
 */
class TextNormalizer {
  /**
   * Normalize input text (deduplicate repeated characters, standardize spaces, fix punctuation)
   * @param {string} text
   * @returns {string}
   */
  normalize(text) {
    if (!text || typeof text !== 'string') return '';

    let normalized = text.trim();

    // 1. Normalize Unicode (NFKC)
    normalized = normalized.normalize('NFKC');

    // 2. Reduce repeated characters (e.g. "kisaaaan" -> "kisaan", "bataoooo" -> "batao")
    // Keep at most 2 consecutive identical characters for phonetic length in Romanized Indic
    normalized = normalized.replace(/([a-zA-Z])\1{2,}/g, '$1$1');

    // 3. Normalize common Romanized Indic contractions and typos
    const WORD_REPLACEMENTS = {
      'plz': 'please',
      'pls': 'please',
      'thx': 'thanks',
      'k': 'ke',
      'b': 'bhi',
      'bhe': 'bhi',
      'h': 'hai',
      'hn': 'haan',
      'yojna': 'yojana',
      'sarkari': 'sarkari',
      'govt': 'government'
    };

    const words = normalized.split(/\s+/).map(w => {
      const lower = w.toLowerCase();
      return WORD_REPLACEMENTS[lower] || w;
    });

    normalized = words.join(' ');

    // 4. Clean extra spaces around punctuation
    normalized = normalized.replace(/\s+([,.?!;:।])/g, '$1');
    normalized = normalized.replace(/([,.?!;:।])(?=[^\s,.?!;:।])/g, '$1 ');
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }
}

module.exports = new TextNormalizer();
