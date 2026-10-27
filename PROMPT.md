# nisvasa (breathe) — Build Prompt

This file preserves the complete specification used to generate this project, plus every
requirement added since. It is the source of truth for design decisions, colour choices,
audio design and feature scope. When modifying the app, consult this file to understand
why decisions were made, not just what was built.

Read it in this order:
1. **v1.1–v1.3 amendments** below: the current requirements. They supersede the original
   prompt wherever the two conflict.
2. **Original full prompt (v1.0)** at the bottom: kept word for word for history and for
   everything v1.1 does not change (exercises, patterns, audio, timer, accessibility, git
   and deploy practices).

## Design intent
A digital sanctuary that slows people down within three seconds. Single HTML file, no
external dependencies, slow breath-like motion. Since v1.1 the look follows the
serverlessvc.com design language (pastel gradients, frosted glass, light sans type, pill
buttons), and visitors choose the "room" they breathe in with the mood light.

## What was intentionally excluded
- No external fonts (system stack, Inter first only when already installed)
- No canvas (CSS animation only)
- No localStorage, sessionStorage or cookies (mood and theme choices last for one visit)
- No frameworks, no build step, no package.json
- No PWA manifest (icons are linked directly; there is no site.webmanifest)
- No network requests, except the opt-in advertising loader, which is off by default

## If you are adding a new breathing exercise
Follow the existing exercise config object structure in index.html. Each exercise needs:
id, name, sanskrit, category, color, teaser, benefits (array of 3), pattern (array of
phase objects) and completion. Add it to the EXERCISES array; the UI renders it
automatically. Then run the sync-content skill and update llms.txt, the README table and the
JSON-LD featureList. `bash .agent/skills/add-exercise/run.sh` prints the full checklist.

## If you are changing the visual theme
All colours are CSS custom properties in the :root and :root[data-mood="…"] blocks of
index.html. Change them there. Never hardcode colours anywhere else.

---

## Requirement history

| Version | Date       | Change |
|---------|------------|--------|
| v1.0    | 2026-10-25 | Original build: 8 exercises, Still Water dark theme, three files (see original prompt) |
| v1.1    | 2026-10-25 | Light theme added, then the whole look replaced by the serverlessvc.com design language |
| v1.1    | 2026-10-25 | Light/dark toggle replaced by a six-mood "mood light" picker |
| v1.1    | 2026-10-25 | Footer: privacy statement, terms of use, © Serverless Ventures LLC linking www.serverlessvc.com |
| v1.1    | 2026-10-25 | Agent readiness: llms.txt, llms-full.txt, robots.txt with content signals, sitemap, JSON-LD, security.txt, deep links |
| v1.1    | 2026-10-25 | Ad readiness: reserved ad slot and AD_CONFIG, off by default; ads.txt |
| v1.1    | 2026-10-25 | Repository agent harness: CLAUDE.md, AGENTS.md, SKILLS.md, SOUL.md and five skills |
| v1.2    | 2026-10-25 | Practice screen: exercise name, phase label and hint made far more prominent |
| v1.2    | 2026-10-25 | Code sanity CI (ci.yml): validator, W3C HTML check, headless-Chrome smoke test, shellcheck, actionlint |
| v1.2    | 2026-10-25 | Expanded .gitignore; fixed SVG icon toggles (pause/play, sound/muted never swapped) |
| v1.3    | 2026-10-27 | Favicon set, app icons, logo (inline, mood-aware) and 1200×630 social image |
| v1.3    | 2026-10-27 | Audio: every phase's sound lasts exactly as long as the phase |
| v1.3    | 2026-10-27 | SEO/AEO: pre-rendered cards, visible FAQ, generated JSON-LD @graph, richer <head>, image sitemap |
| v1.3    | 2026-10-27 | Responsive: circle sized as a ratio of a width-and-height cap; short-screen and landscape layout |
| v1.3    | 2026-10-27 | Skills: sync-llms → sync-content; new brand-assets; smoke test grows to 51 checks |

---

## v1.1–v1.3 amendments (supersede the original prompt where they conflict)

### A1. Visual design: serverlessvc.com design language

Replaces the original COLOR SYSTEM ("Still Water"), TYPOGRAPHY and the dark-only background.

Reference: https://serverlessvc.com (the StokeAI handbook is behind a login, so the public
company site is the reference).

- Background: a 135° linear gradient over four stops that drifts slowly
  (background-size 400%, 16s ease-in-out, `bg-breathe` keyframes), plus two large blurred
  "orbs" (filter: blur(80px), opacity 0.35) drifting top-left and bottom-right.
- Surfaces: frosted glass, i.e. a translucent background (white at 65% in light moods),
  backdrop-filter: blur(16px), a 1px translucent white border and a soft shadow. Used for
  cards, guides, dialogs, the mood panel and the ad slot.
- Radius: cards 18px, dialogs 20px, every button and pill fully rounded (999px).
- Typography: one sans stack, `'Inter', ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, 'Segoe UI', sans-serif`. Inter is used only if already installed;
  nothing is downloaded. No serif, no italics.
  - App name "breathe": 44px mobile / 56px desktop, weight 300, letter-spacing -0.03em
  - Hero pill above it: "nisvasa · calm · sleep · focus · energy", 13px/500, brand colour, dot
  - Exercise name on cards: 19px/600. Detail title: 34px/40px, weight 300
  - Countdown inside the circle: 44px/56px weight 300, technique colour
  - Practice-screen guidance (v1.2, see A10) is the most prominent text on that screen
  - Section labels: 12px/600 uppercase, letter-spacing 0.08em
- Buttons, sentence case: "Begin", "Begin practice", "Practice again", "Back to library",
  "← Library", "Not now", "I understand — begin", "Close".
  - Primary: solid technique colour, contrasting text (--on-tech), coloured soft shadow
  - Card button: technique colour at 10% fill, solid on hover
  - Quiet: glass pill with border
  - Selected session pill: solid technique colour
- Category badges: pill with a 6px dot, technique colour on a 10% tint, normal case.
- Cards: hover lifts 4px with shadow 0 20px 60px; the 600ms shimmer sweep stays.
- Practice screen: breath circle filled with glass, 1.5px technique-colour border and glow
  as in v1.0. Particles use the technique colour at up to 18% opacity so they show on
  light backgrounds. Progress bar 3px.
- Technique colours keep one hue per exercise but are re-tuned per surface brightness:
  - Light moods: sage #2D8F65, indigo-soft #4F5BD5, gold-muted #A8841F, rose-muted #D14D72,
    terracotta #E0603A, teal-soft #0E8A94, amber-soft #D97706, lavender-soft #8B5CF6
  - Dark moods: sage #4FAB82, indigo-soft #8B94F0, gold-muted #D4B04F, rose-muted #EC7C9B,
    terracotta #F08A62, teal-soft #3BB8C0, amber-soft #F5A524, lavender-soft #A78BFA
  - Each colour also has an `-rgb` triplet token for alpha blends.
- Light text: primary #1F2937, secondary #4B5563, muted #6B7280.
  Dark text: primary #E5E7EB, secondary #A1A9B5, muted #7D8694.
- All motion rules from v1.0 still apply. prefers-reduced-motion also stops the gradient
  drift, the orbs and the mood-panel fade.

### A2. Mood light (replaces any light/dark toggle)

- A bulb icon button (48px glass circle) sits top-right on the library screen and in the
  practice controls, so the mood can change mid-session. Both buttons control one panel.
- The panel (glass, fixed top-right, ≤300px wide) is titled "Mood light" and lists each mood
  as a button with a 32px gradient swatch, name and one-line purpose. The current mood has
  aria-pressed="true" and a brand-colour border.
