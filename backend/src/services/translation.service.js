async function translateText(text, targetLanguage) {
  return `${text} [translated to ${targetLanguage}]`;
}

module.exports = { translateText };
