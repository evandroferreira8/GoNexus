// Validate the actual PNG pixels, not just the appearance of the share dialog.
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const out='audit-results/studio-rebuild';
fs.mkdirSync(out,{recursive:true});
const tests=[
 {file:'central-mega.html',trigger:'#megaAnswer + .nx-result-share',dialog:'.nx-result-dialog',name:'mega'},
 {file:'evolucoes-especiais.html',trigger:'[data-share-route]',dialog:'.nx-share-dialog',name:'evolution'}
];
let errors=[];
for(const test of tests){
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'pt-BR',reducedMotion:'reduce'});
 await context.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:8765/')?r.continue():r.abort());
 const page=await context.newPage();
 try{
  await page.goto('http://127.0.0.1:8765/'+test.file,{waitUntil:'domcontentloaded',timeout:35000});
  const button=page.locator(test.trigger).first();
  await button.waitFor({timeout:12000});
  await button.evaluate(el=>{const details=el.closest('details');if(details)details.open=true;});
  await button.click();
  const dialog=page.locator(test.dialog);
  const img=dialog.locator('img').first();
  await img.waitFor({state:'visible',timeout:21000});
  const imageInfo=await img.evaluate(async img=>{
   await img.decode();
   const canvas=document.createElement('canvas');
   canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
   const pixel=(x,y)=>Array.from(ctx.getImageData(x,y,1,1).data).slice(0,3);
   return {width:canvas.width,height:canvas.height,upperLeft:pixel(20,120),lowerLeft:pixel(20,canvas.height-120)};
  });
  assert.equal(imageInfo.width,1080,'Export width changed');
  assert.ok(imageInfo.height>=1000,'Export image incomplete');
  assert.ok(imageInfo.upperLeft.every(v=>v>=225),'PNG still uses the old dark background');
  assert.ok(imageInfo.lowerLeft.every(v=>v>=225),'PNG footer/background is still dark');
  await dialog.screenshot({path:path.join(out,'export-'+test.name+'-modal.png'),animations:'disabled'});
  console.log('EXPORT_QA '+JSON.stringify({file:test.file,...imageInfo}));
 }catch(e){errors.push(test.file+': '+String(e.message));console.error('EXPORT_QA_FAIL '+test.file+': '+String(e.message));}
 finally{await context.close();}
}
await browser.close();
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
