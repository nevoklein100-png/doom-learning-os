# Research Log

## 2026-09-23 — Resource audit and tool baseline
- Corrected stale Epic documentation routes against current official documentation. Unreal Engine 5.8 remains the working baseline; review workflow details against the installed engine when each phase begins.
- Checked 45 unique resource URLs: 43 returned HTTP 200. The two Fab sample listings returned 403 to direct automated requests; official Fab listing results currently show both packs as free. Check the assigned Fab tier and its terms when acquiring either pack.
- Blender's official release pages list Blender 5.2.2, released 2026-09-15, as the latest LTS line (5.2 LTS released 2026-07-14); Blender 4.5 LTS support continues to July 2027. Keep the established 4.5 project baseline until the installed environment and pipeline are verified. Sources: https://www.blender.org/download/releases/5-2/ and https://www.blender.org/download/lts/5-2/
- Blender Manual content is CC BY-SA 4.0 unless stated otherwise; Blender logos, trademarks, scripts, and code have separate terms. Source: https://docs.blender.org/manual/en/latest/copyright.html
- Adobe's Mixamo FAQ says the service is free with an Adobe ID and permits royalty-free use in commercial games; recheck its FAQ when using it because service terms may change. Source: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
- Rhubarb Lip Sync is MIT licensed and emits timed mouth-cue data, not a complete facial rig. Source: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/master/LICENSE
- Fab Standard License permits use in a commercial project but does not allow redistributing the asset on a standalone basis. Source: https://www.fab.com/eula

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
