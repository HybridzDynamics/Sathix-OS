$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env — set JWT_SECRET and INTERNAL_SERVICE_TOKEN before production.'
}

$modelDir = if ($env:VOICE_MODEL_DIR) { $env:VOICE_MODEL_DIR } else { Join-Path $Root 'runtime-models' }
if (-not (Test-Path (Join-Path $modelDir 'faster-whisper-small'))) {
  Write-Host 'Voice models missing. Run: .\scripts\download-voice-models.ps1'
}

Write-Host 'Building and starting all SathiX-OS containers...'
docker compose up --build -d

Write-Host 'Waiting for Backend...'
$backend = 'http://localhost:5000/health'
for ($i = 0; $i -lt 30; $i++) {
  try { Invoke-WebRequest -Uri $backend -UseBasicParsing -TimeoutSec 3 | Out-Null; break } catch { Start-Sleep -Seconds 3 }
}

node scripts/verify-integration.js

Write-Host @'

SathiX-OS containers:
  Backend:       http://localhost:5000
  RAG:           http://localhost:3001
  Language:      http://localhost:4001
  Voice:         http://localhost:4002
  WhatsApp:      http://localhost:4003
  Admin Panel:   http://localhost:3100
  User Panel:    http://localhost:3000
'@
