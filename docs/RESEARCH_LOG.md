# Research Log

## 2026-09-23 — Hosting and resource review
- GitHub Pages supports static files published from a public GitHub Free repository and can use `main` plus the repository root as its publishing source. Source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub's Pages REST API supports creation with `source.branch` and `source.path`. Source: https://docs.github.com/en/rest/pages/pages
- An HTTP GET availability pass over the 42 unique resource URLs returned 200 for 40 URLs. Both Fab listing URLs returned 403 to the automated checker; this is inconclusive because the listings appear in Fab search. HTTP status does not verify teaching quality, current workflow, license, or permission to redistribute assets.
- The `Content Examples` resource incorrectly linked to Epic's character setup page. Replaced it with Epic's current Content Examples sample page: https://dev.epicgames.com/documentation/unreal-engine/content-examples-sample-project-for-unreal-engine
- Epic's official Unreal Engine 5.8 release notes exist at https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes . The working baseline remains UE 5.8; re-check specific workflows when used.

## 2026-09-22 — GitHub bootstrap
- Added the Learning OS and structured curriculum/resource baselines.
- Working baseline: Unreal Engine 5.8 and Blender 4.5 LTS.

## 2026-09-22 — Major project direction
- Added the canonical project-change handoff.
- Development is character-first: prove the Doctor Doom foundation before broad expansion.

## 2026-09-22 — Product/hosting direction
- Added a future production architecture plan covering Git-based deployment, shared access, managed Postgres/Auth and secure RLS.
- Vercel and Supabase are candidates only; Codex should re-check current plans and capabilities before adoption.

## Ongoing policy
Verify current versions, URLs, licenses and provider behavior before relying on them. Prefer free solutions where practical. Replace obsolete workflows and document meaningful changes.
