# Changelog

## 2026-09-24 — Independent product retest
- Re-ran the full browser journey across desktop and a 390px phone layout: phase navigation, progress, notes, reload persistence, search, filters, no-results state, backup download/import, and sharing.
- No release defects were found. Structured validation, state tests, browser requests, and console checks passed.

## 2026-09-24 — Social preview card
- Added a branded 1200×630 PNG preview image with its editable SVG source and connected Open Graph and Twitter large-image metadata.
- Added checks for social metadata and PNG format/dimensions; visually inspected the exported image.
- Found the missing preview card during the follow-up shareability audit after mobile navigation was fixed.

## 2026-09-24 — Mobile navigation and end-to-end review
- Added a compact mobile section-navigation row after the browser walkthrough found that the desktop header hid every section link below 760px.
- Exercised the live next action, task persistence, search and filters, notes persistence, backup export, valid merge import, invalid import rejection, external resource navigation, and phone layouts.
- Added a validation guard for mobile section navigation and recorded the complete walkthrough in `docs/QA_AUDIT.md`.

## 2026-09-23 — Resource and release audit
- Corrected outdated Epic documentation paths and matched several resources to the curriculum phase they support.
- Audited all 54 resource records; added visible access, version, check-date, and license notes. Forty-three of 45 unique URLs returned HTTP 200; two official Fab listings block automated requests and were checked through official listing results.
- Added dependency-free tests for browser-state migration, save failures, backup validation/merge, and corrupt-state recovery; expanded curriculum and resource validation.
- Fixed an accessibility attribute flagged by axe and documented that per-resource metadata does not replace point-of-use technical and license checks.

## 2026-09-23 — Shareable Learning OS
- Replaced the duplicated inline curriculum with a static, modular site that reads canonical curriculum, resource, and milestone JSON.
- Added a milestone dashboard, exact next action, prerequisite-aware phases, specific exit criteria, task-kind labels, search, filters, progress, and notes.
- Added versioned local state, migration of the original browser keys, malformed-data recovery, and merge-safe backup export/import.
- Replaced the strict 25-phase prerequisite chain with dependencies that let core Doom prototyping proceed without optional topics blocking it.
- Added GitHub Pages publishing support and browser/structured-data validation.
- Published the canonical site from the original repository after Write access was granted and the invitation accepted.
- Corrected the Content Examples resource URL and recorded the current link-availability review.

## 2026-09-23
- Added docs/AI_TIMING_STRATEGY.md with a structured build-now vs wait vs middle-ground decision framework.
- Documented the AI timing question as an open decision rather than a prediction.
- Updated README and current-state documentation to preserve this strategy for future Codex sessions.
- Updated AGENTS.md so major implementation decisions explicitly consider durable value, automation potential, reversibility, current tool capability and cost.
- Recorded the strategy in the decision log.

## 2026-09-22
- Bootstrapped the GitHub repository and Learning OS.
- Added structured curriculum and resource JSON baselines.
- Added Codex instructions and project-direction documentation.
- Added full product, hosting, database and Codex execution planning.
- Added explicit support for future cloud sync and sharing without making it a hidden requirement.

## 2026-09-22
- Added an explicit stronger-model audit policy: the existing implementation is a baseline to improve, not an authority.
- Added a history-vs-current-state policy so Codex can preserve project updates while still replacing outdated planning or technical decisions.
