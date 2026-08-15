/**
 * Abstract Base Class for Translation Providers
 */
class TranslationProvider {
  constructor(name) {
    if (new.target === TranslationProvider) {
      throw new TypeError('Cannot construct TranslationProvider instances directly');
    }
    this.name = name;
  }

  /**
   * Translate a single text string or array of strings
   * @param {object} params
   * @param {string} [params.text]
   * @param {string[]} [params.texts]
   * @param {string} params.sourceLanguage
   * @param {string} params.targetLanguage
   * @param {object} [params.options]
   * @returns {Promise<object>}
   */
  async translate(params) {
    throw new Error('Method translate() must be implemented by subclass');
  }

  /**
   * Check health of the underlying model / inference service
   * @returns {Promise<boolean>}
   */
  async checkHealth() {
    throw new Error('Method checkHealth() must be implemented by subclass');
  }
}

module.exports = TranslationProvider;
