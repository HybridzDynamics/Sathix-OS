require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me_in_production') {
      throw new Error('JWT_SECRET must be set to a strong, unique value before the backend starts.');
    }
    await prisma.$connect();
    app.locals.prisma = prisma;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
