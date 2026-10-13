import fs from 'node:fs';
import path from 'node:path';

// Stage a complete build without changing dist/ or source headers.
const reportsRoot = path.resolve('reports');
const stage = path.resolve(reportsRoot, process.env.PAGES_UPLOAD_SUBDIR || 'pages-upload');
if (!stage.startsWith(reportsRoot + path.sep)) {
  throw new Error('Upload staging must stay within the reports directory.');
}
if (fs.existsSync(stage)) {
  throw new Error('Upload staging directory already exists; use a fresh checkout/build workspace.');
}
fs.mkdirSync(path.dirname(stage), { recursive: true });
fs.cpSync('dist', stage, { recursive: true });

let headers = fs.readFileSync(path.join(stage, '_headers'), 'utf8');
if (!headers.includes('https://:project.pages.dev/*')) {
  headers += '\n# Keep Pages hostnames out of search after canonical launch.\n'
    + 'https://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n\n'
    + 'https://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n';
}
if (process.env.PRODUCTION_LAUNCHED !== 'true') {
  headers += '\n# Canonical launch has not yet passed domain/TLS verification.\n'
    + '/*\n  X-Robots-Tag: noindex, nofollow\n';
}
fs.writeFileSync(path.join(stage, '_headers'), headers);
console.log('Pages upload staged; canonical indexing ' +
  (process.env.PRODUCTION_LAUNCHED === 'true' ? 'enabled' : 'held until launch verification') + '.');
