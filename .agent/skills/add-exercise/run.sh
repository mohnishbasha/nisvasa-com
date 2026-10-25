#!/usr/bin/env bash
# Prints the exercise template and the follow-up steps. Editing index.html is left to the agent.
set -euo pipefail
cd "$(dirname "$0")/../../.." || exit 1
count=$(grep -c "^    id: '" index.html || true)
cat <<TEMPLATE
Exercises currently in EXERCISES: $count

Add this object to the EXERCISES array in index.html:

  {
    id: 'kebab-case-id',               // also the deep link: https://nisvasa.com/#kebab-case-id
    name: 'Display Name',
    sanskrit: 'Traditional or alternate name',
    category: 'Short Benefit Category',
    color: 'sage',                     // a technique token: sage, indigo-soft, gold-muted, rose-muted,
                                       // terracotta, teal-soft, amber-soft or lavender-soft
    teaser: 'One calm sentence for the library card.',
    benefits: [
      'First benefit, one sentence.',
      'Second benefit, one sentence.',
      'Third benefit, one sentence.',
    ],
    pattern: [
      { phase: 'inhale', duration: 4, label: 'inhale' },   // phase: inhale | hold | exhale | rest
      { phase: 'exhale', duration: 6, label: 'exhale' },   // optional: hint, sound, size
    ],
    completion: 'One short, poetic closing line.',
  },

Then:
  1. bash .agent/skills/sync-llms/run.sh      # refresh llms-full.txt
  2. Add the exercise and its link to llms.txt, the README table and the JSON-LD featureList
  3. If the exercise has a new colour, add the token to EVERY mood block in :root (light and dark)
  4. bash .agent/skills/validate/run.sh
TEMPLATE
