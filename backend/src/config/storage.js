const path = require('path');

module.exports = {
  storageBackend: process.env.STORAGE_BACKEND || 'local',
  uploadPath: path.join(__dirname, '..', 'uploads'),
};
