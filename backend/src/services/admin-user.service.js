const ROLES = ['CITIZEN', 'ADMIN', 'SUPER_ADMIN', 'PARTNER'];
const userSelect = {
  id: true, name: true, mobile: true, email: true, role: true, isActive: true,
  language: true, createdAt: true, updatedAt: true, lastActiveAt: true,
  profile: { select: { state: true, district: true } }
};

function pagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

function userWhere(query = {}) {
  const where = {};
  if (query.search) where.OR = ['name', 'mobile', 'email'].map((field) => ({ [field]: { contains: query.search, mode: 'insensitive' } }));
  if (ROLES.includes(query.role)) where.role = query.role;
  if (query.isActive === 'true' || query.isActive === 'false') where.isActive = query.isActive === 'true';
  return where;
}

async function listUsers(prisma, query) {
  const { page, limit, skip } = pagination(query);
  const where = userWhere(query);
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({ where, select: userSelect, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.user.count({ where })
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function getUser(prisma, id) {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

async function updateStatus(prisma, { actorId, actorRole, userId, isActive, requestId }) {
  if (actorId === userId && !isActive) {
    const error = new Error('Administrators cannot deactivate their own account.'); error.status = 409; throw error;
  }
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!target) { const error = new Error('User not found.'); error.status = 404; throw error; }
  if (actorRole !== 'SUPER_ADMIN' && ['ADMIN', 'SUPER_ADMIN'].includes(target.role)) {
    const error = new Error('Only a Super Admin can change an administrator account status.'); error.status = 403; throw error;
  }
  const user = await prisma.user.update({ where: { id: userId }, data: { isActive }, select: userSelect });
  await prisma.auditLog.create({ data: { action: isActive ? 'USER_REACTIVATED' : 'USER_DEACTIVATED', entity: 'User', entityId: userId, details: JSON.stringify({ actorId, requestId }) } });
  return user;
}

async function updateRole(prisma, { actorId, actorRole, userId, role, requestId }) {
  if (!ROLES.includes(role)) { const error = new Error('Unsupported role.'); error.status = 422; throw error; }
  if (actorId === userId) { const error = new Error('Administrators cannot change their own role.'); error.status = 409; throw error; }
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!target) { const error = new Error('User not found.'); error.status = 404; throw error; }
  if (actorRole !== 'SUPER_ADMIN' && (['ADMIN', 'SUPER_ADMIN'].includes(role) || ['ADMIN', 'SUPER_ADMIN'].includes(target.role))) {
    const error = new Error('Only a Super Admin can grant or modify administrator roles.'); error.status = 403; throw error;
  }
  const user = await prisma.user.update({ where: { id: userId }, data: { role }, select: userSelect });
  await prisma.auditLog.create({ data: { action: 'USER_ROLE_CHANGED', entity: 'User', entityId: userId, details: JSON.stringify({ actorId, role, requestId }) } });
  return user;
}

module.exports = { ROLES, listUsers, getUser, updateStatus, updateRole };
