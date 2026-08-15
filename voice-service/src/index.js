const app = require('./app');
const config = require('../config');

const server = app.listen(config.port, config.host, () => {
  console.log(`SathiX Voice Service listening on ${config.host}:${config.port}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
