$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'Created .env from .env.example — edit JWT_SECRET and INTERNAL_SERVICE_TOKEN before production use.'
}

Write-Host 'Starting SathiX-OS stack...'
docker compose up --build -d postgres redis qdrant backend rag-service scraper-worker

Write-Host ''
Write-Host 'SathiX-OS services starting:'
Write-Host '  Backend:  http://localhost:5000'
Write-Host '  RAG:      http://localhost:3001'
Write-Host ''
Write-Host 'Optional profiles:'
Write-Host '  docker compose --profile language --profile voice --profile whatsapp up -d'
