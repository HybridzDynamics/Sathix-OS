require('dotenv').config();
const app = require('./app');
const db = require('./db');
const { initSchema } = require('./db/init');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me_in_production') {
      throw new Error('JWT_SECRET must be set to a strong, unique value before the backend starts.');
    }
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set before the backend starts.');
    }
    await initSchema();
    await db.ping();
    app.locals.db = db;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
