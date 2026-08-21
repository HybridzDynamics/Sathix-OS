#!/usr/bin/env node
/**
 * Cross-platform voice model downloader (Node 18+).
 * Usage: node scripts/download-voice-models.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const modelDir = process.env.VOICE_MODEL_DIR || path.join(root, 'runtime-models');
const sttDir = path.join(modelDir, 'faster-whisper-small');
const ttsFile = path.join(modelDir, 'piper-en-us-lessac.onnx');

fs.mkdirSync(modelDir, { recursive: true });
console.log(`Voice models directory: ${modelDir}`);

function hasPythonModule(moduleName) {
  const result = spawnSync('python', ['-c', `import ${moduleName}`], { encoding: 'utf8' });
  return result.status === 0;
}

if (!fs.existsSync(sttDir)) {
  console.log('Downloading Faster-Whisper small model...');
  if (!hasPythonModule('huggingface_hub')) {
    spawnSync('pip', ['install', 'huggingface_hub'], { stdio: 'inherit', shell: true });
  }
  const code = `from huggingface_hub import snapshot_download; snapshot_download(repo_id='Systran/faster-whisper-small', local_dir=r'${sttDir.replace(/\\/g, '\\\\')}', local_dir_use_symlinks=False)`;
  const result = spawnSync('python', ['-c', code], { stdio: 'inherit', shell: true });
  if (result.status !== 0) process.exit(result.status || 1);
} else {
  console.log(`STT model already present at ${sttDir}`);
}

if (!fs.existsSync(ttsFile)) {
  console.log('Downloading Piper en_US-lessac voice...');
  const url = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx';
  const result = spawnSync('curl', ['-L', url, '-o', ttsFile], { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    // fallback for Windows without curl
    const ps = spawnSync('powershell', ['-Command', `Invoke-WebRequest -Uri '${url}' -OutFile '${ttsFile}'`], { stdio: 'inherit' });
    if (ps.status !== 0) process.exit(ps.status || 1);
  }
} else {
  console.log(`TTS model already present at ${ttsFile}`);
}

console.log('Voice models ready for Docker mount at', modelDir);