- Moods (`const MOODS`, and a `:root[data-mood="<id>"]` token block each):

  | id       | Name     | Purpose                         | Gradient stops                      | Orbs              | Brand   |
  |----------|----------|---------------------------------|-------------------------------------|-------------------|---------|
  | fresh    | Fresh    | Clear and awake — mint and sky  | #E8F5F0 #DCEEFB #F0F4FF #FAF0FB     | #85C9A8 #A5B4FC   | #16A34A |
  | dawn     | Dawn     | Warm and gentle — for mornings  | #FFF1E6 #FFE4E1 #FDF2F8 #FEF9C3     | #FDBA74 #F9A8D4   | #E0603A |
  | ocean    | Ocean    | Cool and steady — for focus     | #E0F2FE #E0F7FA #ECFEFF #EEF2FF     | #67E8F9 #93C5FD   | #0E8A94 |
  | dusk     | Dusk     | Soft lavender — for unwinding   | #F3E8FF #FCE7F3 #EDE9FE #E0E7FF     | #C4B5FD #F9A8D4   | #8B5CF6 |
  | forest   | Forest   | Grounded and low-lit (dark)     | #0C1F18 #0F2A22 #10241F #0B1A1C     | #2D8F65 #1E7350   | #4FAB82 |
  | midnight | Midnight | Dim and deep — for sleep (dark) | #0B1024 #121A3A #1A1640 #0D1226     | #4F46E5 #7C3AED   | #8B94F0 |

- Fresh is the default. Forest and Midnight share one dark surface/text token set.
- setMood(id) only sets `data-mood` on <html>; CSS does the rest, with a 600ms colour fade.
- The choice is not stored (no localStorage): every visit starts on Fresh.
- The panel closes on Escape or a click outside, and returns focus to the bulb that opened it.

### A3. Footer, privacy statement and terms of use

- The library footer contains, centred: the motto "be still. breathe."; links "Privacy" and
  "Terms of use" (48px touch targets); and "© {current year} Serverless Ventures LLC. All
  rights reserved.", where the company name links to https://www.serverlessvc.com
  (target="_blank" rel="noopener"). The year is set by script with a static fallback.
- Privacy and Terms open as in-page dialogs (role="dialog", aria-modal, focus moves to
  "Close", Escape closes, focus returns to the link). No separate pages: the app stays one file.
- Privacy statement content (effective date shown): operator is Serverless Ventures LLC;
  nothing is collected (no accounts, forms, analytics, advertising, cookies or browser
  storage); the app runs entirely in the browser; GitHub Pages hosting may log technical
  data under GitHub's privacy statement (linked); not directed at children under 13;
  changes are posted on the page; contact via www.serverlessvc.com.
- When ads are enabled, the "nothing collected" paragraph is swapped for an advertising-aware
  one and an "Advertising" section appears (elements marked data-ads="on"/"off", toggled by
  syncAdNotices()). The statement must always match what the page does.
- Terms of use content: acceptance; not medical advice (consult a professional, especially
  if pregnant or with heart, blood-pressure, respiratory or seizure conditions); practise
  safely (seated or lying down, never in water, driving or operating machinery; Wim Hof and
  Kapalabhati are vigorous); free personal use; ownership © Serverless Ventures LLC; no
  warranty ("as is"); limitation of liability; external links; changes; contact.
- The legal text is a plain-language draft and should be reviewed by counsel. Governing law
  is intentionally not specified.

### A4. Agent readiness

Make the site easy for search engines, AI assistants and agents to read and recommend.

- Domain: https://nisvasa.com/ (canonical, bare domain; www redirects to it). The Pages custom
  domain setting and the CNAME file both say `nisvasa.com`. The default branch is `main`.
- index.html <head>: an accurate meta description; `<link rel="canonical">`;
  `<link rel="alternate" type="text/plain">` to llms.txt and llms-full.txt;
  `<link rel="sitemap">`; Open Graph and Twitter card tags; JSON-LD `WebApplication`
  (name nisvasa, alternateName breathe, HealthApplication, free Offer, featureList of all
  eight patterns, publisher Organization Serverless Ventures LLC with its URL).
