---
name: validate
description: >
  Verify index.html and the site files against the validation checklist in PROMPT.md.
  Use after any change to index.html, and before opening a PR.
---
Run: bash .agent/skills/validate/run.sh

Reports PASS or FAIL for every item and exits non-zero on any failure. It also runs the
deploy-check and audit-deps skills and confirms llms-full.txt matches index.html.
It does not fix anything itself: read each failure, fix it in index.html, and run it again
until it ends with "✓ PASS: all checks passed".

It cannot see how the app looks or sounds. After visual or audio changes, also open
index.html in a browser and run through the PR checklist in CLAUDE.md.
