---
name: sync-llms
description: >
  Regenerate llms-full.txt from the exercise and mood data in index.html.
  Use after adding or editing an exercise, a mood, or any text an agent should see.
---
Run: bash .agent/skills/sync-llms/run.sh

Reads the EXERCISES and MOODS arrays straight out of index.html (no build step, Node only)
and rewrites llms-full.txt. Then check llms.txt by hand: it is short and curated, so update
its exercise list or facts if they changed.
