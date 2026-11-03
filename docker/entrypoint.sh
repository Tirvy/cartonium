#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Running Drizzle migrations..."
  npx drizzle-kit migrate || echo "Warning: drizzle-kit migrate failed (DB may already be up to date)"
fi

mkdir -p "${GAMEBOX_PICS_DIR:-/data/gamebox-pics}"

exec "$@"
