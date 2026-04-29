#!/usr/bin/env bash
set -euo pipefail

npm install

cp -n apps/api/.env.example apps/api/.env || true
cp -n apps/web/.env.example apps/web/.env || true

echo "Setup complete. Run ./scripts/migrate.sh then ./scripts/seed.sh."
