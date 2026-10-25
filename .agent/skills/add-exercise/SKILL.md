---
name: add-exercise
description: >
  Add a new breathing exercise the same way as the existing eight. Use whenever someone
  asks for a new technique.
---
Run: bash .agent/skills/add-exercise/run.sh  (prints the template and checklist)

Rules:
- Copy the structure exactly. The UI renders cards, details, the pattern bar, practice and
  completion from the object alone.
- Exercises that need custom sequencing (counted breaths, pumps, alternating sides) add a
  `build` key and a builder in buildCycle(). Follow buildWimHofRound or buildKapalabhatiRound.
- Vigorous techniques need a safety note: set `guide: 'safety'` to show the warning card
  and the confirmation dialog.
- Keep the copy calm: no exclamation marks, no medical claims beyond the cited benefit.
