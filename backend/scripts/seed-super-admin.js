require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const required = ['SUPER_ADMIN_MOBILE', 'SUPER_ADMIN_PASSWORD'];
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required; do not hard-code privileged credentials.`);

async function main() {
  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12);
  const existing = await prisma.user.findUnique({ where: { mobile: process.env.SUPER_ADMIN_MOBILE } });
  if (existing && process.env.SUPER_ADMIN_ALLOW_UPDATE !== 'true') throw new Error('An account already uses this mobile value. Set SUPER_ADMIN_ALLOW_UPDATE=true only when you explicitly intend to update it.');
  const data = { name: process.env.SUPER_ADMIN_NAME || 'SathiX Super Admin', mobile: process.env.SUPER_ADMIN_MOBILE, email: process.env.SUPER_ADMIN_EMAIL || undefined, passwordHash, role: 'SUPER_ADMIN', isActive: true };
  const user = existing ? await prisma.user.update({ where: { id: existing.id }, data, select: { id: true, mobile: true, role: true, isActive: true } }) : await prisma.user.create({ data, select: { id: true, mobile: true, role: true, isActive: true } });
  console.log(JSON.stringify({ createdOrUpdated: user }, null, 2));
  await prisma.$disconnect();
}
main().catch((error) => { console.error(error.message); process.exit(1); });
