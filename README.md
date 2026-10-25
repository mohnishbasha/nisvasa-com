# nisvasa — breathe

Guided breathing exercises. Calm, minimal, meditative.

**Live:** https://nisvasa.com/

## Run locally

Open `index.html` in any browser. You don't need a server, a build step or any dependencies.

## Exercises

Each exercise has a direct link, `https://nisvasa.com/#<id>`.

| Exercise | Link id | Category | Pattern |
|---|---|---|---|
| Box Breathing (Sama Vritti) | `box` | Focus & Calm | inhale 4 · hold 4 · exhale 4 · hold 4 |
| 4-7-8 Breathing (Pranayama) | `four-seven-eight` | Sleep & Relaxation | inhale 4 · hold 7 · exhale 8 |
| Alternate Nostril Breathing (Nadi Shodhana) | `nadi-shodhana` | Balance & Clarity | inhale 4 · hold 2 · exhale 4 · hold 2 |
| Bhramari (Humming Bee Breath) | `bhramari` | Stress Relief | inhale 4 · hold 2 · hum 6 |
| Wim Hof Breathing | `wim-hof` | Energy & Vitality | 30 breaths · 60s retention · 15s recovery hold · 3 rounds |
| Coherent Breathing (Resonance) | `coherent` | Heart Rate Variability | inhale 5.5 · exhale 5.5 |
| Kapalabhati (Skull Shining Breath) | `kapalabhati` | Energise & Detox | deep inhale · 30 pumps (0.5s) · 30s rest |
| Physiological Sigh (Double Inhale) | `physiological-sigh` | Instant Calm | inhale 2 · sniff 1 · exhale 6 |

All sound is synthesised in the browser with the Web Audio API. The app uses no audio files, no web fonts and no frameworks.

## Mood light

The bulb button (on the home screen and in the practice controls) re-tints the whole page. There are six moods: **Fresh** (default), **Dawn**, **Ocean**, **Dusk**, **Forest** and **Midnight**. The last two are low-light moods for evenings and sleep. The look follows the [serverlessvc.com](https://serverlessvc.com) design language. The choice isn't saved: no storage is used, so every visit starts on Fresh.

## Privacy, terms and copyright

The footer opens the privacy statement and terms of use as in-page dialogs. The app collects nothing: no accounts, analytics, cookies or storage. The legal text is a plain-language draft; have it reviewed before relying on it.

© Serverless Ventures LLC — https://www.serverlessvc.com

## Advertising (off by default)

A reserved ad slot sits on the library screen only, never during practice. To turn it on:

1. In `index.html`, set `AD_CONFIG.enabled = true`, pick `provider` (`'ethicalads'` or `'adsense'`) and fill in its IDs.
2. Add the network's line to `ads.txt`. It is only read at the domain root, so it needs the custom domain.
3. Check the privacy statement: its advertising section appears automatically when ads are on.
4. For AdSense, add a consent banner for EU/UK visitors before going live.

## Agent readiness

| File | Purpose |
|---|---|
| `llms.txt` | Curated summary for AI assistants (llmstxt.org format) |
| `llms-full.txt` | Full content, generated from `index.html`. Don't edit by hand |
| `robots.txt` | Allows all crawlers; content signals `search=yes, ai-input=yes, ai-train=no` |
| `sitemap.xml` | Home page and the llms files |
| `.well-known/security.txt` | Security contact (RFC 9116) |
| JSON-LD in `index.html` | `WebApplication` structured data with every exercise |

For coding agents: `AGENTS.md` (rules), `CLAUDE.md` (Claude Code context), `SOUL.md` (values), `SKILLS.md` (skills in `.agent/skills/`) and `PROMPT.md` (full spec and requirement history).

```bash
bash .agent/skills/validate/run.sh     # full checklist, exits non-zero on failure
bash .agent/skills/sync-llms/run.sh    # regenerate llms-full.txt after content changes
bash .agent/skills/add-exercise/run.sh # template and checklist for a new exercise
```

## Tests and CI

```bash
bash .agent/skills/validate/run.sh   # project checklist, deploy shape, dependency audit, llms sync
bash tests/smoke.sh                  # clicks through the real app in headless Chrome
```

The smoke test needs only bash, Python 3 and Chrome. Set `CHROME=/path/to/chrome` if it isn't found.

`.github/workflows/ci.yml` runs on every push and pull request:

| Job | What it checks |
|---|---|
| validate | The full project checklist (`.agent/skills/validate`) |
| html | W3C Nu HTML Checker: errors fail the build, warnings are reported |
| smoke | Headless Chrome click-through: every exercise, controls, moods, dialogs, deep links, a completed session |
| lint | shellcheck, actionlint, JavaScript syntax, sitemap and JSON-LD parsing |

In **Settings → Branches**, protect `main` and require these four checks, so a failing build can't be merged and deployed.

## Deploy

Push to `main` and GitHub Actions (`.github/workflows/deploy.yml`) deploys the site automatically. You can also start a deploy by hand from the Actions tab.

One-time setup:
1. **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Pages → Custom domain → `nisvasa.com`**, then point the domain's DNS at GitHub Pages. The canonical URL, sitemap, llms files and `ads.txt` all assume this domain.

```bash
git init && git add . && git commit -m "feat: initial nisvasa app"
git branch -M main && git remote add origin https://github.com/{username}/{repo-name}.git
git push -u origin main
```

## Safety

Wim Hof breathing and Kapalabhati are vigorous. Practise them seated or lying down, and never in water or while driving. Skip them if you are pregnant or have a cardiovascular condition.
