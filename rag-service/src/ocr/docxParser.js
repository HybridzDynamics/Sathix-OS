const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

async function parseDocx(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = { parseDocx };
