# Current State — DOOM Learning OS

Last audited: 2026-09-23

## Current reality

The Learning OS is now a responsive, public static site with a character-first milestone dashboard, a concrete next action, all 25 curriculum phases, 54 resource records, search/filtering, prerequisite visibility, task progress, notes, and versioned backup/import. GitHub Pages publishes the site from the original repository's `main` at https://nevoklein100-png.github.io/doom-learning-os/.

The three JSON content files are the only curriculum, resource, and milestone datasets used by the UI. The older inlined HTML curriculum has been removed. Task keys remain compatible with the original site, and `assets/state.js` migrates legacy browser progress and notes without deleting old keys.

The 25 phases are no longer one unconditional prerequisite chain. Independent or optional topics can be approached when useful, and core phases guide the active Doom foundation. Every phase has a specific, observable exit criterion. The site labels task work as LEARN, BUILD, TEST, POLISH, or DOCUMENT.

## Remaining limits

- Progress and notes are local to one browser; backup/import is the cross-device transfer path until accounts and sync are justified.
- All 54 resource records now include an individual check date, access condition, version note, and license boundary. A check of 45 unique URLs returned HTTP 200 for 43; the two Fab sample listings block automated requests (403), but their official Fab listings were found and currently identify the packs as free. Check the exact Fab license tier on acquisition, and verify technical steps when each phase becomes active. The project baseline remains Blender 4.5 LTS for continuity; Blender 5.2.2 is current, while the installed tools and project pipeline still need hands-on verification before changing that baseline.
- The site is a project learning tool. The Unreal game, character assets, playable prototype, and project observations are not stored here yet.
- Shared editing, role-based access, and public project showcases require a backend and security tests before implementation.

## Next project work

Use the live site to begin the first playable character milestone. Validate Unreal and Blender workflows at the point of use, record real build observations, and refine task sequence when the game exposes new dependencies. If multi-device work becomes necessary, add account-backed sync with local-data migration and tested access rules.

The AI timing question remains open for larger future work. The owner explicitly requested a complete, shareable Learning OS now; that request superseded the earlier default to defer large site implementation.
