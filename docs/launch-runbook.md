# Sublustrum Guide launch and maintenance

The canonical website is live at https://sublustrumguide.wiki/ . First indexable
launch: October 13, 2026, 15:37 Asia/Shanghai. Detailed deployment IDs and actual
evidence live in gitignored reports/canonical-launch-verified.md.

Repository: https://github.com/jjasnek-ops/sublustrum-guide . Actual AnvilWiki
v2.37.0 upstream: 9d36b1bac488d3bbef0d37540c94594b4fe06680; MIT retained.

## Current hosting

Cloudflare account e26c192b02bb6ba662ec2e8a64a2c3a7 serves the apex from Direct
Upload Pages project sublustrum-guide-preview (6b7cc5af-c5ca-4677-b8d3-538d01ed44ea).
Its label does not change the canonical origin. The Free Zone is active;
Spaceship uses armfazh.ns.cloudflare.com and laura.ns.cloudflare.com. DNSSEC
was migrated using the new Cloudflare DS without disabling DNSSEC. Apex and
WWW CNAME records are proxied; WWW301 preserves the article path and query.

Canonical HTTPS, seven browser pages, mobile layout, images, hints, Pagefind,
404 and all 25 sitemap URLs passed public checks. Canonical headers have no
global noindex; Pages hostname headers remain noindex. Keep host-specific rules
in public/_headers; do not add global preview noindex to the launched domain.

## Deploying changes

Node22 and pnpm11.1.1 from package.json. Run the gates in
[site-test-scope.md](site-test-scope.md), then build with CF_PAGES_COMMIT_SHA
set to the exact committed HEAD. astro.config.ts reads the public GA4 ID from
wrangler.toml when no environment override exists; no second ID is required.
Run node scripts/audit-production.mjs after build.

For existing authorized Wrangler OAuth, set PRODUCTION_LAUNCHED=true and a new
PAGES_UPLOAD_SUBDIR name, then run node scripts/prepare-pages-upload.mjs.
It stages under reports and refuses to overwrite an existing directory.
Deploy that directory with pinned Wrangler4.149.0, explicit account/project,
branch main and the exact commit hash. Confirm deployment API success and the
live /.well-known/anvilwiki-deploy.txt marker before reporting it complete.
Never publish uncommitted source as a clean deployment.

Native Git integration needs this repository added to the existing Cloudflare
Pages GitHub app (installation170863434). Its visible access list currently
contains only battleplan-guides; GitHub requests identity verification before
editing it. Preserve unrelated existing repository permissions. The user has
authorized continuing with this repository; no app uninstall is required.
After that, create sublustrum-guide, main, pnpm build, output dist, Node22,
pnpm11.1.1. Validate the new project before moving the canonical domain.

The alternative .github/workflows/pages-upload.yml passed a credentials-free
dry run. PAGES_AUTO_DEPLOY remains unset and no Cloudflare secret was shared
with GitHub. Saving a credential there remains a separate authorization.
Do not interpret “the CF webpage works” as permission to share credentials.

## Search and analytics

GSC domain ownership is verified through an apex TXT record. Keep that record.
Both sitemap-index.xml and sitemap-0.xml were submitted. The first sitemap
status showed Couldn't fetch, while the live homepage test succeeded and the
homepage was discovered from sitemap-0.xml; check the later GSC status before
claiming sitemap processing success. Homepage indexing was requested.
Discovery, crawl availability, indexing, impressions and clicks are separate.

GA4 dedicated property558703003, web stream16118920742, measurement ID
G-TJ0Q9BSF7R. Enhanced measurement is off. The consent banner gates the loader;
decline keeps it off after reload. Public QA confirmed an accepted real page_view
received HTTP204 from Google. The dedicated GA4 realtime report also confirmed page_view, session_start and first_visit;
QA visits do not count as organic traffic. Privacy copy reflects actual behavior.

IndexNow is for participating engines, not Google. Submit only after checking
the exact live commit and public key. Keep the CI-driven PRODUCTION_LAUNCHED
repository flag disabled until deployment and source CI are synchronized;
otherwise a docs-only commit may wait for a deployment that never happens.

## Review schedule and content freeze

Four one-time thread reviews were created for October16, October20, October27
and November10 at17:00 Asia/Shanghai (launch+3/+7/+14/+28 days). IDs:
sublustrum-3, sublustrum-7, sublustrum-14, sublustrum-28. They check real evidence,
save reports and stay quiet when unchanged and non-actionable. Keep this local
project accessible and the app/computer running for local scheduled work;
see [official scheduling documentation](https://learn.chatgpt.com/docs/automations?surface=app).

Do not manufacture complete puzzle answers, metrics or daily rewrites. The
Chapter One complete route remains draft/noindex until current A/B evidence
exists. Use actual search demand, correctness issues and official build changes
to decide updates; evaluate whether to freeze investment at day28.