- Deep links: every exercise is addressable at `#<exercise id>` (for example
  https://nisvasa.com/#wim-hof). Opening a detail view sets the hash with
  history.replaceState; returning to the library clears it; hashchange and initial load open
  the matching exercise.
- llms.txt (llmstxt.org format, curated by hand): summary blockquote, reliable facts (cost,
  platform, data, session lengths, mood light, safety), every exercise with its deep link and
  pattern, how-to steps, legal pointers, links to llms-full.txt, README and AGENTS.md.
- llms-full.txt: generated, never hand-edited. `bash .agent/skills/sync-content/run.sh` (v1.3; was sync-llms) reads
  EXERCISES and MOODS out of index.html and writes every exercise's link, category, pattern,
  teaser, benefits and completion message, plus usage, moods, safety and a privacy/terms summary.
- robots.txt: allow all agents, point to the sitemap, and declare content signals
  `Content-Signal: search=yes, ai-input=yes, ai-train=no` (change ai-train to allow training).
- sitemap.xml: the home page, llms.txt and llms-full.txt.
- .well-known/security.txt (RFC 9116): contact https://www.serverlessvc.com, an Expires
  date at most one year ahead, canonical URL.
- The semantic HTML, aria labels and aria-live region from v1.0 stay, since they are what
  browsing agents read.

### A5. Ad readiness

- A reserved `<aside class="ad-slot" aria-label="Advertisement">` with a small "sponsor"
  label sits between the exercise cards and the footer on the library screen only. It has a
  fixed min-height so a late ad never shifts the layout, and it is hidden while ads are off.
- `const AD_CONFIG = { enabled: false, provider: 'ethicalads', ethicalads: { publisher,
  type }, adsense: { client, slot } }`. Supported providers: EthicalAds (recommended,
  privacy-friendly) and Google AdSense.
- initAds() runs once at startup. While disabled it only syncs the privacy notices and
  makes no request. When enabled it builds the provider's unit, shows the slot, and appends
  the provider script (async, crossorigin="anonymous").
- Ads never appear on the detail or practice screens.
- ads.txt at the repo root holds the authorised-seller line once a network is chosen (only
  read at the domain root, so it needs the custom domain).
- Turning ads on is an owner decision. It also requires the network's ads.txt line and,
  for AdSense, a consent banner for EU/UK visitors (not built).
- This is the single exception to "no external dependencies"; the audit-deps skill
  allowlists exactly these provider hosts.

### A6. Repository agent harness (completes the original AGENT REPOSITORY FILES section)

- CLAUDE.md imports AGENTS.md with Claude Code's `@AGENTS.md` syntax (not `@import`).
- AGENTS.md, CLAUDE.md, SKILLS.md and SOUL.md describe the code as built: real function
  names (updateCircle(visual, motionMs), resumeTimer, setMood, openLegal, initAds,
  openFromHash), MOODS, AD_CONFIG, the site files and the opt-in ad exception.
- Skills in .agent/skills/ (SKILL.md and run.sh each, bash and Node only):
  - validate: the full checklist (below); reports every failure, exits non-zero; runs
    deploy-check and audit-deps; confirms llms-full.txt is in sync
  - add-exercise: prints the exercise template and follow-up checklist
  - sync-llms: regenerates llms-full.txt (renamed and extended to sync-content in v1.3, see A17)
  - deploy-check: verifies deploy.yml triggers, permissions, concurrency and action versions
  - audit-deps: URL allowlist; flags script src, stylesheets, fonts, network APIs, storage
    and package.json
- .gitignore: CLAUDE.local.md, .DS_Store.

### A7. Changes to "WHAT NOT TO BUILD"

- "No external dependencies" now has one documented exception: the opt-in ad loader (A5).
- "No localStorage" stands, and also covers mood choice.
- Legal pages are dialogs inside index.html, not separate HTML files.

### A8. Additional validation items (append to the original checklist)

DESIGN AND MOODS
- [ ] No serif fonts; one system sans stack; no web fonts downloaded
- [ ] Glass surfaces on cards, guides, dialogs, mood panel and ad slot
- [ ] Six moods present (fresh, dawn, ocean, dusk, forest, midnight), each with a token block and swatch
- [ ] Mood light button on the library and practice screens; Escape and outside click close it
- [ ] No hex colours outside the :root / [data-mood] token blocks

FOOTER AND LEGAL
- [ ] Footer shows Privacy, Terms of use and © year Serverless Ventures LLC linking www.serverlessvc.com
- [ ] Privacy and terms dialogs open, close on Escape and return focus to the link
- [ ] Privacy statement matches the ad setting (data-ads variants)

AGENT AND AD READINESS
- [ ] JSON-LD WebApplication, canonical, Open Graph and alternate links in <head>
- [ ] #<exercise-id> deep links open the right detail view
- [ ] llms.txt, llms-full.txt (in sync), robots.txt with content signals, sitemap.xml,
      .well-known/security.txt and ads.txt exist
- [ ] AD_CONFIG.enabled is false by default and no script[src] is present at load
- [ ] bash .agent/skills/validate/run.sh ends with "✓ PASS: all checks passed"

PRACTICE AND CODE SANITY (v1.2)
- [ ] Practice screen: exercise-name pill, phase label 42px/60px weight 500, hint 18px/21px weight 500
- [ ] Pause shows the play icon and mute shows the muted icon (visible state, not just aria-label)
- [ ] .github/workflows/ci.yml exists and passes: validate, html, smoke, lint
- [ ] bash tests/smoke.sh ends with "✓ smoke: … checks passed"
- [ ] W3C Nu HTML checker reports no errors for index.html
- [ ] shellcheck and actionlint report nothing
- [ ] .gitignore covers personal notes, OS/editor files, local tooling, logs and env files

BRAND, SOUND, SEO AND RESPONSIVE (v1.3)
- [ ] favicon.svg/.ico, icon-192/512, apple-touch-icon (180, opaque), logo.svg, og-image.jpg exist and are linked
- [ ] Masthead shows the inline logo in the current mood's --brand colour
- [ ] soundPlan(): every phase of every exercise has tones from 0 s to exactly its duration
- [ ] Pre-rendered cards and JSON-LD are in sync (sync-content --check)
- [ ] Visible FAQ with at least five answer-first questions; FAQPage JSON-LD generated from it
- [ ] Title, description, canonical, robots, Open Graph and Twitter image tags present
- [ ] No horizontal scroll and practice controls in view at 320×568, 375×667, 414×896, 768×1024, 667×375
- [ ] The breath circle keeps the 160:280 proportion at every size, including landscape

### A9. Final file list (replaces the original FINAL OUTPUT list)

  1. index.html                       complete app
  2. README.md                        setup, deploy, moods, ads, agent files
  3. .github/workflows/deploy.yml     GitHub Actions workflow (unchanged from v1.0)
  4. PROMPT.md                        this file
  5. CLAUDE.md / AGENTS.md / SKILLS.md / SOUL.md
  6. .agent/skills/{validate,add-exercise,sync-content,brand-assets,deploy-check,audit-deps}/
     {SKILL.md,run.sh} (+ sync-content/generate.js, brand-assets/og-image.html)
  7. llms.txt, llms-full.txt, robots.txt, sitemap.xml, ads.txt, .well-known/security.txt
  8. .gitignore
  9. .github/workflows/ci.yml          code sanity checks (v1.2)
 10. tests/smoke.sh, tests/smoke-harness.js   headless-Chrome smoke test (v1.2, extended v1.3)
 11. favicon.svg, favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png, logo.svg,
     og-image.jpg                       brand assets (v1.3)
 12. CNAME                             nisvasa.com

### A10. Practice-screen prominence (v1.2)

During an exercise, the instruction for this moment must be the easiest thing to read.

- Exercise name: a pill in the technique colour (15px mobile / 16px desktop, weight 600,
  12% technique-colour fill, 7px dot), not muted uppercase text.
- Phase label ("inhale", "hold", "long exhale"…): 42px mobile / 60px desktop, weight 500,
  full-contrast --text-primary, letter-spacing -0.02em, line-height 1.1, lowercase.
- Hint ("through the nose", "in through the left nostril"…): 18px mobile / 21px desktop,
  weight 500, --text-primary at 80% opacity.
- The countdown, circle and controls keep their v1.1 sizes; the guidance reads first and the
  circle paces.
- Must stay readable in every mood, light and dark.

### A11. Code sanity CI (v1.2)

`.github/workflows/ci.yml`, separate from deploy.yml (which stays exactly as specified):

- Triggers: push to any branch, pull_request, workflow_dispatch. permissions: contents: read.
  concurrency: `ci-${{ github.ref }}` with cancel-in-progress.
- Jobs (each on ubuntu-latest):
  - validate: Node 22, `bash .agent/skills/validate/run.sh`. CI uses checkout@v5,
    setup-node@v5 and setup-java@v5 (deploy.yml keeps the v4 pins from the original spec).
  - html: Java 21 (temurin), download the W3C Nu HTML Checker (vnu.jar) and run it with
    `--errors-only` (errors fail the build); a second step prints warnings for information.
  - smoke: `bash tests/smoke.sh` with CHROME=google-chrome.
  - lint: shellcheck on every run.sh and tests/*.sh; actionlint on all workflows;
    `node --check` on the app script, the smoke harness and the llms generator; sitemap.xml
    must parse; the JSON-LD must parse as a WebApplication with 8 features.
- Repository setting (manual): protect main and require the four CI jobs as status checks,
  so a red build cannot be merged and deployed.

Smoke test (`tests/smoke.sh` + `tests/smoke-harness.js`):
- No npm packages: bash, Python 3 and Chrome/Chromium only. It finds Chrome via $CHROME,
  common names on PATH or the macOS app path, and accepts a binary only if it actually
  starts (PATH can hold broken shims). It adds --no-sandbox when $CI is set.
- It writes a temporary copy of index.html with an early error listener and the harness,
  runs it with --headless=new --dump-dom --virtual-time-budget, and parses PASS/FAIL lines.
- It checks: no load or runtime errors; 8 cards; no script[src]; ad slot hidden; copyright
  year; every exercise opens (with its #hash) and its practice timer runs; pause/resume and
  mute/unmute swap the visible icons and timer/audio state; the mood panel works from the
  practice screen and Escape closes it; a custom 1-minute session completes with the right
  message; returning to the library clears the hash; the terms dialog opens and closes; the
  privacy statement shows the no-ads variant; a #wim-hof deep link opens its detail view.
- It must fail on regressions. A deliberately reintroduced icon bug fails exactly one check.

### A12. Repository hygiene (v1.2)

- `.gitignore`: CLAUDE.local.md; .DS_Store, Thumbs.db, desktop.ini, .idea/, .vscode/, *.swp,
  *~; node_modules/, vnu.jar, actionlint; *.log, tmp/, .env, .env.*.
- Shell checks give Node a real temp `.js` file, never a `<(…)` pipe: Node 20 on Linux cannot
  `--check` a /dev/fd path (this broke the first CI run).
- SVG elements have no `.hidden` property. Icon swaps toggle an `is-hidden` class
  (`.control .is-hidden { display: none; }`); the HTML `hidden` attribute is used only on
  HTML elements.
- The W3C checker must report zero errors. "Section lacks heading" warnings are acceptable
  for dialogs and views; give real content sections a heading (an sr-only one is fine).

### A13. Brand: favicon, icons and logo (v1.3)

- The mark: a 64×64 rounded tile (radius 16) with a 135° gradient #16A34A → #0E8A94, an outer
  white ring (r 21, 35% opacity), an inner white ring (r 13.5, 75%) and a white core (r 5.5),
  i.e. the breath circle and its rings. `favicon.svg` is the master; `logo.svg` adds the
  "nisvasa" wordmark (weight 300).
- Rasters (all generated by the brand-assets skill from favicon.svg with Chrome + ImageMagick):
  favicon.ico (16/32/48), icon-192.png, icon-512.png (also the JSON-LD image),
  apple-touch-icon.png (180×180, opaque green background because iOS rounds its own corners)
  and og-image.jpg (1200×630 share card from .agent/skills/brand-assets/og-image.html: mark,
  "Free guided breathing, right in your browser.", one-line promise, the eight exercise names).
- <head> links: favicon.svg (image/svg+xml), favicon.ico, icon-192.png, apple-touch-icon.png.
- In the app: the mark is inline SVG at the top of the masthead (56px, soft shadow), drawn with
  `--brand` and `--on-brand`, so it re-tints with the mood. It is decorative (aria-hidden).
- Still no web app manifest (see "What was intentionally excluded").

### A14. Sound that lasts as long as the breath (v1.3, supersedes the tone lengths in AUDIO)

The original spec gave fixed lengths (inhale 400 ms, exhale ~600 ms release, 40 ms chirp). Now
every phase's sound starts when the phase starts and ends exactly when it ends.

- `soundPlan(phase, seconds)` returns pure data: a list of tones `{ freq, gain, start, duration,
  attack, release, sweepTo? }` and optional noise bursts. `playPlan()` schedules it. Keeping it
  pure lets tests check every phase without playing audio.
- Envelope shapes (ENVELOPE_LIMITS):
  - swell, for inhale: attack 70% of the phase, release min(0.35 s, 30%), so the level rises
    with the breath
  - steady, for hold, Bhramari hum and the rest bed: attack min(0.2 s, 25%), release
    min(0.6 s, 33%)
  - fade, for exhale: attack min(0.08 s, 25%), then a decay across the rest of the phase
  - pluck, for the Kapalabhati pump: 5 ms attack, decay across the 0.5 s pump
- Frequencies and peak gains keep the original values: inhale 432 Hz 0.18, hold 324 Hz 0.10,
  exhale 360 Hz 0.15, rest 216 Hz, hum 220/440/660 Hz (0.6/0.3/0.1 of 0.08), pump 880 Hz → 660 Hz
  0.12, completion chime 396 → 528 → 660 Hz unchanged.
- Rest phases: a soft 216 Hz bed (gain 0.035) for the whole phase, plus the original pulses
  (gain 0.06, every 2.5 s, 0.6 s long).
- Wim Hof breaths: inhale = 25 ms noise burst (gain 0.08) plus an inhale swell over the full
  1.5 s; exhale = an exhale fade over the full 1.5 s.
- Kapalabhati: the passive half-beat inhale gets a very soft swell (432 Hz, gain 0.05); the sharp
  exhale gets the pluck.
- Pause stops every node; resume replays the plan for the remaining seconds (noise bursts
  are not replayed).
- Test: for every exercise and every phase of its first cycle, tones start at 0, the latest
  tone ends at the phase duration (±1 ms), and attack + release ≤ duration.

### A15. SEO and answer-engine optimisation (v1.3, extends A4)

- Crawlers that don't execute JavaScript (most AI crawlers) must see the content. The eight
  exercise cards are pre-rendered into index.html between `<!-- generated:cards:start/end -->`
  markers from EXERCISES; renderCards() replaces them with identical DOM at runtime. Card
  titles are h3, under an sr-only h2 "Breathing exercises".
- A `<noscript>` note says the timer needs JavaScript and links llms-full.txt.
- Visible FAQ (`#faq`, "Questions") after the cards: native <details class="faq-item"> with
  <summary> question and one <p> answer, answer-first, hedged, with no medical claims beyond the
  cited benefits. Eight questions: anxiety, sleep, box breathing how-to, coherent breathing,
  how long to practise, Wim Hof safety, free/private, phones and direct links.
- JSON-LD is one generated `@graph` between `<!-- generated:jsonld -->` markers: Organization
  (Serverless Ventures LLC), WebSite, WebApplication (description, HealthApplication, free Offer,
  image og-image.jpg, featureList of all patterns, browserRequirements), ItemList of the eight
  exercises with their #id URLs, and FAQPage generated from the visible FAQ. It is never
  hand-edited.
- <head>: title "nisvasa — Free Guided Breathing Exercises: Box, 4-7-8, Wim Hof"; a ~155-character
  description; robots `index, follow, max-image-preview:large, max-snippet:-1`; author;
  application-name; theme-color (JS updates it to the mood's first gradient stop); canonical;
  hreflang en and x-default; llms and sitemap alternates; Open Graph (type, site_name, locale,
  title, description, url, image 1200×630 with alt) and Twitter summary_large_image.
- Opening an exercise sets `document.title` to "<Name> (<Sanskrit>) — nisvasa"; returning to
  the library restores it.
- Masthead subtitle is descriptive: "Free guided breathing exercises for calm, sleep, focus and
  energy" (the h1 stays "breathe").
- llms.txt gains a "Common questions" block mapping needs (anxiety, sleep, focus, energy, how
  long) to exercise links; llms-full.txt includes the full FAQ and notes the sound timing.
- sitemap.xml uses the image extension for og-image.jpg and icon-512.png; lastmod is updated
  with content changes.
- Hash routes (#box…) are not separate URLs to search engines. Per-exercise static pages
  would need multiple HTML files and are out of scope while the app stays single-file.

### A16. Responsive layout (v1.3)

- The breath circle is sized as a ratio: JS sets `--circle-size` to size/CIRCLE_MAX_SIZE
  (0.5714 at rest, 1 at full inhale), and CSS renders
  `--circle-render: calc(var(--circle-cap) * var(--circle-size))`. The 160:280 proportion holds
  everywhere, and a cap below 160 px can no longer freeze the animation. freezeCircle() converts
  the live width back into a ratio (stage = cap × STAGE_TO_CIRCLE 1.16).
- `--circle-cap`: `min(260px, 78vw, 38svh)` on phones, `min(300px, 40svh)` from 601 px, so the
  circle shrinks on short screens instead of pushing the controls off-screen.
- Controls: 8px gaps; volume slider `clamp(64px, 22vw, 112px)`. On 320 px the slider may wrap
  to its own line but stays in view.
- `@media (max-height: 700px)`: practice gap 14px, name pill 13px, phase label 32px, hint 16px.
  `@media (max-height: 460px)` (landscape phones): gap 8px, name pill hidden, phase label 26px,
  hint 14px.
- Tested sizes (smoke test, iframes over local HTTP): 320×568, 375×667, 414×896, 768×1024 and
  667×375. At each, the home page has no horizontal scroll and, in practice, the stop, sound and
  volume controls end within the viewport.

### A17. Skills and tests (v1.3)

- `sync-llms` is renamed `sync-content` and now regenerates the pre-rendered cards, the JSON-LD
  graph and llms-full.txt. `--check` exits 1 if anything is stale; validate runs it. Output is
  idempotent: two runs produce identical files.
- New `brand-assets` skill regenerates all raster icons and the share image (see A13).
- The validator also requires the brand files, CNAME, the FAQ, the pre-rendered cards, the icon
  links, og:image and soundPlan.
- CI lint checks the JSON-LD graph (WebApplication with 8 features, ItemList of 8, FAQPage with
  at least 5 questions) and the icon PNG dimensions.
- tests/smoke.sh now serves the page over local HTTP (python3 -m http.server on a free port,
  stopped on exit) and runs 51 checks, adding: page title per exercise, theme colour per mood,
  sound spans for every phase, circle proportions, JSON-LD/FAQ/icon wiring, and the five device
  sizes. A deliberately shortened inhale tone fails exactly the sound check.

---

## Original full prompt (v1.0)

The text below is the prompt exactly as first given. Where it conflicts with the v1.1
amendments above, the amendments win.

## EXECUTION INSTRUCTIONS — READ FIRST

Work autonomously from start to finish without stopping.
Do not ask for confirmation at any step.
Do not pause to summarize progress mid-task.
Do not stop to ask clarifying questions — make a reasonable decision and continue.
If a file write requires permission, proceed without asking.
Only stop when the VALIDATION STEP at the end of this prompt reports all items PASS.
You are not done until the validator confirms everything is complete and correct.

---

## TASK

Build a complete, self-contained static HTML web application for guided breathing exercises.
The app must be a single HTML file with all CSS and JavaScript inline — no external dependencies
except system fonts and the Web Audio API (built into the browser). No frameworks, no build tools,
no npm. One file, opens in any browser.

The app will be hosted on GitHub Pages. The root file must be index.html.
Include a README.md and a GitHub Actions deploy workflow.

---

## DESIGN PHILOSOPHY

This app must feel like a digital sanctuary. Every visual decision — color, spacing, motion,
typography — serves one purpose: to slow the user down the moment they arrive.

The user should feel their shoulders drop within 3 seconds of opening the app.

Inspiration references:
- The stillness of a Japanese zen garden at dawn
- Fog moving slowly across still water
- The interior of a Japanese onsen or meditation hall
- Headspace app's early 2020 era — soft, round, meditative
- Linear gradients that feel like natural light shifting through paper screens (shoji)

This is NOT:
- A fitness app (no bold energy colors, no sharp edges)
- A productivity app (no grid-heavy UI, no aggressive CTAs)
- A medical app (no clinical whites, no sharp typography)

---

## COLOR SYSTEM — "Still Water"

Every color is muted, slightly desaturated, and warm-leaning.
Nothing shouts. Everything whispers.

  /* Base surfaces */
  --bg-deep:        #0D1117   /* near-black with a hint of blue-grey */
  --bg-mid:         #141B22   /* cards and panels */
  --bg-surface:     #1C2530   /* elevated surfaces */

  /* Text */
  --text-primary:   #E8E4DC   /* warm off-white — never pure white */
  --text-secondary: #9EA8B0   /* muted blue-grey for supporting text */
  --text-muted:     #5C6670   /* timestamps, labels, hints */

  /* Technique palette — one per exercise */
  --sage:           #7A9E8A   /* Focus & Calm */
  --indigo-soft:    #7B84C0   /* Sleep & Relaxation */
  --gold-muted:     #C4A96A   /* Balance & Clarity */
  --rose-muted:     #B87A7A   /* Stress Relief */
  --terracotta:     #B8735A   /* Energy & Vitality */
  --teal-soft:      #5A9098   /* Heart Rate Variability */
  --amber-soft:     #C49050   /* Energise & Detox */
  --lavender-soft:  #8E85B8   /* Instant Calm */

  /* Accents */
  --glow-white:     rgba(232, 228, 220, 0.06)
  --divider:        rgba(232, 228, 220, 0.08)

Background: --bg-deep always.
Subtle full-page radial gradient: radial-gradient(ellipse at 50% 40%, #1a2535 0%, #0D1117 70%)
No texture, no pattern, no noise — pure gradient only.

---

## TYPOGRAPHY

Heading font: Georgia, 'Times New Roman', serif
  Letter-spacing: 0.04em on headings, 0.12em on ALL CAPS labels
  Font-weight: 300 for large display text

Body font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  Line-height: 1.8

Type scale:
  App name:        48px, serif, weight 300, letter-spacing 0.08em
  Exercise names:  24px, serif, weight 400
  Phase label:     36px, serif, weight 300, letter-spacing 0.12em
  Body text:       15px, sans-serif, weight 400, line-height 1.8
  Labels/badges:   11px, sans-serif, weight 500, UPPERCASE, letter-spacing 0.1em
  Timer countdown: 56px, serif, weight 200

---

## MOTION PHILOSOPHY

All motion is slow, intentional, and breath-like.
Minimum transition: 300ms. Easing: cubic-bezier(0.4, 0, 0.2, 1).
Page transitions: views fade in over 400ms.
The breathing circle is the ONLY element that moves significantly.
No bouncing, no spinning, no sliding panels.

Background breathes:
  @keyframes bg-breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }
  8s cycle, ease-in-out, barely perceptible.

---

## BREATHING CIRCLE

Resting: 160px. Full inhale: 280px. border-radius: 50%.
Fill: transparent. Border: 1.5px solid technique color at 60% opacity.
Outer glow: box-shadow 0 0 40px 8px technique color at 20% opacity.
Inner ring: 80% size circle at 15% opacity.
Outer ring: 110% size circle at 5% opacity.

Inhale: expands, glow 20% → 35%
Hold: max size, glow pulses 35% → 25%
Exhale: contracts, glow 35% → 15%
Rest hold: min size, glow 15% → 8%

CSS custom properties: --circle-size, --glow-opacity, --ring-opacity
JS sets these at phase start. CSS transition duration set by JS to match phase duration.
transition: width {duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95),
            height {duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95),
            box-shadow {duration}ms ease-in-out

---

## AMBIENT ELEMENTS

Floating particles (practice screen only):
  6–8 dots, 2–3px, opacity 0.06, float upward over 12–18s, staggered, looping.
  Pure CSS @keyframes float. Color: --text-primary.

Horizon line (home screen):
  1px horizontal line at 50vh, opacity 0.05, full viewport width.

Card shimmer on hover:
  linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)
  Moves left to right over 600ms on hover. CSS only.

