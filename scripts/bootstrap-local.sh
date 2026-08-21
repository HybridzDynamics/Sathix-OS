#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env — set JWT_SECRET and INTERNAL_SERVICE_TOKEN before production."
fi

if [[ ! -d "${VOICE_MODEL_DIR:-$ROOT/runtime-models}/faster-whisper-small" ]]; then
  echo "Voice models missing. Run: bash scripts/download-voice-models.sh"
fi

echo "Building and starting all SathiX-OS containers..."
docker compose up --build -d

echo "Waiting for Backend health..."
until curl -sf http://localhost:${BACKEND_PORT:-5000}/health >/dev/null 2>&1; do sleep 3; done

echo "Running integration verification..."
node scripts/verify-integration.js || true

cat <<EOF

SathiX-OS containers:
  Backend:       http://localhost:5000
  RAG:           http://localhost:3001
  Language:      http://localhost:4001
  Voice:         http://localhost:4002
  WhatsApp:      http://localhost:4003
  Admin Panel:   http://localhost:3100
  User Panel:    http://localhost:3000

Verify: node scripts/verify-integration.js
EOF
