# nisvasa (breathe)

Single-file static HTML breathing exercise app, live at https://nisvasa.com/.
8 guided breathing techniques with an animated breath circle, Web Audio API sound
and six "mood light" colour themes. Hosted on GitHub Pages. No build step. No dependencies.
© Serverless Ventures LLC (https://www.serverlessvc.com).

## The only app file
index.html: 100% of the app (HTML, CSS, JavaScript and all data).
Do not split it into multiple files. The single-file constraint is intentional.

Site files beside it exist for crawlers, agents and browsers, not for the app logic:
llms.txt, llms-full.txt (generated), robots.txt, sitemap.xml, ads.txt, .well-known/security.txt,
CNAME, favicon.svg/.ico, icon-192.png, icon-512.png, apple-touch-icon.png, logo.svg, og-image.jpg.

Generated regions inside index.html (never hand-edit; run the sync-content skill):
  <!-- generated:cards:… -->   pre-rendered exercise cards, so crawlers without JavaScript see them
  <!-- generated:jsonld:… -->  JSON-LD @graph: Organization, WebSite, WebApplication, ItemList, FAQPage

## Run locally
Open index.html in any browser. That is all.

## Test
bash .agent/skills/validate/run.sh   checklist, deploy shape, dependency audit, llms sync
bash tests/smoke.sh                  clicks through the real app in headless Chrome (39 checks)
CI (.github/workflows/ci.yml) runs both, plus the W3C HTML checker, shellcheck and actionlint,
on every push and pull request.

## Deploy
git push origin main
GitHub Actions (.github/workflows/deploy.yml) deploys to GitHub Pages automatically.

## Key structures inside index.html

const EXERCISES = [...]
  Exercise config objects. Add new exercises here.
  Each: { id, name, sanskrit, category, color, teaser, benefits[3], pattern[], completion }
  Optional: build ('wimhof' | 'kapalabhati' | 'alternate'), rounds, guide ('nadi' | 'bhramari' | 'safety').
  id doubles as the deep link: https://nisvasa.com/#<id>

const MOODS = [...]
  Mood-light themes. Each id needs a matching :root[data-mood="<id>"] token block and a --swatch-<id>.

const AD_CONFIG = {...}
  Advertising, OFF by default (enabled: false). Library page only, never during practice.

const state = {}
  All runtime state. Never use localStorage. Never add globals outside this object.

showView(id)
  Switches between view-list, view-detail, view-practice. Never toggle display directly.

startTimer() / pauseTimer() / resumeTimer() / stopTimer()
  Timer control. Time comes from performance.now(); setInterval only refreshes the display.

initAudio() / soundPlan(phase, seconds) / playPlan(plan) / playTone(freq, duration, gain, options)
  Web Audio API only. One AudioContext, created on first gesture, volume via ctx.masterGain.
  Mute suspends the context. Never add <audio> tags or audio files.
  soundPlan returns pure data; every phase's tones must start at 0 and end at exactly `seconds`
  (swell = inhale, steady = hold/hum/rest bed, fade = exhale, pluck = Kapalabhati pump).

updateCircle(visual, motionMs)
  Sets --circle-size (a ratio 0.5714–1 of --circle-cap), --glow-opacity, --ring-opacity,
  --phase-duration. CSS animates. --circle-cap is bounded by width AND height (svh).

setMood(id) / openLegal(button) / initAds() / openFromHash()
  Mood light, privacy and terms dialogs, opt-in ads, and #exercise deep links.

## Rules
NEVER add external CSS, JS, fonts or CDN links (the opt-in ad loader in initAds is the one exception)
NEVER add localStorage, sessionStorage, cookies or any other storage
NEVER add a build step or package.json
NEVER use canvas for animation
NEVER add audio files: all sound is Web Audio API synthesis
NEVER hardcode a colour outside the :root / [data-mood] token blocks
NEVER show ads on the detail or practice screens, or enable them without updating ads.txt
NEVER commit directly to main: use a feature branch and PR
NEVER leave console.log in committed code
ALWAYS use performance.now() for timing, never setInterval alone
ALWAYS run bash .agent/skills/sync-content/run.sh after changing exercises, moods or the FAQ
ALWAYS keep the visible FAQ and answers honest and hedged; the JSON-LD FAQ is generated from it
ALWAYS keep the practice controls on screen at 320×568 and in landscape (the smoke test checks)
ALWAYS run bash .agent/skills/validate/run.sh and bash tests/smoke.sh before a PR
ALWAYS keep CI green: never merge with a failing ci.yml job
NEVER toggle an SVG with .hidden (SVG has no such property): use the is-hidden class

## Git
Branches: feature/*, fix/*, chore/*, docs/*, style/* off main
Commits: feat: / fix: / chore: / docs: / style: / refactor:  (lowercase, present tense, <72 chars)
PRs: must pass the checklist in CLAUDE.md before merging
