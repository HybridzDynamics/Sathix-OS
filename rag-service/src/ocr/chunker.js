function chunkText(text, maxWords = 200) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks = [];
  let currentChunk = [];
  
  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.length >= maxWords) {
      chunks.push(currentChunk.join(' '));
      // Overlap of 20 words
      currentChunk = currentChunk.slice(-20);
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  return chunks;
}

module.exports = { chunkText };
