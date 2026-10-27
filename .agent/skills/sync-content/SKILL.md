---
name: sync-content
description: >
  Regenerate everything derived from index.html's content: llms-full.txt, the pre-rendered
  exercise cards and the JSON-LD structured data. Use after changing an exercise, a mood,
  the FAQ, or any text crawlers and agents should see.
---
Run:   bash .agent/skills/sync-content/run.sh
Check: bash .agent/skills/sync-content/run.sh --check   (exit 1 if anything is stale)

Sources of truth, all inside index.html:
- EXERCISES and MOODS arrays → llms-full.txt, the cards between the generated:cards markers
  (so crawlers that don't run JavaScript still see every exercise) and the JSON-LD ItemList
  and WebApplication featureList
- the visible FAQ (<details class="faq-item">) → the JSON-LD FAQPage and the FAQ in llms-full.txt

Never hand-edit between generated:… markers or in llms-full.txt. Site-wide JSON-LD facts
(publisher, description) live at the top of generate.js. llms.txt stays hand-curated:
update its exercise list or facts yourself if they changed.
