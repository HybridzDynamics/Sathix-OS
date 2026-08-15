const app = require('./app');
const config = require('../config');

const server = app.listen(config.port, config.host, () => {
  console.log(`====================================================`);
  console.log(`🌐 SathiX Language Engine running on port ${config.port}`);
  console.log(`📡 Python ML Service configured at: ${config.pythonServiceUrl}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => console.log('HTTP server closed'));
});
