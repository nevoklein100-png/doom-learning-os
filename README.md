# DOOM // Learning OS

A public learning and build guide for the Doctor Doom game project. The site turns the character-first plan into milestones, a concrete next action, prerequisite-aware phases, resources, progress, and project notes.

## Open the site

https://nevoklein100-png.github.io/doom-learning-os/

The curriculum is public. Personal progress and notes stay in the current browser. Use **Download backup JSON** in the workspace to move or safeguard them; **Import backup** merges completed tasks and preserves both versions of differing notes. The site has no account or cross-device sync yet.

## Project direction

Prove a playable Doctor Doom foundation first: controls, camera, character pipeline, animation, one combat/power loop, and feedback. Build and test one small system at a time. Broader world, story, enemies, and other systems follow when useful. See [project context](docs/PROJECT_CONTEXT.md) and the [direction handoff](docs/CODEX_HANDOFF_PROJECT_CHANGE.md).

## Source of truth

- `content/curriculum.json`: phase descriptions, tasks, prerequisites, task kinds, and exit criteria.
- `content/resources.json`: resource metadata and verification status.
- `content/milestones.json`: the four milestone outcomes and phase groups.
- `assets/app.js`: UI and next-action logic.
- `assets/state.js`: versioned browser state, legacy migration, and backup merge.
- `assets/styles.css` and `index.html`: visual and semantic interface.
- `docs/`: project direction, decisions, research, plans, and current state.

The site fetches the JSON files directly. Edit the JSON rather than adding content arrays to HTML or JavaScript. Existing task progress keys (`p1_0`, etc.) are intentionally stable. If a task is reordered or removed, provide a migration so saved progress keeps its meaning.

## Local preview and validation

```bash
python3 -m http.server 4173
# open http://localhost:4173/
node tests/validate.mjs
```

A local HTTP server is needed because browsers restrict JSON fetches from `file://` pages. The site has no package install or build step.

## Publishing

GitHub Pages serves the repository root from `main` on the [original project repository](https://github.com/nevoklein100-png/doom-learning-os). `.nojekyll` tells Pages to publish the static files directly. Changes merged into `main` become public after Pages completes its build. The repository is public, so never commit secrets or personal notes.

## Next boundaries

Cloud sync, login, shared workspaces, and public project views remain separate future features. They require a backend, access-control testing, and a safe import path from local state. Vercel and Supabase are candidates, not commitments. Current resource entries still require content and license review before production game use; link availability alone is not license verification.
