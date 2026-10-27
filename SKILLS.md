# nisvasa — Skills Registry

Skills live in .agent/skills/. Each is a directory with a SKILL.md and an executable run.sh.
Agents load them on demand. They need only bash and Node (no packages); brand-assets also needs Chrome and ImageMagick.

## Available skills

| Skill        | Directory                   | When to use                                         |
|--------------|-----------------------------|-----------------------------------------------------|
| validate     | .agent/skills/validate/     | Check index.html and site files against the checklist |
| add-exercise | .agent/skills/add-exercise/ | Add a new breathing exercise correctly              |
| sync-content | .agent/skills/sync-content/ | Regenerate cards, JSON-LD and llms-full.txt from index.html |
| brand-assets | .agent/skills/brand-assets/ | Regenerate favicon, app icons and share image       |
| deploy-check | .agent/skills/deploy-check/ | Verify the GitHub Pages workflow                    |
| audit-deps   | .agent/skills/audit-deps/   | Confirm no dependency, network call or storage crept in |

## Skill format
.agent/skills/{name}/SKILL.md  description, when to use, how to run
.agent/skills/{name}/run.sh    executable entry point

## Typical flow
1. Make the change in index.html
2. bash .agent/skills/sync-content/run.sh  (if an exercise, mood, the FAQ or legal text changed)
3. bash .agent/skills/validate/run.sh      (runs deploy-check and audit-deps too)
4. bash tests/smoke.sh                     (headless Chrome click-through)
5. Open index.html in a browser for anything visual or audible

CI (.github/workflows/ci.yml) runs steps 3 and 4 plus the W3C HTML checker, shellcheck and
actionlint on every push and pull request.
