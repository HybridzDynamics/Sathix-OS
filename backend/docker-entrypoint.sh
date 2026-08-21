#!/bin/sh
set -e

echo "Applying Prisma schema..."
npx prisma db push --skip-generate

echo "Starting backend..."
exec node src/server.js
