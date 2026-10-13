# Sublustrum Guide

Independent English guides for the Sublustrum remake and October 2026 Steam playtest. Canonical origin: https://sublustrumguide.wiki . **Production launch is blocked on Cloudflare authentication and domain DNS access.**

Public preview: https://sublustrum-guide-preview.pages.dev/ . The preview is
deployed and tested; it deliberately sends `X-Robots-Tag: noindex, nofollow`.
Cloudflare login is now confirmed. Canonical-domain launch is still blocked on
Zone creation/DNS permissions, and Git integration returned installation error
8000011. A suitably scoped local API Token can be used to continue.

Steam app 4151300 currently credits Brickworks Games / HypeTrain Digital and lists Q1 2027. The October 12–25 playtest covers Chapter One. Sources checked October 13, 2026. No complete current walkthrough is verified.

Uses AnvilWiki v2.37.0, upstream commit `9d36b1bac488d3bbef0d37540c94594b4fe06680`, Astro/MDX, native spoiler accordions, TOC, Pagefind and static SEO. MIT attribution preserved. Original template README is archived in [docs/template-README.md](docs/template-README.md); its demo claims are historical reference.

## Local use

Node >=22.13, pnpm from package.json (11.1.1). Run `pnpm install --frozen-lockfile`, then `pnpm dev`. For production preview, `pnpm build` then `pnpm preview`; use the reported port. Pages output: `dist/`.

## Verification

Run `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm check-config`, `pnpm check-i18n --strict-ui`, `pnpm check-content`, `pnpm build`, `pnpm check-links`, and `node scripts/audit-production.mjs`.

See [test scope](docs/site-test-scope.md), [launch runbook](docs/launch-runbook.md), [page matrix](research/page-matrix.md) and [evidence ledger](research/evidence-ledger.md). Local resumable state/screenshots: gitignored `reports/`. Raw downloaded evidence remains local in `research/raw/`; sanitized research is committed.

Six articles are locally publishable. The Chapter One sample remains draft/noindex. Advertising, comments and analytics are disabled. No search volume, rankings, traffic, indexing or revenue is invented. Do not reinitialize this site.