---

## BREATHING EXERCISES — ALL 8

1. Box Breathing (Sama Vritti)
   Category: Focus & Calm  |  Color: --sage
   Benefits: Regulates the nervous system and reduces stress by creating a symmetrical
   breathing rhythm. Used by Navy SEALs and athletes to achieve mental clarity under
   pressure. Balances the sympathetic and parasympathetic nervous system.
   Pattern: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s
   Completion: "You found the square. Carry its stillness with you."

2. 4-7-8 Breathing (Pranayama)
   Category: Sleep & Relaxation  |  Color: --indigo-soft
   Benefits: Activates the parasympathetic nervous system and naturally slows heart rate.
   Dr. Andrew Weil calls it a natural tranquilizer for the nervous system. Particularly
   effective for anxiety and falling asleep.
   Pattern: Inhale 4s → Hold 7s → Exhale 8s
   Completion: "Sleep comes to those who release. You have released."

3. Alternate Nostril Breathing (Nadi Shodhana)
   Category: Balance & Clarity  |  Color: --gold-muted
   Benefits: Clears blocked energy channels and brings balance to the left and right
   hemispheres of the brain. Reduces blood pressure and promotes mental clarity.
   In yogic tradition, it purifies the subtle body's energy channels.
   Pattern: Inhale 4s → Hold 2s → Exhale 4s → Hold 2s
   Note: Show CSS/SVG hand position guide.
   Completion: "Both rivers flow clear now."

