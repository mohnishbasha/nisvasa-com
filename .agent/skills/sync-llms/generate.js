#!/usr/bin/env node
// Regenerates llms-full.txt from the EXERCISES and MOODS data in index.html,
// so the agent-readable copy can never drift from what the app actually shows.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '../../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const match = html.match(/<script>\n([\s\S]*?)\/\* ── State/);
if (!match) throw new Error('Could not find the data section in index.html');

// Ad builders are referenced by the data section but are not needed to read it
const stubs = 'function buildEthicalAdsUnit() {}\nfunction buildAdSenseUnit() {}\n';
const sandbox = {};
vm.runInNewContext(`${stubs}${match[1]}\nthis.data = { EXERCISES, MOODS, WIM_HOF_ROUNDS };`, sandbox);
const { EXERCISES, MOODS, WIM_HOF_ROUNDS } = sandbox.data;

const fmt=(p)=>p.map(x=>`${x.label} ${x.duration}s`).join(' → ');
let out=`# nisvasa — full reference

> Complete, agent-readable content of https://nisvasa.com/, generated from the exercise data in index.html. For the short version see https://nisvasa.com/llms.txt.

nisvasa (Sanskrit niśvāsa, "breath") is a free guided-breathing web app by Serverless Ventures LLC (https://www.serverlessvc.com). It runs entirely in the browser: no install, no account, no cookies, no tracking. Sound is synthesised on the device with the Web Audio API.

## Using the app

1. Open https://nisvasa.com/ or a direct exercise link (https://nisvasa.com/#<exercise-id>).
2. Read the benefits and the pattern, then choose a session length: 3, 5 or 10 minutes, or a custom 1–60 minutes. Wim Hof always runs as ${WIM_HOF_ROUNDS} rounds.
3. Select "Begin practice". The circle grows on the inhale, holds, and shrinks on the exhale; the number inside counts down each phase (or counts breaths and pumps).
4. Controls: stop, pause/resume (space bar also works), mute, volume and the mood light.
5. Sessions end at the end of a full cycle, then show a completion message.

## Mood light

The bulb button opens a palette of moods that re-tint the whole page. The choice lasts for the current visit only.

${MOODS.map(m=>`- ${m.name}: ${m.description}`).join('\n')}

## Exercises
`;
for (const e of EXERCISES){
 out+=`
### ${e.name} — ${e.sanskrit}

- Link: https://nisvasa.com/#${e.id}
- Category: ${e.category}
- Pattern: ${fmt(e.pattern)}${e.rounds?` (${e.rounds} rounds)`:''}
- In short: ${e.teaser}

Benefits:
${e.benefits.map(b=>`- ${b}`).join('\n')}

Completion message: "${e.completion}"
`;}
out+=`
## Safety

nisvasa offers general wellness guidance, not medical advice. Practise seated or lying down, never in or near water, while driving or while operating machinery. Stop if you feel dizzy, faint or unwell. Wim Hof breathing and Kapalabhati are vigorous: skip them if you are pregnant or have a heart, blood-pressure, respiratory or seizure condition, and talk to a health professional first if unsure.

## Privacy and terms (summary)

- Privacy: nisvasa collects nothing. No accounts, forms, analytics, cookies or browser storage. Advertising is off by default; if it is ever switched on, the privacy statement in the page footer describes it. The site is hosted on GitHub Pages, which may keep technical logs under GitHub's own privacy statement.
- Terms: free for personal use, provided "as is" without warranty, not medical advice. Full text: open "Privacy" and "Terms of use" in the page footer.
- © Serverless Ventures LLC — https://www.serverlessvc.com
`;
// --stdout lets the validate skill compare without touching the file
if (process.argv.includes('--stdout')) {
  process.stdout.write(out + '\n');
} else {
  fs.writeFileSync(path.join(root, 'llms-full.txt'), out + '\n');
  process.stdout.write(`llms-full.txt written (${EXERCISES.length} exercises, ${MOODS.length} moods)\n`);
}

