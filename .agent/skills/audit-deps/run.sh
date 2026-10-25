#!/usr/bin/env bash
# Confirms index.html makes no network requests except the documented, opt-in ad loader.
set -uo pipefail
cd "$(dirname "$0")/../../.." || exit 1
quiet=${1:-}
fails=0
flag() { echo "  ✗ FAIL (deps): $1"; fails=$((fails + 1)); }

# Every absolute URL must be on the allowlist: plain links, metadata, or the ad providers
allow='https://(www\.)?serverlessvc\.com|https://nisvasa\.com|https://schema\.org|https://docs\.github\.com|https://media\.ethicalads\.io|https://pagead2\.googlesyndication\.com|http://www\.w3\.org'
unknown=$(grep -oE 'https?://[^"'"'"' )<>`]+' index.html | grep -vE "^($allow)" | sort -u)
[ -n "$unknown" ] && flag "unexpected URLs: ${unknown//$'\n'/ }"

grep -qE '<script[^>]+src=' index.html && flag "static <script src> found"
grep -qE '<link[^>]*rel="(stylesheet|preconnect|preload)"' index.html && flag "external stylesheet/preconnect found"
grep -qE '@import|@font-face' index.html && flag "@import or @font-face found"
grep -qE '\bfetch\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket|EventSource' index.html && flag "network API call found"
grep -qE 'localStorage|sessionStorage|indexedDB|document\.cookie' index.html && flag "browser storage or cookies used"
[ -f package.json ] && flag "package.json exists — no build step is allowed"

if [ "$fails" -eq 0 ]; then
  [ "$quiet" = "--quiet" ] && echo "  ✓ no external dependencies" || echo "✓ No external dependencies (ad loader stays off unless AD_CONFIG.enabled is true)"
else
  exit 1
fi
