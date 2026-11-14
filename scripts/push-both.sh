#!/usr/bin/env bash
# Uso: bash scripts/push-both.sh [rama]   (por defecto: main)
# Sube primero a GitHub (origin) y luego a GitLab (gitlab).
set -e
BRANCH="${1:-main}"
git push origin "$BRANCH"
git push gitlab "$BRANCH"
