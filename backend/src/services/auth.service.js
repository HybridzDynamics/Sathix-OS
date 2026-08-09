const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(prisma, data) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      passwordHash,
      language: data.language || 'ENGLISH',
    },
  });
}

async function login(prisma, mobile, password) {
  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
}

module.exports = { register, login };
