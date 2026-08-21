$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ModelDir = if ($env:VOICE_MODEL_DIR) { $env:VOICE_MODEL_DIR } else { Join-Path $Root 'runtime-models' }
$SttDir = Join-Path $ModelDir 'faster-whisper-small'
$TtsFile = Join-Path $ModelDir 'piper-en-us-lessac.onnx'

New-Item -ItemType Directory -Force -Path $ModelDir | Out-Null

Write-Host "Voice models directory: $ModelDir"

if (-not (Test-Path $SttDir)) {
  Write-Host 'Downloading Faster-Whisper small model...'
  pip install huggingface_hub --quiet
  python -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='Systran/faster-whisper-small', local_dir=r'$SttDir', local_dir_use_symlinks=False)"
} else {
  Write-Host "STT model already present at $SttDir"
}

if (-not (Test-Path $TtsFile)) {
  Write-Host 'Downloading Piper en_US-lessac voice...'
  $url = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx'
  Invoke-WebRequest -Uri $url -OutFile $TtsFile
} else {
  Write-Host "TTS model already present at $TtsFile"
}

Write-Host 'Done. Mount with VOICE_MODEL_DIR=' $ModelDir
