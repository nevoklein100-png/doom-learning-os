# Validation

Run `node tests/validate.mjs` to check JSON structure, unique IDs, references, prerequisite cycles, milestone coverage, app asset wiring, legacy migration markers, and the Pages publishing marker.

Before publishing a user-visible change, inspect the rendered site on desktop and mobile. Exercise the affected interactions: next action, task progress and reload persistence, search/filter, notes, backup export/import, and link navigation. The JSON check alone cannot verify browser behavior or resource licenses.

Future cloud work requires migration, authentication, RLS allow/deny, cross-user isolation, public-share isolation, and preview/production configuration checks.
