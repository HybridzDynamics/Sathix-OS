const { randomBytes } = require('crypto');

function createId(prefix = '') {
  return `${prefix}${randomBytes(12).toString('base64url')}`;
}

module.exports = { createId };
