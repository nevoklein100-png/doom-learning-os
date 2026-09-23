# Architecture

## Current site

Dependency-free static application published by GitHub Pages from the original `nevoklein100-png/doom-learning-os` repository. `index.html` provides semantic structure, `assets/styles.css` provides the visual system, and `assets/app.js` loads the three JSON content files. The site uses relative paths so it works under the Pages URL.

`content/curriculum.json` is the phase and task source of truth. `content/resources.json` provides linked learning resources. `content/milestones.json` groups phases by observable project outcomes. The app derives the active milestone, next ready core task, prerequisite status, progress, and estimated remaining core hours from these files plus browser state. Recommended and later phases remain available but do not block core progress.

## Personal data

`assets/state.js` stores version 2 state under `doomLearningStateV2`. It migrates the old `doomLearningState` task/note keys and `doomGlobalNotes` without deleting them. Malformed version 2 data is copied to a recovery key before replacement. Saves report failure in the UI. Backups contain task completions and notes; import merges completed tasks and appends differing notes so neither copy is lost.

Progress is local to each browser. There is no authentication, database, server API, or shared editing permission in this release. Public site visitors each receive their own local state.

## Future data boundary

GitHub remains canonical for curriculum, resources, strategy, research, and technical decisions. If cross-device sync becomes useful, a database should hold users, progress, notes, study sessions, and collaboration state. Migrate local data only with verified backup and access-control paths. Vercel and Supabase remain provider candidates, not current dependencies.
