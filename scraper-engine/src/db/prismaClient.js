const { PrismaClient } = require('@prisma/client');

/**
 * Prisma client singleton.
 * Reads `DATABASE_URL` from environment (use the same DB as the backend).
 * @module db/prismaClient
 */

let prisma = null;

function getPrisma() {
  if (prisma) return prisma;
  prisma = new PrismaClient();
  return prisma;
}

module.exports = { getPrisma };
