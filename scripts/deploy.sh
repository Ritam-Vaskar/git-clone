#!/usr/bin/env bash
set -euo pipefail

docker compose up -d --build

./scripts/migrate.sh
./scripts/seed.sh

echo "Deployment complete."
