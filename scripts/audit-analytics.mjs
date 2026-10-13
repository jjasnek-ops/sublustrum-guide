import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// Isolated public-site QA. Never opens a signed-in browser profile.
const { chromium } = await import(pathToFileURL(process.env.CODEX_BROWSER_PACKAGE).href);
const origin = 'https://sublustrumguide.wiki';
const measurementId = fs.readFileSync('wrangler.toml', 'utf8')
  .match(/^PUBLIC_GA_ID\s*=\s*"(G-[A-Z0-9]+)"\s*$/m)?.[1];
if (!measurementId) throw new Error('No configured GA4 measurement ID');
const browser = await chromium.launch({ headless: true, channel: 'msedge', args: ['--no-proxy-server'] });
const evidence = { origin, measurementId, qaOnly: true, stages: [] };
fs.mkdirSync('reports/screenshots', { recursive: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => {
    if (/googletagmanager\.com|google-analytics\.com/.test(request.url())) requests.push(request);
  });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await page.getByRole('dialog', { name: 'Cookies', exact: true }).waitFor();
  if (requests.length) throw new Error('Tracking request occurred before consent');
  evidence.stages.push({ stage: 'before-consent', trackingRequests: 0 });
  await page.screenshot({ path: 'reports/screenshots/production-analytics-consent-390.png', fullPage: true });
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.reload({ waitUntil: 'networkidle' });
  if (requests.length) throw new Error('Tracking request occurred after declining');
  evidence.stages.push({ stage: 'decline-and-reload', trackingRequests: 0 });
  await context.close();

  const acceptedContext = await browser.newContext();
  const acceptedPage = await acceptedContext.newPage();
  const pageView = acceptedPage.waitForResponse(response => {
    const request = response.request();
    const url = new URL(request.url());
    if (!url.hostname.endsWith('google-analytics.com') || !url.pathname.endsWith('/collect')) return false;
    const fields = new URLSearchParams(url.search);
    for (const [key, value] of new URLSearchParams(request.postData() || '')) fields.set(key, value);
    return fields.get('tid') === measurementId && fields.get('en') === 'page_view' &&
      fields.get('dl') === origin + '/';
  }, { timeout: 45000 });
  await acceptedPage.goto(origin + '/', { waitUntil: 'networkidle' });
  await acceptedPage.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  const response = await pageView;
  if (!response.ok()) throw new Error('Google collection returned HTTP ' + response.status());
  evidence.stages.push({ stage: 'accepted', event: 'page_view', collectionStatus: response.status() });
  evidence.status = 'COMPLETED';
  fs.writeFileSync('reports/production-analytics-audit.json', JSON.stringify(evidence, null, 2));
  console.log('COMPLETED: no tracking before consent or after decline/reload; accepted real page_view acknowledged by Google. QA activity is not organic traffic.');
} catch (error) {
  evidence.status = 'FAILED';
  evidence.error = error.message;
  fs.writeFileSync('reports/production-analytics-audit.json', JSON.stringify(evidence, null, 2));
  throw error;
} finally {
  await browser.close();
}