4. Bhramari (Humming Bee Breath)
   Category: Stress Relief  |  Color: --rose-muted
   Benefits: The vibration created by humming stimulates the vagus nerve and triggers
   an immediate calming response. Reduces anxiety, anger, and insomnia. Used in yoga
   therapy for high blood pressure and migraines.
   Pattern: Inhale 4s → Hold 2s → Exhale 6s (hum)
   Note: Show finger placement for eyes and ears.
   Completion: "The hum fades. The quiet remains."

5. Wim Hof Breathing
   Category: Energy & Vitality  |  Color: --terracotta
   Benefits: Alkalizes the blood and floods the body with oxygen, creating a natural
   high and surge of energy. Builds stress resilience and has been shown in studies
   to influence immune response. Not recommended during pregnancy or cardiovascular conditions.
   Pattern: 30 deep breath cycles → Retention hold → Recovery inhale hold 15s → 3 rounds
   Note: Show safety warning card before starting.
   Completion: "You have breathed fire and returned to stillness."

6. Coherent Breathing (Resonance Breathing)
   Category: Heart Rate Variability  |  Color: --teal-soft
   Benefits: Breathing at exactly 5 breaths per minute maximizes heart rate variability
   and puts the cardiovascular and respiratory systems into resonance. Associated with
   reduced anxiety, improved mood, and better athletic performance.
   Pattern: Inhale 5.5s → Exhale 5.5s
   Completion: "Your heart found its rhythm."

7. Kapalabhati (Skull Shining Breath)
   Category: Energise & Detox  |  Color: --amber-soft
   Benefits: Rapid diaphragmatic pumping cleanses the respiratory tract and energises
   the mind. Stimulates the digestive organs and builds core heat. Clears mental fog
   and is a cleansing kriya rather than pranayama.
   Pattern: Passive inhale → Sharp forceful exhale 0.5s → 30 pumps → Rest
   Note: Implement as pump counter with pulsing visual on each pump.
   Completion: "The skull shines. The mind is clear."

8. Physiological Sigh (Double Inhale)
   Category: Instant Calm  |  Color: --lavender-soft
   Benefits: Discovered by Stanford researchers as the fastest way to reduce stress
   in real time. The double inhale fully inflates deflated air sacs, maximising CO2
   offload on the long exhale. Even one cycle has a measurable calming effect.
   Pattern: Inhale 2s → Second sniff 1s → Long exhale 6s
   Completion: "One breath. That was enough."

---

