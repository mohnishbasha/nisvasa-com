#!/usr/bin/env node
// Regenerates everything derived from index.html's own content, so crawlers, answer
// engines and agents always read exactly what the app shows:
//   - llms-full.txt                     from EXERCISES, MOODS and the visible FAQ
//   - pre-rendered exercise cards        between the generated:cards markers
//   - JSON-LD structured data            between the generated:jsonld markers
// Usage: node generate.js          write the files
//        node generate.js --check  exit 1 if any generated output is stale
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'https://nisvasa.com/';
const PUBLISHER = { name: 'Serverless Ventures LLC', url: 'https://www.serverlessvc.com' };
const DESCRIPTION = 'Free guided breathing exercises with an animated breath circle and sound synthesised in the browser. No install, no account, no cookies, no tracking.';

const root = path.resolve(__dirname, '../../..');
const indexPath = path.join(root, 'index.html');
const llmsPath = path.join(root, 'llms-full.txt');
const html = fs.readFileSync(indexPath, 'utf8');

function readData(source) {
  const match = source.match(/<script>\n([\s\S]*?)\/\* ── State/);
  if (!match) throw new Error('Could not find the data section in index.html');
  // Ad builders are referenced by the data section but are not needed to read it
  const stubs = 'function buildEthicalAdsUnit() {}\nfunction buildAdSenseUnit() {}\n';
  const sandbox = {};
  vm.runInNewContext(`${stubs}${match[1]}\nthis.data = { EXERCISES, MOODS, WIM_HOF_ROUNDS };`, sandbox);
  return sandbox.data;
}

const decode = (text) => text
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&rsquo;/g, '’').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
  .replace(/\s+/g, ' ').trim();

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The visible FAQ is the single source for the FAQ in JSON-LD and llms-full.txt
function readFaq(source) {
  const items = [...source.matchAll(/<details class="faq-item">\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)];
  return items.map(([, question, answer]) => ({ question: decode(question), answer: decode(answer) }));
}

const { EXERCISES, MOODS, WIM_HOF_ROUNDS } = readData(html);
const faq = readFaq(html);
const pattern = (steps) => steps.map((x) => `${x.label} ${x.duration}s`).join(' → ');

function cardsHtml() {
  const indent = '        ';
  return EXERCISES.map((e) => [
    `${indent}<article class="card" data-tech="${e.color}">`,
    `${indent}  <span class="badge">${escapeHtml(e.category)}</span>`,
    `${indent}  <h3 class="card-name">${escapeHtml(e.name)}</h3>`,
    `${indent}  <p class="card-sanskrit">${escapeHtml(e.sanskrit)}</p>`,
    `${indent}  <p class="card-teaser">${escapeHtml(e.teaser)}</p>`,
    `${indent}  <button class="card-begin" type="button" data-exercise="${e.id}" aria-label="Open ${escapeHtml(e.name)}">Begin</button>`,
    `${indent}</article>`,
  ].join('\n')).join('\n');
}

