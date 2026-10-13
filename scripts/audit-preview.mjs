import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.CODEX_BROWSER_PACKAGE).href);
const proxyUrl=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
let proxy;
if(proxyUrl){const p=new URL(proxyUrl);proxy={server:`${p.protocol}//${p.host}`,...(p.username?{username:decodeURIComponent(p.username),password:decodeURIComponent(p.password)}:{})};}
const browser=await chromium.launch({headless:true,channel:'msedge',...(proxy?{proxy}:{})});
const base='https://sublustrum-guide-preview.pages.dev';const canonical='https://sublustrumguide.wiki';
const errors=[];const results=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/guides/getting-started/','/guides/original-vs-remake/','/puzzles/echophone-hints/','/updates/playtest/','/updates/release-date/','/updates/system-requirements/']){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});
  const data={route,status:response.status(),title:await page.title(),canonical:await page.locator('link[rel="canonical"]').getAttribute('href'),robots:response.headers()['x-robots-tag'],h1:await page.locator('h1').count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),broken:await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src))};
  if(data.status!==200||data.h1!==1||data.overflow||data.broken.length||data.canonical!==canonical+route||!data.robots?.includes('noindex'))throw new Error('Preview page audit failed: '+route);
  results.push(data);
  if(route==='/'||route.includes('echophone'))await page.screenshot({path:`reports/screenshots/preview-${route==='/'?'home':'hints'}-1440.png`,fullPage:true});
  if(route.includes('echophone')){await page.getByText('Hint 1 — notice more than the sound',{exact:true}).click();if(await page.locator('details').filter({has:page.getByText('Hint 1 — notice more than the sound',{exact:true})}).getAttribute('open')===null)throw new Error('Preview hint reveal failed');}
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/',{waitUntil:'networkidle'});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Preview mobile overflow');
 await page.screenshot({path:'reports/screenshots/preview-home-390.png',fullPage:true});
 await page.getByRole('button',{name:'Search',exact:true}).click();
 await page.getByPlaceholder('Search guides, hints and updates...').fill('Echophone');
 await page.waitForSelector('.pagefind-ui__result-link');
 const searchResults=await page.locator('.pagefind-ui__result-link').allTextContents();
 if(!searchResults.some(t=>t.includes('Echophone')))throw new Error('Public search result absent');
 await page.screenshot({path:'reports/screenshots/preview-search-390.png',fullPage:true});
 if(errors.length)throw new Error('Preview browser errors');
 fs.writeFileSync('reports/preview-browser-audit.json',JSON.stringify({status:'COMPLETED',base,results,searchResults,errors},null,2));
 console.log('COMPLETED: seven public pages, canonical/noindex headers, images, mobile, hints and search; no browser errors.');
}catch(e){fs.writeFileSync('reports/preview-browser-error.txt',e.message);throw e;}
finally{await browser.close();}