## SCREEN DESIGNS

### Home Screen
- Centered, single column, max-width 680px
- App name: "breathe" lowercase, 48px serif weight 300, letter-spacing 0.1em
- Subtitle: "guided breathing practice" 12px uppercase, --text-muted, letter-spacing 0.2em
- 1px horizon line full width, opacity 0.06
- 8 cards in 2-column grid (desktop) / 1-column (≤600px)
- Footer: "be still. breathe." 12px italic serif, centered, --text-muted

Cards:
- Background: --bg-mid, border: 1px solid --divider, border-radius: 12px, padding: 28px
- Hover: translateY(-3px), box-shadow: 0 8px 32px rgba(0,0,0,0.3)
- Category badge: 10px uppercase, technique color at 90%, bg technique color at 10%
- Exercise name: 20px serif, --text-primary
- Sanskrit name: 13px italic, --text-muted
- Teaser: 14px sans-serif, --text-secondary, line-height 1.6
- Begin button: full width, 44px, transparent bg, 1px border technique color 40%,
  text technique color, 12px uppercase. Hover: bg technique color 12%

### Detail Screen
- Back: "← library" 12px uppercase --text-muted
- Exercise name: 36px serif weight 300
- Sanskrit name: 16px italic, technique color 80%
- Benefits: 3 paragraphs, each with small circle dot in technique color
- Pattern visualiser: horizontal bar, phases proportional to duration,
  labeled with name and seconds, rounded ends
- Session selector: 3min / 5min / 10min / custom pills
- Start button: full width 52px, "begin practice" 13px uppercase

### Practice Screen
- Full viewport, --bg-deep mixed with technique color at 8%
- Three concentric rings (circle system as described above)
- Phase label: 32px serif weight 300, letter-spacing 0.14em
- Countdown: 52px serif weight 200, technique color 90%
- Floating particles: 6 dots, slow upward float
- Progress bar: 2px full width, technique color fill
- Elapsed / total time: 12px --text-muted
- Controls: Stop, Pause/Resume, Sound toggle — 40px circles, --bg-surface

Completion overlay:
- rgba(13, 17, 23, 0.92) backdrop
- Completion chime plays
- "practice complete" 13px uppercase --text-muted
- Time and cycles: 28px serif --text-primary
- Unique completion message per exercise (see list above)
- "practice again" and "back to library" buttons

---

## AUDIO

All synthesised via Web Audio API. No audio files.

Phase tones:
  Inhale:  432 Hz, sine, gain 0.18, 60ms attack, 400ms total
  Hold:    324 Hz, sine, gain 0.10, 200ms attack, sustain
  Exhale:  360 Hz, sine, gain 0.15, 600ms release
  Rest:    216 Hz, sine, gain 0.06, pulse every 2.5s

Technique-specific:
  Kapalabhati: 880 Hz chirp, 40ms, gain 0.12
  Wim Hof:     noise burst, 25ms, gain 0.08
  Bhramari:    220 Hz + 440 Hz + 660 Hz mix, gain 0.08, full exhale duration

Completion chime: 396 Hz → 528 Hz → 660 Hz, 400ms each, 100ms gap

Volume: slider, default 55%, AudioContext.masterGain drives all nodes.
When muted: suspend AudioContext entirely.

---

## TECHNICAL IMPLEMENTATION

Timer:
  performance.now() for elapsed time. setInterval at 100ms for UI only.
  phaseStartTime = performance.now() at each phase transition.
  Prevents drift on long sessions.

Circle animation:
  CSS custom properties: --circle-size, --glow-opacity, --ring-opacity
  JS sets at phase start. CSS transition duration matches phase duration.

State object:
  { exercise, duration, phase, cycle, totalElapsed, phaseElapsed,
    isPaused, isMuted, volume, intervalId, phaseStartTime, sessionStartTime }

Views: id="view-list", id="view-detail", id="view-practice"
  .view { display: none; opacity: 0; transition: opacity 400ms ease; }
  .view.active { display: block; opacity: 1; }
  showView(id) removes .active from all, adds to target.

Accessibility:
  aria-live="polite" region id="phase-announcer"
  All buttons have aria-label
  Focus styles: 2px outline in technique color, offset 3px
  prefers-reduced-motion: transition: none on circle, timer still works

Responsive:
  ≤600px: 1 column, circle max 260px, phase label 24px, countdown 40px
  ≥601px: 2 column cards, circle max 300px
  ≥1024px: card grid max-width 760px centered
  All touch targets minimum 48x48px

---

## WHAT NOT TO BUILD
- No external dependencies
- No localStorage
- No user accounts
- No PWA manifest
- No CSS or JS frameworks
- No canvas (use CSS for all animation)

---

## GITHUB PAGES SETUP

Files to create:
  index.html
  README.md
  .github/workflows/deploy.yml

deploy.yml:
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
    workflow_dispatch:
  permissions:
    contents: read
    pages: write
    id-token: write
  concurrency:
    group: pages
    cancel-in-progress: false
  jobs:
    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/configure-pages@v5
        - uses: actions/upload-pages-artifact@v3
          with:
            path: '.'
        - id: deployment
          uses: actions/deploy-pages@v4

README.md:
  # breathe
  Guided breathing exercises. Calm, minimal, meditative.
  Live: https://{username}.github.io/{repo-name}/
  Local: open index.html in any browser. No server needed.
  Deploy: push to main → GitHub Actions deploys automatically.
  Settings → Pages → Source → GitHub Actions.

---

## VALIDATION STEP — DO NOT SKIP

After writing all three files, act as a second independent reviewer
who has not seen the code being written. Read each file from scratch
and verify every item in this checklist. Report PASS or FAIL for each.

STRUCTURE
- [ ] index.html is a single valid HTML document
- [ ] All CSS is inside <style> tags — no external stylesheets
- [ ] All JS is inside <script> tags — no external scripts
- [ ] No external font imports
- [ ] No external JS libraries or CDN links
- [ ] Web Audio API used — no <audio> tags, no audio file URLs
- [ ] No canvas element used anywhere

COMPLETENESS
- [ ] All 8 breathing exercises present with correct names
- [ ] All 8 patterns correct (verify each inhale/hold/exhale/hold duration)
- [ ] Three screens: view-list, view-detail, view-practice
- [ ] Session selector: 3min, 5min, 10min, custom
- [ ] Pause, Resume, Stop, Sound toggle all present
- [ ] Unique completion message exists for all 8 exercises
- [ ] Floating particles present in practice screen
- [ ] Progress bar present in practice screen
- [ ] Pattern visualiser present in detail screen
- [ ] Three concentric rings in practice screen
- [ ] Horizon line on home screen
- [ ] Footer "be still. breathe." on home screen

TECHNICAL CORRECTNESS
- [ ] performance.now() used for timer drift prevention
- [ ] CSS custom properties --circle-size, --glow-opacity, --ring-opacity present
- [ ] AudioContext.masterGain used for volume
- [ ] AudioContext suspended when muted (not just gain set to 0)
- [ ] showView() function handles fade transition
- [ ] aria-live="polite" region present with id="phase-announcer"
- [ ] prefers-reduced-motion media query present
- [ ] All touch targets at least 48x48px
- [ ] Responsive breakpoint at 600px present

GITHUB PAGES
- [ ] Root file is named exactly index.html
- [ ] deploy.yml exists at .github/workflows/deploy.yml
- [ ] deploy.yml uses actions/checkout@v4
- [ ] deploy.yml has permissions block with contents, pages, id-token
- [ ] deploy.yml has concurrency block
- [ ] README.md exists with deployment instructions

For every FAIL: identify the exact location in the file, describe what
is wrong, fix it immediately, then re-check that item.

Repeat the full checklist until every single item reports PASS.

Only after all items PASS, output this exact line:
  ✓ VALIDATION COMPLETE — ALL CHECKS PASSED

Then provide the three git commands to push to GitHub and the one
GitHub Settings step to activate Pages.

---

## AGENT REPOSITORY FILES

After completing and validating the three application files, generate the
following agent harness files in the repository root. These files make the
repository self-navigable by any AI agent (Claude Code, Pi, Goose, OpenCode,
Cursor, Copilot, Gemini CLI) without needing to read source code first.

