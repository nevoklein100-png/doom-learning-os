# Decision Log

## 2026-09-23 — Publish the canonical site from the original repository
The original repository owner invited `NevoKlein` with Write access, the invitation was accepted, and GitHub now reports push permission. The original `nevoklein100-png/doom-learning-os` repository is canonical and hosts GitHub Pages from `main`. The fork was used temporarily while access was unavailable.

## 2026-09-23 — Keep the established Blender project baseline
Blender 5.2.2 is now the latest LTS release, while Blender 4.5 LTS remains supported through July 2027. Keep the project's 4.5 baseline until the installed tools and end-to-end asset pipeline are verified; a release-number update alone is not enough evidence to change the working project.

## 2026-09-23 — Publish a usable Learning OS now
### Previous approach
Keep the early static baseline and favor small preparatory changes while the AI timing question remained open.

### New approach
The owner explicitly requested a complete, shareable site ready for regular use. Publish a dependency-free static Learning OS on GitHub Pages, with canonical JSON content, milestones, versioned local progress, and backup/import. Defer account-backed sync until cross-device use is an explicit need.

### Why and evidence
The existing public repository and static content can be hosted on GitHub Pages without a paid service. The previous site duplicated content and lacked a real next-action dashboard. A static implementation is reversible and preserves the curriculum, research, and browser data for any later architecture. GitHub's Pages documentation confirms public repositories on GitHub Free can publish static HTML, CSS, and JavaScript from a branch.

### Compatibility and reversibility
The original task keys are unchanged. Legacy browser storage remains in place after migration. Backups contain all personal notes and progress. The site can later adopt cloud sync without replacing GitHub as the content source of truth.

## 2026-09-23 — Replace the all-phase prerequisite chain
### Previous approach
Every phase depended on the immediately preceding phase, including optional and later topics.

### New approach
Use actual prerequisites between related skills and systems. Keep the numerical order as a suggested reading path while allowing independent work. Core phases drive the next-action engine; recommended and later phases remain visible.

### Why
The old chain forced Control Rig, extra animation-source study, facial work, world building, and AI before unrelated core work could advance. That contradicted the character-first build and test strategy in the project handoff. Existing phase/task IDs and saved progress remain stable, so the change is reversible.

## 2026-09-22 — Direction change
### Decision
Adopt a character-first development strategy centered on Doctor Doom.

### Why
A complete game has too many dependencies to build effectively as one undifferentiated project. A smaller proven foundation reduces risk and gives the learning process a concrete target.

### Consequences
- Curriculum should connect learning to real project outputs.
- Doom character quality becomes an early milestone.
- Large world/roster systems move later.
- The Learning OS must distinguish learn/build/polish work.
- Old curriculum ordering can be changed when the new dependency structure is better.

## 2026-09-22 — Proposal status
User project ideas are proposals, not immutable technical rules. Codex may replace them when research or engineering demonstrates a better option, with significant changes documented.

## 2026-09-22 — Tooling
Prefer free tools/services. Do not introduce paid dependencies as silent requirements.

## 2026-09-22 — Repository
GitHub repository is the source of truth for Codex. The deployed website is the learning interface.

## 2026-09-22 — Baseline quality policy
The initial website/repository should be treated as a baseline built with a relatively weak model, not as a finished or authoritative implementation.

Codex is authorized and expected to:
- audit everything;
- improve or rewrite weak implementation;
- research stronger current approaches;
- preserve useful knowledge and user data;
- document material changes.

## 2026-09-22 — History vs current state
The repository must preserve project history, but history does not freeze decisions. When stronger research shows a better plan, the current researched state becomes the implementation target and the old state remains documented for traceability.

## 2026-09-23 — AI timing strategy
### Status
Open decision; no final build/wait choice has been made.

### Question
Would major implementation work now be wasteful if substantially stronger and/or cheaper AI coding agents become available in roughly two months?

### Options to evaluate
- Wait completely.
- Continue full development.
- Use a foundation/waiting mode focused on durable work.
- Use a milestone gate and reassess after a stable local MVP.
- Use AI now for research, specification, testing and small reversible implementation.

### Decision rule
Do not choose based on assumed future releases or prices. Compare actual current capability, pricing, limits, reliability, remaining work, rework risk and the durable value of work completed now.

### Repository action
The strategic question is documented in docs/AI_TIMING_STRATEGY.md and tracked as GitHub Issue #1. Codex should investigate it as part of major planning decisions and update this log when evidence produces a decision.
