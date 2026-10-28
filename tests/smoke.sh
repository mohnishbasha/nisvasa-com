#!/usr/bin/env bash
# Smoke-tests index.html in headless Chrome: loads the real page over local HTTP, clicks through
# every exercise, the controls, moods, dialogs and a completed session, checks that every phase's
# sound spans the phase, the SEO wiring, deep links, and layout at five device sizes.
# Needs only bash, Python 3 and Chrome/Chromium. Set CHROME to override the browser path.
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1

find_chrome() {
  for candidate in "${CHROME:-}" google-chrome google-chrome-stable chromium chromium-browser \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    [ -n "$candidate" ] || continue
    # A name on PATH can be a broken shim, so only accept a browser that actually starts
    if "$candidate" --version >/dev/null 2>&1; then echo "$candidate"; return; fi
  done
  echo "Chrome not found. Set CHROME=/path/to/chrome" >&2
  exit 1
}

chrome=$(find_chrome)
work=$(mktemp -d)
server_pid=""
cleanup() {
  if [ -n "$server_pid" ]; then kill "$server_pid" 2>/dev/null; wait "$server_pid" 2>/dev/null || true; fi
  rm -rf "$work"
}
trap cleanup EXIT

# Catch errors from the very first script, then append the harness before </body>
python3 - "$work" <<'PY'
import sys, pathlib
work = pathlib.Path(sys.argv[1])
html = pathlib.Path('index.html').read_text()
probe = '<script>window.__smokeErrors=[];window.addEventListener("error",e=>window.__smokeErrors.push(e.message+" @"+e.lineno));</script>'
harness = pathlib.Path('tests/smoke-harness.js').read_text()
html = html.replace('<style>', probe + '<style>', 1)
(work / 'smoke.html').write_text(html.replace('</body>', f'<script>{harness}</script></body>', 1))
deep = '<script>setTimeout(()=>{const p=document.createElement("pre");p.id="SMOKE";p.textContent=(document.getElementById("view-detail").classList.contains("active")&&document.getElementById("detail-name").textContent==="Wim Hof Breathing"?"PASS":"FAIL")+" deep link #wim-hof opens its detail view";document.body.append(p)},300)</script>'
(work / 'deep.html').write_text(html.replace('</body>', deep + '</body>', 1))
PY

# HTTP, not file://, so the device-size iframes share an origin with the page
port=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$work" >/dev/null 2>&1 &
server_pid=$!
for _ in $(seq 1 50); do curl -s -o /dev/null "http://127.0.0.1:$port/smoke.html" && break; sleep 0.1; done

flags=(--headless=new --disable-gpu --no-first-run --no-default-browser-check --virtual-time-budget=90000)
[ -n "${CI:-}" ] && flags+=(--no-sandbox)

run() {
  "$chrome" "${flags[@]}" --dump-dom "http://127.0.0.1:$port/$1" 2>/dev/null \
    | python3 -c 'import sys,re,html; m=re.findall(r"<pre id=\"SMOKE\">(.*?)</pre>", sys.stdin.read(), re.S); print(html.unescape(m[-1]) if m else "FAIL harness produced no output")'
}

results=$( { run smoke.html; run 'deep.html#wim-hof'; } )
echo "$results" | sed -e 's/^PASS/  ✓/' -e 's/^FAIL/  ✗ FAIL:/'
failed=$(grep -c '^FAIL' <<<"$results" || true)
total=$(grep -cE '^(PASS|FAIL)' <<<"$results")
echo "──────────────────────────────────────────────────"
if [ "$failed" -eq 0 ]; then echo "✓ smoke: $total checks passed"; else echo "✗ smoke: $failed of $total checks failed"; exit 1; fi