Repository structure after this step:
  breathing-app/
  ├── index.html
  ├── README.md
  ├── PROMPT.md
  ├── CLAUDE.md
  ├── AGENTS.md
  ├── SKILLS.md
  ├── SOUL.md
  └── .github/
      └── workflows/
          └── deploy.yml

---

### PROMPT.md

The original build specification. Preserves the full prompt that generated
this project so future agents understand the design intent, not just the code.

Content:
  # breathe — Original Build Prompt

  This file preserves the complete specification used to generate this project.
  It is the source of truth for design decisions, color choices, audio design,
  and feature scope. When modifying the app, consult this file to understand
  why decisions were made, not just what was built.

  ## Design intent
  A digital sanctuary. Zen. Still Water palette. Warm dark backgrounds.
  Slow motion. No external dependencies. Single HTML file.

  ## What was intentionally excluded
  - No external fonts (system stack only)
  - No canvas (CSS animation only)
  - No localStorage
  - No frameworks
  - No PWA manifest

  ## If you are adding a new breathing exercise
  Follow the existing exercise config object structure in index.html.
  Each exercise requires: id, name, sanskrit, category, color, teaser,
  benefits (array of 3), pattern (array of phase objects), completion message.
  Add it to the EXERCISES array. The UI renders it automatically.

  ## If you are changing the visual theme
  All colors are CSS custom properties on :root in index.html.
  Change them there. Do not hardcode colors anywhere else.

  ## Original full prompt
  [paste the full prompt here when saving this file]

---

### CLAUDE.md

Claude Code specific context. Read by Claude Code on session start.

Content:
  # breathe — Claude Code Context

  @import AGENTS.md

  ## What this project is
  A single-file static HTML breathing exercise app. No build step.
  No dependencies. Hosted on GitHub Pages. index.html is the entire app.

  ## Key entry points
  | What                  | Where                              |
  |-----------------------|------------------------------------|
  | All app code          | index.html (single file)           |
  | Color tokens          | :root CSS custom properties        |
  | Exercise data         | const EXERCISES array in <script>  |
  | State management      | const state = {} object            |
  | View switching        | showView(id) function              |
  | Timer logic           | startTimer() / pauseTimer()        |
  | Audio engine          | initAudio() / playTone()           |
  | Circle animation      | updateCircle(phase) function       |
  | GitHub Actions deploy | .github/workflows/deploy.yml       |

  ## Before making any change
  1. Read SOUL.md — understand what this project cares about
  2. Read the relevant function in index.html before editing it
  3. Do not add external dependencies — the no-dependency constraint is intentional
  4. Do not add localStorage — intentional, each session starts fresh
  5. Run the validation checklist in PROMPT.md after any significant change

  ## Common tasks

  Adding a new exercise:
    Find the EXERCISES array in index.html.
    Copy an existing exercise object.
    Set: id, name, sanskrit, category, color (CSS var name), teaser,
    benefits (3 strings), pattern (array of {phase, duration, label}),
    completion (one sentence, poetic).
    The UI renders it automatically — no other changes needed.

  Changing a color:
    Edit the CSS custom property on :root only.
    Never hardcode a color anywhere else in the file.

  Changing audio:
    Edit the playTone() function or the technique-specific audio blocks.
    All audio is Web Audio API. No audio files. Never add <audio> tags.

  Deploying:
    git add . && git commit -m "feat: description" && git push origin main
    GitHub Actions deploys automatically. Check Actions tab for status.

  ## PR checklist (run before opening every PR)
    - [ ] index.html opens in browser with no console errors
    - [ ] All 8 exercises load and their timers run correctly
    - [ ] Audio plays on at least one exercise
    - [ ] No external dependencies added
    - [ ] No console.log statements left in code
    - [ ] Passes the full validation checklist in PROMPT.md

  ## Claude-specific notes
  - Start new sessions for new features — do not let context grow stale
  - CLAUDE.local.md is gitignored — use it for personal session notes
  - The entire app is one file — read it in full before making changes

---

### AGENTS.md

Universal cross-harness context. Read by Pi, Goose, OpenCode, Cursor,
Copilot, Gemini CLI, and any other agent that enters this repository.
Keep it short and dense — agents extract rules, not rationale.

