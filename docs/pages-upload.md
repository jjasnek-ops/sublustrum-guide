# Pages deployment through GitHub Actions

Alternative to the Cloudflare GitHub App installation, which currently fails
with error8000011. This uses the already deployed Direct Upload project
`sublustrum-guide-preview` and retains GitHub as the source of truth. Its name
does not prevent a canonical custom domain. The native Git project name is still
available if its installation is repaired later.

Workflow: `.github/workflows/pages-upload.yml`. Only main can run. A manual run
with `deploy=false` validates all eight site gates, metadata and upload staging
without credentials. `deploy=true` uploads using pinned Wrangler4.149.0.
Push deployment is disabled until `PAGES_AUTO_DEPLOY=true` is set.

Credential activation is pending user approval: GitHub repository secret
`CLOUDFLARE_API_TOKEN`, scoped to Account / Cloudflare Pages / Edit for account
e26c192b02bb6ba662ec2e8a64a2c3a7. Do not upload Wrangler OAuth/refresh credentials.
The credential is supplied only to the upload step, not build steps or PRs.

The uploader stages `dist/` into an isolated folder and sets all URLs noindex
until `PRODUCTION_LAUNCHED=true`. Pages hostnames remain noindex thereafter.
Verify the canonical domain's DNS, HTTPS and real pages before changing this
flag. The original production `dist/_headers` remains untouched.

On 2026-10-13, the Pages custom-domain API accepted `sublustrumguide.wiki`:
domain IDf5761299-0357-48f2-940b-769af8f4f3c9, status initializing/pending.
This association does not establish live DNS, an active certificate or launch.
The target Zone was still absent when inspected.

References:
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/pages/configuration/headers/
