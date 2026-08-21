#!/bin/sh
set -e

echo "Applying Prisma schema..."
npx prisma db push --skip-generate

if [ -n "${SUPER_ADMIN_MOBILE:-}" ] && [ -n "${SUPER_ADMIN_PASSWORD:-}" ]; then
  echo "Bootstrapping super admin (if configured)..."
  node scripts/seed-super-admin.js || echo "Super admin bootstrap skipped: $?"
fi

echo "Starting backend..."
exec node src/server.js