Content:
  # breathe

  Single-file static HTML breathing exercise app.
  8 guided breathing techniques with animated visuals and Web Audio API sound.
  Hosted on GitHub Pages. No build step. No dependencies.

  ## The only file that matters
  index.html — contains 100% of the app: HTML, CSS, JavaScript, all data.
  Do not split it into multiple files. The single-file constraint is intentional.

  ## Run locally
  Open index.html in any browser. That is all.

  ## Deploy
  git push origin main
  GitHub Actions (.github/workflows/deploy.yml) deploys to GitHub Pages automatically.

  ## Key structures inside index.html

  const EXERCISES = [...]
    Array of exercise config objects. Add new exercises here.
    Each object: { id, name, sanskrit, category, color, teaser, benefits[], pattern[], completion }

  const state = {}
    All runtime state. Never use localStorage. Never use globals outside this object.

  showView(id)
    Switches between view-list, view-detail, view-practice.
    Always use this function — never toggle display directly.

  startTimer() / pauseTimer() / stopTimer()
    Timer control. Uses performance.now() internally. Do not use setInterval for timing.

  playTone(freq, duration, gain)
    Audio. Web Audio API only. Never add <audio> tags or audio file references.

  updateCircle(phase)
    Sets --circle-size, --glow-opacity, --ring-opacity CSS custom properties.
    CSS handles the transition. Never animate the circle with JS directly.

  ## Rules
  NEVER add external CSS files, JS files, or CDN links
  NEVER add localStorage or sessionStorage
  NEVER add a build step or package.json
  NEVER use canvas for animation
  NEVER add audio files — all sound is Web Audio API synthesis
  NEVER commit directly to main — use a feature branch and PR
  NEVER leave console.log in committed code
  ALWAYS use performance.now() for timing — never setInterval alone

  ## Git
  Branches: feature/*, fix/*, chore/*, docs/* off main
  Commits: feat: / fix: / chore: / docs: / style: / refactor:
  PRs: must pass the checklist in CLAUDE.md before merging

---

### SKILLS.md

Agent skills registry. Documents available skills in .agent/skills/.

Content:
  # breathe — Skills Registry

  Skills available in .agent/skills/. Each is a directory with SKILL.md
  and an executable run.sh. Agents load skills on demand.

  ## Available skills

  | Skill            | Directory                     | When to use                              |
  |------------------|-------------------------------|------------------------------------------|
  | validate         | .agent/skills/validate/       | Verify index.html against full checklist |
  | add-exercise     | .agent/skills/add-exercise/   | Add a new breathing exercise correctly   |
  | deploy-check     | .agent/skills/deploy-check/   | Verify GitHub Actions deploy config      |
  | audit-deps       | .agent/skills/audit-deps/     | Confirm no external dependencies crept in|

  ## Skill format
  .agent/skills/{name}/SKILL.md   — description, when to use, parameters
  .agent/skills/{name}/run.sh     — executable entry point

  ## validate skill (create this file)

  .agent/skills/validate/SKILL.md:
    ---
    name: validate
    description: >
      Verify index.html is complete and correct against the full 34-item
      checklist. Use after any change to index.html before opening a PR.
    ---
    Run: bash .agent/skills/validate/run.sh
    Reports PASS or FAIL per item. Fixes failures automatically.

  .agent/skills/validate/run.sh:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "── Validating index.html ────────────────────────"
    # Check no external script tags
    if grep -q 'src="http' index.html; then
      echo "✗ FAIL: external script src found"
      exit 1
    fi
    # Check no external stylesheets
    if grep -q '<link.*stylesheet' index.html; then
      echo "✗ FAIL: external stylesheet found"
      exit 1
    fi
    # Check all 8 exercises present
    for name in "Box Breathing" "4-7-8" "Nadi Shodhana" "Bhramari" \
                "Wim Hof" "Coherent" "Kapalabhati" "Physiological Sigh"; do
      if ! grep -q "$name" index.html; then
        echo "✗ FAIL: exercise missing: $name"
        exit 1
      fi
    done
    # Check performance.now usage
    if ! grep -q 'performance.now' index.html; then
      echo "✗ FAIL: performance.now() not used for timer"
      exit 1
    fi
    # Check aria-live region
    if ! grep -q 'aria-live' index.html; then
      echo "✗ FAIL: aria-live region missing"
      exit 1
    fi
    echo "✓ PASS: all checks passed"

---

### SOUL.md

Behavioral constitution for any agent working in this repository.
Values, constraints, and identity. Loads as identity block in Hermes Agent.
No build commands or file paths — those belong in AGENTS.md.

Content:
  # breathe — Soul

  ## Identity
  You are a contributor to breathe, a free, open, single-file breathing
  exercise app. Your purpose is to help people slow down, breathe intentionally,
  and find stillness — through code that is as calm and considered as the
  practice it guides.

  ## What this project values

  Simplicity over cleverness.
  The app is one HTML file. That is a feature, not a limitation. Every
  proposal to split it, add a build step, or introduce a framework must
  justify itself against the cost of added complexity for a user who just
  wants to open a file and breathe.

  Beauty through restraint.
  The Still Water palette, the slow motion, the whispered typography — these
  are intentional. Adding bold colors, fast animations, or aggressive CTAs
  would break the sanctuary. When in doubt, do less.

  Accessibility is not optional.
  aria-live regions, keyboard navigation, reduced motion support, and
  48px touch targets are not nice-to-haves. They are part of what it means
  for this app to be genuinely useful to everyone.

  No dependencies means no dependencies.
  Not one. Not a small one. Not just for fonts. The zero-dependency constraint
  is what makes this app trustworthy — a user can inspect the entire app in
  one file, in one browser tab, with no network calls.

  ## Hard constraints
  NEVER add external dependencies of any kind
  NEVER add a build step
  NEVER add localStorage — each session is intentionally fresh
  NEVER use canvas for animation — CSS is the right tool here
  NEVER commit directly to main
  NEVER leave console.log in committed code
  NEVER make the single-file architecture multi-file without explicit approval

  ## What good work looks like here
  - A change that makes the app calmer, not busier
  - A new exercise that follows the exact same config structure as the others
  - A bug fix that includes a comment explaining why the bug existed
  - A PR small enough to review in 10 minutes
  - Code that reads as clearly as the app feels

  ## When you are unsure
  Read PROMPT.md for the original design intent.
  Read AGENTS.md for the technical rules.
  If still unsure: do less. The app is better for what it leaves out.

  ## Tone
  Comments in code are calm and direct. No jokes, no TODO lists,
  no commented-out code. Every comment explains why, not what.

---

## CODE QUALITY AND SANITY

Apply these standards throughout index.html.

### JavaScript
  - No var — use const and let only
  - No loose equality — use === and !== always
  - No console.log in committed code
  - No magic numbers — define named constants at the top of the script:
      const CIRCLE_MIN_SIZE = 160;
      const CIRCLE_MAX_SIZE = 280;
      const TIMER_INTERVAL_MS = 100;
      const DEFAULT_SESSION_DURATION = 300;
      const DEFAULT_VOLUME = 0.55;
  - Functions are small and single-purpose (under 30 lines each)
  - The state object is the only mutable global
  - Event listeners are added once, never duplicated
  - AudioContext is created once and reused (never recreated per phase)
  - setInterval reference always stored in state.intervalId and cleared
    via clearInterval(state.intervalId) before starting a new one

### CSS
  - All colors reference CSS custom properties — never hardcoded hex values
  - All animation durations reference CSS custom properties where dynamic:
      --phase-duration set by JS, used in transition declarations
  - No !important
  - No inline styles set via element.style except for the circle CSS vars
    (--circle-size, --glow-opacity, --ring-opacity) — those are intentional
  - Mobile-first: base styles for ≤600px, media queries add desktop styles

### HTML
  - Semantic elements: <main>, <section>, <article>, <nav>, <button>
  - No <div> where a semantic element fits
  - All images (if any SVG icons) have aria-label or aria-hidden="true"
  - No inline onclick handlers — all events wired in JavaScript
  - The three views use id="view-list", id="view-detail", id="view-practice"
    and class="view" — never reference them any other way

---

## GIT AND BRANCH STRATEGY

### Branch naming
  feature/{short-description}    new capability
  fix/{short-description}        bug fix
  chore/{short-description}      maintenance, no behavior change
  docs/{short-description}       documentation only
  style/{short-description}      visual/CSS only, no logic change

### Commit message format (Conventional Commits)
  feat: add kapalabhati pump counter visual
  fix: prevent timer drift on sessions over 10 minutes
  chore: update deploy.yml to actions/checkout@v4
  docs: add hand position guide to nadi shodhana detail
  style: soften card hover shadow on mobile
  refactor: extract playTone into reusable audio utility

  Rules:
  - Lowercase subject line
  - Present tense ("add" not "added")
  - No period at the end
  - Under 72 characters
  - If the commit closes a GitHub issue: add "Closes #42" on a blank line after subject

### PR standards
  Title: same format as commit message
  Description must include:
    ## What changed
    [bullet list of specific changes]

    ## Why
    [one sentence rationale]

    ## Tested
    - [ ] Opened index.html in Chrome — no console errors
    - [ ] All 8 exercises open and timer runs
    - [ ] Audio plays on at least one exercise
    - [ ] Checked on mobile viewport (375px)
    - [ ] No external dependencies added
    - [ ] No console.log left in code
    - [ ] deploy.yml not accidentally modified

  Never merge a PR with failing checklist items.
  Self-review before requesting review — read your own diff line by line.

---

## DEPLOYMENT PRACTICES

### Environments
  production    main branch → GitHub Pages (automatic via Actions)
  local         open index.html directly in browser — no server needed

  There is no staging environment for this project.
  Test locally before pushing. GitHub Pages is production.

### Deploy process
  1. Work on a feature branch
  2. Test locally: open index.html in Chrome, Firefox, and Safari (or mobile)
  3. Run: bash .agent/skills/validate/run.sh
  4. Commit with conventional commit message
  5. Push branch and open PR
  6. Verify PR checklist in description
  7. Merge to main
  8. GitHub Actions runs automatically — check the Actions tab
  9. App is live at https://{username}.github.io/{repo-name}/ in ~60 seconds

### What triggers a deploy
  Any push to main — including direct commits (avoid these) and merged PRs.
  workflow_dispatch: allows manual trigger from GitHub Actions UI.

### Rollback procedure
  If a bad deploy reaches production:
  1. Find the last good commit: git log --oneline
  2. Revert: git revert {bad-commit-hash}
  3. Push the revert commit: git push origin main
  4. GitHub Actions redeploys automatically with the reverted code
  Never force-push to main. Always revert forward.

### Monitoring the deploy
  GitHub repository → Actions tab → "Deploy to GitHub Pages" workflow
  Green checkmark = deployed successfully
  Red X = deploy failed — click the workflow run for error details
  Common failure: deploy.yml YAML syntax error (check indentation)

### Version tagging (optional but recommended)
  After significant releases, tag the commit:
    git tag -a v1.0.0 -m "Initial release — 8 breathing exercises"
    git push origin v1.0.0
  Tag format: v{major}.{minor}.{patch} following semver
  Tags appear in GitHub Releases and help track when features shipped

---

## FINAL OUTPUT

All files to generate in order:

  1. index.html          — complete app
  2. README.md           — setup and deployment instructions
  3. .github/workflows/deploy.yml  — GitHub Actions workflow
  4. PROMPT.md           — original build specification
  5. CLAUDE.md           — Claude Code context
  6. AGENTS.md           — universal agent context
  7. SKILLS.md           — skills registry
  8. SOUL.md             — behavioral constitution
  9. .agent/skills/validate/SKILL.md  — validate skill description
  10. .agent/skills/validate/run.sh   — validate skill script

Then run the full validation checklist.
Only stop when ✓ VALIDATION COMPLETE — ALL CHECKS PASSED is reached.

Provide git commands to push all files and the GitHub Settings step to activate Pages.
