require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4001,
  host: process.env.HOST || '0.0.0.0',
  pythonServiceUrl: process.env.PYTHON_ML_SERVICE_URL || 'http://127.0.0.1:8001',
  internalToken: process.env.INTERNAL_SERVICE_TOKEN || '',
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000
  },
  providers: {
    translation: process.env.TRANSLATION_PROVIDER || 'indictrans2',
    detection: process.env.DETECTION_PROVIDER || 'fasttext',
    transliteration: process.env.TRANSLITERATION_PROVIDER || 'indic_transliteration',
    embedding: process.env.EMBEDDING_PROVIDER || 'sentence_transformers',
    summarization: process.env.SUMMARIZATION_PROVIDER || 'indic_bart'
  }
};
