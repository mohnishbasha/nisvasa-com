---
name: deploy-check
description: >
  Verify .github/workflows/deploy.yml still has the triggers, permissions, concurrency
  and action versions GitHub Pages needs. Use before merging anything that touches it.
---
Run: bash .agent/skills/deploy-check/run.sh

Also confirm in GitHub: Settings → Pages → Source is set to "GitHub Actions".
If a deploy fails, open Actions → "Deploy to GitHub Pages" for the log. The most common
cause is a YAML indentation error.
