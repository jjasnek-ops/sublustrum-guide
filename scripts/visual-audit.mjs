import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const runtime=process.env.CODEX_BROWSER_PACKAGE;
if(!runtime)throw new Error('Set CODEX_BROWSER_PACKAGE to the bundled Playwright package entry');
const {chromium}=await import(pathToFileURL(runtime).href);
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_TEST_CHANNEL?{channel:process.env.PLAYWRIGHT_TEST_CHANNEL}:{})});
const base=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4324';
const results=[];const errors=[];
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/puzzles/echophone-hints/','/guides/getting-started/','/updates/playtest/']){
   const response=await page.goto(base+route,{waitUntil:'networkidle'});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   const h1=await page.locator('h1').count();
   const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));
   const title=await page.title();
   results.push({route,width:viewport.width,status:response.status(),overflow,h1,broken,title,theme:await page.locator('html').getAttribute('class')});
   const name=route==='/'?'home':route.split('/').filter(Boolean).join('-');
   await page.screenshot({path:`reports/screenshots/${name}-${viewport.width}.png`,fullPage:true});
   if(route.includes('echophone')){
    const panel=page.locator('details').filter({has:page.getByText('Hint 1 — notice more than the sound',{exact:true})});
    if(await panel.getAttribute('open')!==null)throw new Error('Hint starts open');
    await page.getByText('Hint 1 — notice more than the sound',{exact:true}).click();
    if(await panel.getAttribute('open')===null)throw new Error('Hint did not open');
    const limits=page.getByText('Verification limits — exact locations & full solutions',{exact:true});
    await limits.click();
    await page.screenshot({path:`reports/screenshots/hints-expanded-${viewport.width}.png`,fullPage:true});
   }
  }
  await page.goto(base+'/');
  const states=[];
  for(let i=0;i<3;i++){await page.locator('#theme-toggle').click();states.push(await page.locator('html').getAttribute('class'));}
  if(!states[0].includes('black')||states[1].includes('dark')||!states[2].includes('dark'))throw new Error('Theme cycle failed');
  results.push({width:viewport.width,themeCycle:states});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Search',exact:true}).click();
 await page.getByPlaceholder('Search guides, hints and updates...').fill('Echophone');
 await page.waitForSelector('.pagefind-ui__result-link');
 const searchResults=await page.locator('.pagefind-ui__result-link').allTextContents();
 if(!searchResults.some(s=>s.includes('Echophone')))throw new Error('Expected search result absent');
 results.push({search:'Echophone',searchResults});
 await page.screenshot({path:'reports/screenshots/search-results.png',fullPage:true});
 await context.close();
 const draftContext=await browser.newContext({viewport:{width:1440,height:1000}});
 const draft=await draftContext.newPage();
 const draftResponse=await draft.goto('http://127.0.0.1:4325/guides/chapter-one-walkthrough/',{waitUntil:'networkidle'});
 if(draftResponse.status()!==200)throw new Error('Draft layout sample unavailable');
 await draft.screenshot({path:'reports/screenshots/walkthrough-draft-1440.png',fullPage:true});
 results.push({draftSample:'dev only',status:draftResponse.status(),noindex:await draft.locator('meta[name="robots"]').getAttribute('content')});
 await draftContext.close();
 fs.writeFileSync('reports/browser-audit.json',JSON.stringify({base,results,errors},null,2));
 if(errors.length||results.some(r=>r.overflow||r.h1!==undefined&&r.h1!==1||r.broken?.length||r.status!==undefined&&r.status!==200))throw new Error('Browser checks failed; see report');
 console.log('COMPLETED: desktop/mobile layout, images, headings, theme, hints, search; no page errors.');
}finally{await browser.close();}
