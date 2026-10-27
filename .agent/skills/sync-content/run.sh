#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../.." || exit 1
node .agent/skills/sync-content/generate.js "$@"
