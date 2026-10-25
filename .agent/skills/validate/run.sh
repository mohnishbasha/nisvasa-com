#!/usr/bin/env bash
# Checks index.html and the site files against the validation checklist in PROMPT.md.
# Reports every failure, then exits non-zero if there were any.
set -uo pipefail
cd "$(dirname "$0")/../../.." || exit 1

fails=0
pass() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗ FAIL:\033[0m %s\n' "$1"; fails=$((fails + 1)); }
info() { printf '  · %s\n' "$1"; }
has() { grep -q -- "$1" "${2:-index.html}"; }
check() { if has "$2" "${3:-index.html}"; then pass "$1"; else fail "$1"; fi; }
absent() { if grep -qE -- "$2" index.html; then fail "$1"; else pass "$1"; fi; }

echo "── Structure ─────────────────────────────────────"
if [ -f index.html ]; then pass "index.html exists"; else fail "index.html missing"; exit 1; fi
absent "no external <script src>" '<script[^>]+src="https?:'
absent "no external stylesheet" '<link[^>]*rel="stylesheet"'
absent "no @import or @font-face" '@import|@font-face'
absent "no <audio> tags" '<audio'
absent "no <canvas>" '<canvas'
absent "no localStorage / sessionStorage" 'localStorage|sessionStorage|indexedDB'
absent "no console.log" 'console\.log'
absent "no var declarations" '(^|[^-.a-zA-Z_])var [a-zA-Z_]'
absent "no !important" '!important'
css_after_tokens=$(awk '/\[data-tech="sage"\]/{on=1} /<\/style>/{on=0} on' index.html)
if grep -qE '#[0-9a-fA-F]{3,8}\b' <<<"$css_after_tokens"; then fail "hex colours outside the token blocks"; else pass "colours only in tokens"; fi
# A real .js file, not a <(…) pipe: Node 20 on Linux cannot --check a /dev/fd path
script_file=$(mktemp "${TMPDIR:-/tmp}/nisvasa-app-XXXXXX.js")
awk '/^<script>$/{on=1; next} /^<\/script>$/{on=0} on' index.html > "$script_file"
if node --check "$script_file" 2>/dev/null; then pass "JavaScript parses"; else fail "JavaScript syntax error"; fi
rm -f "$script_file"

echo "── Completeness ──────────────────────────────────"
for name in "Box Breathing" "4-7-8" "Nadi Shodhana" "Bhramari" "Wim Hof" "Coherent" "Kapalabhati" "Physiological Sigh"; do
  check "exercise: $name" "$name"
done
for id in view-list view-detail view-practice; do check "view #$id" "id=\"$id\""; done
check "session pills 3/5/10/custom" 'data-minutes="custom"'
check "pause / stop / sound controls" 'id="sound-btn"'
check "mood light picker" 'id="mood-panel"'
check "particles" 'class="particle"'
check "progress bar" 'id="progress"'
check "pattern visualiser" 'id="pattern"'
check "three concentric rings" 'ring-outer'
check "footer motto" 'be still. breathe.'
check "privacy statement" 'id="legal-privacy"'
check "terms of use" 'id="legal-terms"'
check "copyright Serverless Ventures LLC" 'Serverless Ventures LLC'

echo "── Technical ─────────────────────────────────────"
check "performance.now() timing" 'performance.now'
check "circle custom properties" '--ring-opacity'
check "AudioContext masterGain" 'masterGain'
check "mute suspends AudioContext" '.suspend()'
check "aria-live phase announcer" 'id="phase-announcer" aria-live="polite"'
check "prefers-reduced-motion" 'prefers-reduced-motion'
check "600px breakpoint" '601px'
check "structured data (JSON-LD)" 'application/ld+json'
if grep -q 'enabled: false,' index.html; then pass "ads off by default"; else info "ads are ENABLED — confirm the privacy statement, ads.txt and consent are in place"; fi

echo "── Site and deploy ───────────────────────────────"
for f in README.md llms.txt llms-full.txt robots.txt sitemap.xml ads.txt .well-known/security.txt .gitignore \
         .github/workflows/deploy.yml .github/workflows/ci.yml tests/smoke.sh tests/smoke-harness.js; do
  if [ -f "$f" ]; then pass "$f"; else fail "$f missing"; fi
done
if diff -q <(node .agent/skills/sync-llms/generate.js --stdout) llms-full.txt >/dev/null; then
  pass "llms-full.txt in sync with index.html"
else
  fail "llms-full.txt is stale — run: bash .agent/skills/sync-llms/run.sh"
fi
bash .agent/skills/deploy-check/run.sh --quiet || fails=$((fails + 1))
bash .agent/skills/audit-deps/run.sh --quiet || fails=$((fails + 1))

echo "──────────────────────────────────────────────────"
if [ "$fails" -eq 0 ]; then echo "✓ PASS: all checks passed"; else echo "✗ $fails check(s) failed"; exit 1; fi
