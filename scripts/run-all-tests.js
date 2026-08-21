#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const suites = [
  { name: 'backend', cwd: 'backend', command: 'npm test' },
  { name: 'rag-service', cwd: 'rag-service', command: 'npm test' },
  { name: 'language-engine', cwd: 'language-engine', command: 'npm test' },
  { name: 'voice-service', cwd: 'voice-service', command: 'npm test' },
  { name: 'whatsapp-service', cwd: 'whatsapp-service', command: 'npm test' },
  { name: 'scraper-engine', cwd: 'scraper-engine', command: 'npm test' },
];

let failed = 0;
console.log('Running SathiX-OS test suites...\n');

for (const suite of suites) {
  process.stdout.write(`▶ ${suite.name}... `);
  const result = spawnSync(suite.command, {
    cwd: path.join(root, suite.cwd),
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8'
  });
  if (result.status === 0) {
    console.log('PASS');
  } else {
    failed += 1;
    console.log('FAIL');
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

console.log(`\n${suites.length - failed}/${suites.length} suites passed`);
process.exit(failed > 0 ? 1 : 0);
