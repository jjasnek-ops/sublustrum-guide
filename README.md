# Sublustrum Guide

Independent English guides for the Sublustrum remake and October 2026 Steam playtest. **Live website: https://sublustrumguide.wiki/**, first indexable launch October 13, 2026.

Cloudflare Pages serves the canonical domain from the Git-integrated
`sublustrum-guide` project. Pushes to main automatically build and deploy.
Cloudflare DNS, registrar nameservers, DNSSEC, apex HTTPS and WWW-to-apex301
are verified. Pages hostnames remain noindex. The earlier Direct Upload project
is retained as a noindex fallback. The alternative Actions uploader is disabled;
no Cloudflare credential was stored in GitHub.

Search Console domain ownership is verified, both sitemap-index.xml and
sitemap-0.xml have been submitted, and Google's live homepage test passed.
The homepage indexing request was accepted; this does not prove indexing.
GA4 uses a dedicated property and loads only after visitor consent. Its public
measurement ID is in `wrangler.toml`; local/CI Astro builds read that same ID.

Steam app 4151300 currently credits Brickworks Games / HypeTrain Digital and lists Q1 2027. The October 12–25 playtest covers Chapter One. Sources checked October 13, 2026. No complete current walkthrough is verified.

Uses AnvilWiki v2.37.0, upstream commit `9d36b1bac488d3bbef0d37540c94594b4fe06680`, Astro/MDX, native spoiler accordions, TOC, Pagefind and static SEO. MIT attribution preserved. Original template README is archived in [docs/template-README.md](docs/template-README.md); its demo claims are historical reference.

## Local use

Node >=22.13, pnpm from package.json (11.1.1). Run `pnpm install --frozen-lockfile`, then `pnpm dev`. For production preview, `pnpm build` then `pnpm preview`; use the reported port. Pages output: `dist/`.

## Verification

Run `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm check-config`, `pnpm check-i18n --strict-ui`, `pnpm check-content`, `pnpm build`, `pnpm check-links`, and `node scripts/audit-production.mjs`.

See [test scope](docs/site-test-scope.md), [launch runbook](docs/launch-runbook.md), [page matrix](research/page-matrix.md) and [evidence ledger](research/evidence-ledger.md). Local resumable state/screenshots: gitignored `reports/`. Raw downloaded evidence remains local in `research/raw/`; sanitized research is committed.

Six articles are published. The Chapter One sample remains draft/noindex.
Advertising and comments are disabled. GA4 is optional and consent gated;
`scripts/audit-analytics.mjs` checks decline behavior and a real collection
response in an isolated public browser. QA visits are not organic traffic.
No search volume, rankings, traffic, indexing or revenue is invented. Do not
reinitialize this site.
