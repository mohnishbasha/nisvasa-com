---
name: audit-deps
description: >
  Confirm no external dependency, network call, storage or build step has crept into the app.
  Use before every PR and whenever a URL or script is added.
---
Run: bash .agent/skills/audit-deps/run.sh

The only code allowed to reach the network is the advertising loader in initAds(), which
does nothing while AD_CONFIG.enabled is false. Plain links (serverlessvc.com, GitHub's
privacy statement) and metadata URLs (schema.org, nisvasa.com) are on the allowlist.
Adding any other URL means updating the allowlist in run.sh, and that needs a reason in the PR.
