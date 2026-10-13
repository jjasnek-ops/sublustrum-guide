import fs from 'node:fs';
import path from 'node:path';
const root='dist';const origin='https://sublustrumguide.wiki';
const files=[];function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())walk(f);else if(f.endsWith('.html'))files.push(f);}}walk(root);
const results=[];const titles=new Set();
for(const file of files){
 const html=fs.readFileSync(file,'utf8');const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const desc=html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1];
 const canonical=html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1];
 const h1=(html.match(/<h1\b/g)||[]).length;const noindex=/<meta[^>]+name="robots"[^>]+content="[^\"]*noindex/.test(html);
 if(!title||titles.has(title)||!desc||h1!==1||!canonical?.startsWith(origin))throw new Error('Metadata failure '+file);
 titles.add(title);
 if(/Anvil Quest|Forge Master Kael|Claim starter codes|Replace this scaffold/.test(html))throw new Error('Demo residue '+file);
 for(const raw of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))JSON.parse(raw[1]);
 results.push({file,title,description:desc,canonical,h1,noindex});
}
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');const locs=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(locs.some(u=>!u.startsWith(origin)||/chapter-one-walkthrough|\/ja\/|\/landing/.test(u)))throw new Error('Invalid sitemap URL');
for(const url of locs){const p=new URL(url).pathname;const local=p==='/'?'dist/index.html':'dist'+p+'index.html';if(!fs.existsSync(local))throw new Error('Missing sitemap page '+url);}
if(fs.existsSync('dist/guides/chapter-one-walkthrough/index.html'))throw new Error('Draft leaked into production');
if(!fs.existsSync('dist/sitemap.xml'))throw new Error('Requested sitemap alias missing');
const robots=fs.readFileSync('dist/robots.txt','utf8');if(!robots.includes('Allow: /')||!robots.includes(origin+'/sitemap-index.xml'))throw new Error('Invalid robots');
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/production-audit.json',JSON.stringify({status:'COMPLETED',html_pages:results.length,sitemap_urls:locs.length,results},null,2));
console.log(`COMPLETED: ${results.length} HTML pages; ${locs.length} sitemap URLs; unique title/H1, descriptions, canonical, JSON-LD, demo/draft exclusion and robots checked.`);