function jsonLd() {
  const org = { '@type': 'Organization', '@id': `${PUBLISHER.url}/#organization`, ...PUBLISHER };
  const website = {
    '@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: 'nisvasa', alternateName: 'breathe',
    inLanguage: 'en', publisher: { '@id': org['@id'] },
  };
  const app = {
    '@type': 'WebApplication', '@id': `${SITE}#app`, name: 'nisvasa', alternateName: 'breathe', url: SITE,
    description: DESCRIPTION, applicationCategory: 'HealthApplication', operatingSystem: 'Any (web browser)',
    browserRequirements: 'Requires JavaScript and a modern web browser', isAccessibleForFree: true, inLanguage: 'en',
    image: `${SITE}og-image.jpg`, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: EXERCISES.map((e) => `${e.name} (${e.sanskrit}): ${pattern(e.pattern)}`),
    publisher: { '@id': org['@id'] },
  };
  const list = {
    '@type': 'ItemList', '@id': `${SITE}#exercises`, name: 'Guided breathing exercises',
    numberOfItems: EXERCISES.length,
    itemListElement: EXERCISES.map((e, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE}#${e.id}`, name: `${e.name} (${e.sanskrit})`, description: e.teaser,
    })),
  };
  const faqPage = {
    '@type': 'FAQPage', '@id': `${SITE}#faq`,
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
  const graph = { '@context': 'https://schema.org', '@graph': [org, website, app, list, faqPage] };
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

function llmsFull() {
  let out = `# nisvasa — full reference

> Complete, agent-readable content of ${SITE}, generated from the exercise data and FAQ in index.html. For the short version see ${SITE}llms.txt.

nisvasa (Sanskrit niśvāsa, "breath") is a free guided-breathing web app by ${PUBLISHER.name} (${PUBLISHER.url}). It runs entirely in the browser: no install, no account, no cookies, no tracking. Sound is synthesised on the device with the Web Audio API, and every phase's sound lasts exactly as long as the phase.

## Using the app

1. Open ${SITE} or a direct exercise link (${SITE}#<exercise-id>).
2. Read the benefits and the pattern, then choose a session length: 3, 5 or 10 minutes, or a custom 1–60 minutes. Wim Hof always runs as ${WIM_HOF_ROUNDS} rounds.
3. Select "Begin practice". The circle grows on the inhale, holds, and shrinks on the exhale; the number inside counts down each phase (or counts breaths and pumps). The tone swells through each inhale, holds through each hold and fades through each exhale.
4. Controls: stop, pause/resume (space bar also works), mute, volume and the mood light.
5. Sessions end at the end of a full cycle, then show a completion message.

## Mood light

The bulb button opens a palette of moods that re-tint the whole page. The choice lasts for the current visit only.

${MOODS.map((m) => `- ${m.name}: ${m.description}`).join('\n')}

## Exercises
`;
  for (const e of EXERCISES) {
    out += `
### ${e.name} — ${e.sanskrit}

- Link: ${SITE}#${e.id}
- Category: ${e.category}
- Pattern: ${pattern(e.pattern)}${e.rounds ? ` (${e.rounds} rounds)` : ''}
- In short: ${e.teaser}

Benefits:
${e.benefits.map((b) => `- ${b}`).join('\n')}

Completion message: "${e.completion}"
`;
  }
  out += `
## Frequently asked questions
${faq.map((f) => `\n### ${f.question}\n\n${f.answer}\n`).join('')}
## Safety

nisvasa offers general wellness guidance, not medical advice. Practise seated or lying down, never in or near water, while driving or while operating machinery. Stop if you feel dizzy, faint or unwell. Wim Hof breathing and Kapalabhati are vigorous: skip them if you are pregnant or have a heart, blood-pressure, respiratory or seizure condition, and talk to a health professional first if unsure.

## Privacy and terms (summary)

- Privacy: nisvasa collects nothing. No accounts, forms, analytics, cookies or browser storage. Advertising is off by default; if it is ever switched on, the privacy statement in the page footer describes it. The site is hosted on GitHub Pages, which may keep technical logs under GitHub's own privacy statement.
- Terms: free for personal use, provided "as is" without warranty, not medical advice. Full text: open "Privacy" and "Terms of use" in the page footer.
- © ${PUBLISHER.name} — ${PUBLISHER.url}
`;
  return `${out}\n`;
}

function replaceRegion(source, name, body) {
  // The end marker keeps its own indentation so repeated runs produce identical output
  const pattern = new RegExp(`(<!-- generated:${name}:start[^>]*-->)[\\s\\S]*?([ \\t]*<!-- generated:${name}:end -->)`);
  if (!pattern.test(source)) throw new Error(`Missing generated:${name} markers in index.html`);
  return source.replace(pattern, (_, start, end) => `${start}\n${body}\n${end}`);
}

const nextHtml = replaceRegion(replaceRegion(html, 'cards', cardsHtml()), 'jsonld', jsonLd());
const nextLlms = llmsFull();
const currentLlms = fs.existsSync(llmsPath) ? fs.readFileSync(llmsPath, 'utf8') : '';

if (process.argv.includes('--check')) {
  const stale = [];
  if (nextHtml !== html) stale.push('index.html (generated cards or JSON-LD)');
  if (nextLlms !== currentLlms) stale.push('llms-full.txt');
  if (stale.length) {
    process.stdout.write(`stale: ${stale.join(', ')}\n`);
    process.exit(1);
  }
  process.stdout.write(`in sync (${EXERCISES.length} exercises, ${MOODS.length} moods, ${faq.length} FAQs)\n`);
} else {
  fs.writeFileSync(indexPath, nextHtml);
  fs.writeFileSync(llmsPath, nextLlms);
  process.stdout.write(`synced index.html and llms-full.txt (${EXERCISES.length} exercises, ${MOODS.length} moods, ${faq.length} FAQs)\n`);
}
