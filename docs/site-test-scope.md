# Site verification scope

This repository is an initialized AnvilWiki site, not the upstream demo/template.
The original full template test run is retained locally in reports/test.txt;
it initially failed because demo identity, Japanese content, landing pages and
setup-workflow fixtures were intentionally removed during initialization.

Vitest excludes eight upstream suites which require the shipped demo or its
marketing/initialization files: apply-template, changelog, codes-consistency,
community-digest, handbook, landing-paths, redirects and workflows. Their source
files remain in the repository for upstream reference. These are NOT_APPLICABLE
for this site's production gates, not silently passing tests.

The other 16 suites continue to exercise URL/SEO, locale and content parsing,
configuration, scripts, consent and component contracts. Expectations using
the live locale list and game-name identity were adapted to the initialized
English site. Astro checks production code; Vitest executes tests separately.

Local browser QA covers production pages on desktop/mobile, hint reveal, theme
switching, images, Pagefind search and browser errors. Production HTML audit
checks titles, descriptions, canonical URLs, sitemap membership and draft
exclusion. These are independent of the template-only fixtures.
