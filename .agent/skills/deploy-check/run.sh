#!/usr/bin/env bash
# Verifies the GitHub Pages workflow still matches the required shape.
set -uo pipefail
cd "$(dirname "$0")/../../.." || exit 1
quiet=${1:-}
f=.github/workflows/deploy.yml
fails=0
need() {
  if grep -qF -- "$2" "$f"; then [ "$quiet" = "--quiet" ] || echo "  ✓ $1"; else echo "  ✗ FAIL (deploy.yml): $1"; fails=$((fails + 1)); fi
}
[ -f "$f" ] || { echo "  ✗ FAIL: $f missing"; exit 1; }
need "triggers on push to main" "branches: [main]"
need "manual trigger" "workflow_dispatch:"
need "pages: write permission" "pages: write"
need "id-token: write permission" "id-token: write"
need "contents: read permission" "contents: read"
need "concurrency group" "group: pages"
need "checkout@v4" "actions/checkout@v4"
need "configure-pages@v5" "actions/configure-pages@v5"
need "upload-pages-artifact@v3" "actions/upload-pages-artifact@v3"
need "deploy-pages@v4" "actions/deploy-pages@v4"
need "uploads the repo root" "path: '.'"
[ "$fails" -eq 0 ] && { [ "$quiet" = "--quiet" ] && echo "  ✓ deploy.yml shape" || echo "✓ deploy.yml OK"; } || exit 1
