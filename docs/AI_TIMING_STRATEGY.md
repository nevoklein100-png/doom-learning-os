# AI Timing Strategy — Build Now vs Wait

Last updated: 2026-09-23

## Purpose

The project owner raised a strategic question: is it worth doing major implementation work now, or should the project wait roughly two months for potentially stronger and/or cheaper AI coding agents?

This is a decision to evaluate, not a predetermined answer. The repository must remain useful under either outcome.

## Decision options Codex must evaluate

### Option A — Wait
Pause most implementation work for a defined period and reassess the capabilities, pricing and reliability of available AI coding agents.
Potential benefit: avoid manually building large portions that a stronger agent may soon automate.
Potential risk: lose two months of learning, project validation and specification work; future model improvements are uncertain; better coding agents still cannot replace product decisions, taste, testing, asset/licensing decisions and real gameplay validation.

### Option B — Build normally
Continue implementing the Learning OS and game-development foundation now.
Potential benefit: immediate learning and project progress; problems are discovered earlier; the repository becomes a better specification for future agents.
Potential risk: some implementation work may later become substantially cheaper to automate; architecture may need to evolve as tooling improves.

### Option C — Foundation / waiting mode
Keep active development deliberately small and high-value while deferring large rewrites.
Prioritize requirements, project context, decision history, research, curriculum dependency mapping, acceptance criteria, executable tests, data schemas, licensing rules, source-of-truth cleanup and small prototypes that validate uncertain assumptions.
Defer large UI/architecture work when it has low learning or validation value.

### Option D — Milestone gate
Complete a small stable MVP of the Learning OS, then reassess.
Suggested gate: canonical content structure is clear; local progress is versioned and recoverable; tests cover critical behavior; next-action/milestone behavior is defined; repository documentation is coherent; the project can be handed to a stronger agent without ambiguity.

### Option E — AI-assisted preparation
Use current AI aggressively for research, specification, test design, code review and small safe implementations while avoiding unnecessary large rewrites.
This keeps the repository ready for a future stronger implementation agent.

## Evaluation framework

Codex should not answer the question using assumptions that a specific future model will definitely release, prices will definitely fall, capabilities will definitely improve by a particular date, an agent will automatically understand the project perfectly, or waiting has zero opportunity cost.

Evaluate:
- Automation potential: which remaining tasks are likely to become much easier for stronger agents?
- Human value: which tasks provide learning or decisions that should happen now?
- Specification value: does doing the work now make future automation safer and faster?
- Rework risk: which current implementation choices are likely to be thrown away?
- Validation value: which experiments can reveal problems only by actually building/testing?
- Cost: what does the current tool stack cost versus plausible future alternatives?
- Uncertainty: how uncertain are future model capability, price and release timing?
- Reversibility: can today's work be preserved if the implementation is later replaced?

## Durable project assets

Even if AI improves substantially, these should generally remain valuable: clear product requirements; current game direction; design decisions and rationale; research findings; verified resources; licensing knowledge; acceptance tests; dependency graphs; project-specific preferences; real gameplay observations; validated prototypes; clean source-of-truth data; progress and notes.

## Work that may become cheaper to automate

Codex should investigate, rather than assume, whether stronger agents can reduce the cost of repetitive UI implementation, boilerplate CRUD, migrations, test generation, refactors, documentation synchronization, link/resource maintenance, simple frontend components, database plumbing, repetitive Unreal/Blueprint setup and asset-pipeline scripting.

## Reassessment rule

Do not wait for an arbitrary date merely because it was suggested. Create a decision checkpoint based on evidence.

At the checkpoint inspect: current agent capabilities; current pricing and limits; current tool integrations; reliability on this repository; actual remaining implementation effort; and the amount of work that would be discarded by switching strategies.

If evidence changes the strategy, update docs/DECISION_LOG.md, docs/CURRENT_STATE.md and this file.

## Current default

For future large work whose scope has not been decided, prefer durable, testable work over speculative rewrites until the checkpoint. On 2026-09-23 the owner explicitly requested a complete, shareable Learning OS ready for regular use, so the site build moved ahead. The question remains open for larger game and cloud implementation choices.

This is not a commitment to wait or to build everything now. It is a strategy for preserving optionality while producing useful progress.

## Codex instruction

When working on this repository, explicitly consider whether a requested implementation creates durable project value, is likely to be automated cheaply soon, validates an important uncertainty, or creates avoidable technical debt.

If the answer is unclear, research before making a large irreversible change.
