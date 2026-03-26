#!/usr/bin/env bash
# Postgres 18 へ上げたあとに旧データで起動できないとき、bind mount のデータを捨てて初期化し直す。
# 使い方: cd docker && ./reset-postgres-data.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DATA_DIR="$SCRIPT_DIR/volumes/db/data"

echo "Stopping db container (app-db) if running..."
docker compose -f docker-compose.prod.yml stop db 2>/dev/null || true
docker rm -f app-db 2>/dev/null || true

echo "Removing PostgreSQL data: $DATA_DIR"
rm -rf "$DATA_DIR"

echo "Done. Next: docker compose -f docker-compose.prod.yml up -d db"
