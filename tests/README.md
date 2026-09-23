# Validation

Run `node tests/validate.mjs` and `node tests/state.mjs` to check curriculum/resource completeness, unique IDs, references, prerequisite cycles, milestone coverage, current resource metadata, accessibility markers, local-state migration, backup merge, corruption recovery, and the Pages publishing marker.

Before publishing a user-visible change, inspect the rendered site on desktop and mobile. Exercise the affected interactions: next action, task progress and reload persistence, search/filter, notes, backup export/import, and link navigation. The JSON check alone cannot verify browser behavior or resource licenses.

Future cloud work requires migration, authentication, RLS allow/deny, cross-user isolation, public-share isolation, and preview/production configuration checks.
