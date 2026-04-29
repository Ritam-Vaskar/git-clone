#!/usr/bin/env bash
set -euo pipefail

cd apps/api

npx prisma migrate deploy
npx prisma generate
