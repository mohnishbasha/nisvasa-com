---
name: brand-assets
description: >
  Regenerate the favicon, app icons and social share image after changing the logo
  (favicon.svg) or the share card text (og-image.html). Needs Chrome and ImageMagick.
---
Run: bash .agent/skills/brand-assets/run.sh

Sources:
- favicon.svg: the master mark (gradient tile, two breath rings, a core). logo.svg is the
  same mark with the "nisvasa" wordmark; update both together.
- og-image.html (this folder): the 1200×630 share card template. {{FAVICON}} is replaced
  with the mark.

Outputs, all at the repo root: icon-512.png (also the JSON-LD image source), icon-192.png,
apple-touch-icon.png (180×180, no transparency, since iOS adds its own corners), favicon.ico
(16/32/48) and og-image.jpg. The in-app logo is inline SVG in index.html and follows the mood
colour through --brand / --on-brand, so it needs no regeneration.

After running, check the images by eye, then run the validate skill and tests/smoke.sh.
