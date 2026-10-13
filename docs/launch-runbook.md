# Launch runbook (canonical-domain deployment pending)

## Current state — 2026-10-13 13:47 Asia/Shanghai

Cloudflare login is confirmed. Independently deployed and tested preview:
https://sublustrum-guide-preview.pages.dev/ . Project ID
6b7cc5af-c5ca-4677-b8d3-538d01ed44ea; deployment
661bc302-ff9b-4907-ab3f-58aee81dfc59; source commit
2029b4e388254a4e98631a2a9fb50f428f0575d4. Preview uses direct upload, has no Git
source and is intentionally noindex. Its isolated staged headers must never be
copied into the canonical site's production headers.

The intended Git-integrated sublustrum-guide project was not created: API error
8000011 requires Git installation repair. Current OAuth is sufficient for Pages
but Zone creation was rejected for missing account.zone.create. A subsequently
supplied API Token was verified active and used transiently; it also failed Zone
creation with the same permission error and Git creation with 8000011. Its
account listing returned empty; this does not establish its complete scope.
Local API Token input may be supplied as CLOUDFLARE_API_TOKEN in .env.local
(gitignored) or environment. Never put it in a commit or chat message.

Only the section below which describes the canonical/Git-integrated launch is
still pending. Preview HTTPS, all 25 sitemap pages, 404, hints, mobile and search
were actually verified; this does not establish canonical-domain launch.

Repository: https://github.com/jjasnek-ops/sublustrum-guide
Canonical origin: https://sublustrumguide.wiki
AnvilWiki v2.37.0 upstream: 9d36b1bac488d3bbef0d37540c94594b4fe06680.

Cloudflare Pages Git integration: connect this repository, main branch, build
command `pnpm build`, output `dist`, Node 22 or newer compatible version and
pnpm from package.json (11.1.1). `wrangler.toml` carries SITE_URL; optional ads,
comments and analytics are blank. The separate preview project above is verified;
the intended Git-integrated canonical project remains pending. Do not substitute
GitHub Pages or another hosting platform.

Authentication: `npx wrangler login` then `npx wrangler whoami`. Prefer creating
a Git-integrated Pages project via the authorized dashboard when that session
is accessible. Direct-upload projects cannot later switch to Git integration;
choose the intended integration before creating a project.

The apex domain currently uses Spaceship nameservers. Cloudflare requires the
apex to be a zone in the same account as the Pages project, with nameservers
pointing to Cloudflare. First inventory/import existing DNS records, verify all
unrelated records, then update registrar nameservers with domain-owner access.
Never delete unrelated DNS entries. Add the domain through Pages Custom domains;
a standalone CNAME without that association is insufficient.

Source: https://developers.cloudflare.com/pages/configuration/custom-domains/

After deployment, verify HTTPS, root, sitemap.xml, sitemap-index.xml, robots.txt,
all hubs/articles, 404, Pagefind search, mobile layout and canonical origin.
Configure www-to-apex and pages.dev-to-apex redirects only after apex TLS works.
After all public URL checks pass, set the GitHub variable PRODUCTION_LAUNCHED
to true to enable the existing IndexNow submission workflow. It is deliberately
inactive while the canonical origin is not deployed.
Record actual deployment ID, Pages URL and commit in launch-verification.md.

GSC/GA4: verify domain property, submit sitemap-index.xml, then track discovery,
indexing, impressions and clicks separately. Configure PUBLIC_GA_ID only after
a real property/stream exists; verify an actual page_view with consent. Current
analytics are disabled. No indexing or traffic claims should be made.

Review at actual launch +3/+7/+14/+28 days. Until launch is confirmed, no dated
follow-up automation is established.
