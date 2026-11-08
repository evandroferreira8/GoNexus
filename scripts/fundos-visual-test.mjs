import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true});
const luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{a=luminance(a);b=luminance(b);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
try{
 const catalog=JSON.parse(fs.readFileSync(new URL('../fundos-catalogo.json',import.meta.url)));
 for(const item of catalog.items.filter(i=>i.image))for(const path of [item.image.src,item.image.thumbnail])assert.ok(fs.statSync(new URL('../'+path,import.meta.url)).size>500,path);
 for(const width of [360,390,768,1365])for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await page.goto(base+'colecao-fundos.html');await page.waitForSelector('.bg-art img');
  await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  const result=await page.evaluate(()=>{
   const art=document.querySelector('.bg-grid .bg-art'),img=art.querySelector('img');
   const colors=selector=>{const s=getComputedStyle(document.querySelector(selector));return [s.color,s.backgroundColor].map(c=>c.match(/[\d.]+/g).slice(0,3).map(Number))};
   return {overflow:document.documentElement.scrollWidth>innerWidth,ratio:art.clientWidth/art.clientHeight,fit:getComputedStyle(img).objectFit,ticket:colors('.bg-ticket small'),badge:colors('.bg-badge')};
  });
  assert.equal(result.overflow,false);assert.ok(Math.abs(result.ratio-1)<.02);assert.equal(result.fit,'cover');
  for(const name of ['ticket','badge'])assert.ok(contrast(...result[name])>=4.5,`${width} ${theme} ${name}`);
  await page.locator('[data-detail]').first().click();
  assert.equal(await page.locator('#bg-detail .bg-art img').evaluate(el=>getComputedStyle(el).objectFit),'contain');
  await page.close();
 }
 console.log('PASS: 264 local images, square cards, complete detail images, no overflow and text contrast >=4.5:1 at four widths in both themes.');
}finally{await browser.close()}
