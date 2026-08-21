#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — edit JWT_SECRET and INTERNAL_SERVICE_TOKEN before production use."
fi

echo "Starting SathiX-OS stack..."
docker compose up --build -d postgres redis qdrant

echo "Waiting for PostgreSQL..."
until docker compose exec -T postgres pg_isready -U "${POSTGRES_USER:-sathix}" >/dev/null 2>&1; do sleep 2; done

echo "Applying database schema..."
docker compose run --rm backend npx prisma db push --skip-generate

echo "Starting application services..."
docker compose up --build -d backend rag-service scraper-worker

echo ""
echo "SathiX-OS is starting:"
echo "  Backend:  http://localhost:${BACKEND_PORT:-5000}"
echo "  RAG:      http://localhost:${RAG_PORT:-3001}"
echo ""
echo "Optional profiles:"
echo "  docker compose --profile language --profile voice --profile whatsapp up -d"
