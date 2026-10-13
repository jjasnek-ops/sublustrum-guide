import fs from 'node:fs';
// Keep the template's canonical sitemap index and provide the requested alias.
fs.copyFileSync('dist/sitemap-index.xml','dist/sitemap.xml');
