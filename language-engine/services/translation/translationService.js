const IndicTrans2Provider = require('./indicTrans2Provider');
const config = require('../../config');

class TranslationService {
  constructor() {
    this.providers = new Map();
    // Register standard default providers
    this.registerProvider('indictrans2', new IndicTrans2Provider());
    this.defaultProvider = config.providers.translation || 'indictrans2';
  }

  /**
   * Register a new translation provider
   * @param {string} name
   * @param {import('./translationProvider')} providerInstance
   */
  registerProvider(name, providerInstance) {
    this.providers.set(name.toLowerCase(), providerInstance);
  }

  /**
   * Get active provider instance
   * @param {string} [name]
   * @returns {import('./translationProvider')}
   */
  getProvider(name) {
    const key = (name || this.defaultProvider).toLowerCase();
    const provider = this.providers.get(key);
    if (!provider) {
      throw new Error(`Translation provider '${key}' is not registered`);
    }
    return provider;
  }

  /**
   * Translate text using the specified or default provider with terminology preservation
   * @param {object} params
   * @param {string} [params.text]
   * @param {string[]} [params.texts]
   * @param {string} params.sourceLanguage
   * @param {string} params.targetLanguage
   * @param {string} [params.provider]
   * @param {boolean} [params.preserveTerminology=true]
   * @param {object} [params.options]
   * @returns {Promise<object>}
   */
  async translate({ text, texts, sourceLanguage, targetLanguage, provider, preserveTerminology = true, options = {} }) {
    if (!text && (!texts || !Array.isArray(texts) || texts.length === 0)) {
      throw new Error('Either "text" (string) or "texts" (array of strings) must be provided');
    }

    const terminologyService = require('../terminology/terminologyService');
    const activeProvider = this.getProvider(provider);

    // Single sentence flow with terminology preservation
    if (text) {
      let textToTranslate = text;
      let placeholderMap = new Map();
      let termsPreserved = [];

      if (preserveTerminology) {
        const masked = terminologyService.maskTerms(text, targetLanguage);
        textToTranslate = masked.maskedText;
        placeholderMap = masked.placeholderMap;
        termsPreserved = masked.termsFound;
      }

      const result = await activeProvider.translate({
        text: textToTranslate,
        sourceLanguage,
        targetLanguage,
        options
      });

      if (preserveTerminology && placeholderMap.size > 0) {
        result.translation = terminologyService.unmaskTerms(result.translation, placeholderMap);
        result.termsPreserved = termsPreserved;
      }

      return result;
    }

    // Batch translation flow
    const results = await activeProvider.translate({
      texts,
      sourceLanguage,
      targetLanguage,
      options
    });

    return results;
  }

  /**
   * List all registered translation providers and their health
   * @returns {Promise<object[]>}
   */
  async listProviders() {
    const list = [];
    for (const [name, provider] of this.providers.entries()) {
      const healthy = await provider.checkHealth();
      list.push({
        name,
        isDefault: name === this.defaultProvider,
        healthy
      });
    }
    return list;
  }
}

module.exports = new TranslationService();
