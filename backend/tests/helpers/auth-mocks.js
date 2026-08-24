const db = require('../../src/db');

const TEST_USERS = {
  'citizen-1': { id: 'citizen-1', role: 'CITIZEN', isActive: true },
  'admin-1': { id: 'admin-1', role: 'ADMIN', isActive: true },
  'super-admin-1': { id: 'super-admin-1', role: 'SUPER_ADMIN', isActive: true },
  'user-1': { id: 'user-1', role: 'CITIZEN', isActive: true },
};

let originalFindUserAuthById;

function installAuthMocks(extraUsers = {}) {
  const users = { ...TEST_USERS, ...extraUsers };
  if (!originalFindUserAuthById) {
    originalFindUserAuthById = db.findUserAuthById;
  }
  db.findUserAuthById = async (id) => users[id] || null;
}

function restoreAuthMocks() {
  if (originalFindUserAuthById) {
    db.findUserAuthById = originalFindUserAuthById;
    originalFindUserAuthById = null;
  }
}

module.exports = { installAuthMocks, restoreAuthMocks, TEST_USERS };
