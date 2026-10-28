#!/usr/bin/env bash
# Regenerates every raster brand asset from favicon.svg and the og-image.html template.
# Needs Chrome (renders the SVG and the social card) and ImageMagick (resizes and packs the .ico).
set -euo pipefail
cd "$(dirname "$0")/../../.." || exit 1

find_chrome() {
  for candidate in "${CHROME:-}" google-chrome google-chrome-stable chromium chromium-browser \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    [ -n "$candidate" ] || continue
    if "$candidate" --version >/dev/null 2>&1; then echo "$candidate"; return; fi
  done
  echo "Chrome not found. Set CHROME=/path/to/chrome" >&2
  exit 1
}
command -v magick >/dev/null || { echo "ImageMagick (magick) is required" >&2; exit 1; }

chrome=$(find_chrome)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
favicon="file://$PWD/favicon.svg"
shoot=(--headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=1500)

printf '<!doctype html><style>html,body{margin:0;background:transparent}img{display:block;width:512px;height:512px}</style><img src="%s">' "$favicon" > "$work/icon.html"
sed "s#{{FAVICON}}#$favicon#g" .agent/skills/brand-assets/og-image.html > "$work/og.html"

"$chrome" "${shoot[@]}" --default-background-color=00000000 --window-size=512,512 --screenshot="$work/icon.png" "file://$work/icon.html" 2>/dev/null
"$chrome" "${shoot[@]}" --window-size=1200,630 --screenshot="$work/og.png" "file://$work/og.html" 2>/dev/null

magick "$work/icon.png" -crop 512x512+0+0 +repage -strip -define png:compression-level=9 icon-512.png
magick icon-512.png -resize 192x192 -strip icon-192.png
magick icon-512.png -resize 180x180 -background '#16A34A' -alpha remove -strip apple-touch-icon.png
magick icon-512.png -define icon:auto-resize=48,32,16 favicon.ico
magick "$work/og.png" -strip -quality 88 og-image.jpg
echo "✓ regenerated icon-512.png, icon-192.png, apple-touch-icon.png, favicon.ico, og-image.jpg"
