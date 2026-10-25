# nisvasa — Claude Code Context

@AGENTS.md

## What this project is
A single-file static HTML breathing exercise app. No build step. No dependencies.
Hosted on GitHub Pages at https://nisvasa.com/. index.html is the entire app.
The design follows serverlessvc.com: pastel gradients, frosted glass, light sans headings,
pill buttons. Six mood lights re-tint it.

## Key entry points
| What                   | Where                                         |
|------------------------|-----------------------------------------------|
| All app code           | index.html (single file)                      |
| Colour tokens          | :root and :root[data-mood="…"] blocks in CSS  |
| Mood lights            | const MOODS + setMood()                       |
| Exercise data          | const EXERCISES array in <script>             |
| State management       | const state = {} object                       |
| View switching         | showView(id)                                  |
| Timer logic            | startTimer() / pauseTimer() / tick()          |
| Audio engine           | initAudio() / playTone()                      |
| Circle animation       | updateCircle(visual, motionMs)                |
| Privacy / terms        | #legal-privacy / #legal-terms dialogs         |
| Advertising (opt-in)   | const AD_CONFIG + initAds()                   |
| Agent-readable content | llms.txt (curated), llms-full.txt (generated) |
| GitHub Actions deploy  | .github/workflows/deploy.yml                  |
| CI sanity checks       | .github/workflows/ci.yml                      |
| Browser smoke test     | tests/smoke.sh + tests/smoke-harness.js       |

## Before making any change
1. Read SOUL.md: understand what this project cares about
2. Read the relevant function in index.html before editing it
3. Do not add external dependencies. The no-dependency constraint is intentional
4. Do not add localStorage. Each visit starts fresh, mood included
5. Run bash .agent/skills/validate/run.sh after any significant change

## Common tasks

Adding a new exercise:
  bash .agent/skills/add-exercise/run.sh prints the template and checklist.
  Then sync llms-full.txt, update llms.txt, the README table and the JSON-LD featureList.

Adding or changing a mood:
  Add it to MOODS, add a :root[data-mood="<id>"] block (dark moods also join the shared
  dark-surface selector) and a --swatch-<id> token. Check contrast for every technique colour.

Changing a colour:
  Edit the CSS custom property in the token blocks only. Never hardcode a colour elsewhere.

Changing audio:
  Edit TONES, playTone() or the SOUND_PLAYERS map. Web Audio API only, never <audio> tags.

Turning on ads:
  Set AD_CONFIG.enabled = true, choose a provider and fill in its IDs, add the network's line
  to ads.txt, and confirm the privacy statement's advertising section now shows. AdSense also
  needs a consent banner for EU/UK visitors. That is a product decision: ask before doing it.

Changing legal text:
  Edit the #legal-privacy / #legal-terms dialogs, update the effective date, and mirror the
  summary in llms-full.txt (via the sync-llms skill's template).

Deploying:
  git push origin main (via a merged PR). Check the Actions tab for status.

## PR checklist (run before opening every PR)
  - [ ] bash .agent/skills/validate/run.sh ends with "✓ PASS"
  - [ ] bash tests/smoke.sh ends with "✓ smoke: … checks passed"
  - [ ] CI is green on the PR (validate, html, smoke, lint)
  - [ ] index.html opens in a browser with no console errors
  - [ ] All 8 exercises load and their timers run correctly
  - [ ] Audio plays on at least one exercise
  - [ ] All six mood lights read well on the library, detail and practice screens
  - [ ] Checked on a 375px mobile viewport
  - [ ] No external dependencies added; no console.log left in code

## Claude-specific notes
- Start new sessions for new features. Do not let context grow stale
- CLAUDE.local.md is gitignored. Use it for personal session notes
- The entire app is one file. Read the section you are changing in full before editing
- When replacing a block of code by section markers, check nothing else lives between them
- Test what the user sees, not just state: the smoke test checks visible icons, not only labels
- New UI behaviour needs a matching check in tests/smoke-harness.js
