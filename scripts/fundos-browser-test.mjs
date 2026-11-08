import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {emptyCollection,encodeShare,STORAGE_KEY,BACKUP_KEY} from '../fundos-core.mjs';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:8765/';
const out=process.env.TEST_OUTPUT_DIR||'audit-results/fundos';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const checks=[];
// Some managed Windows runners cannot complete browser file writes. In that
// environment, validate the exact generated Blob; verify actual downloads in IAB.
const captureBlobs=process.env.TEST_CAPTURE_BLOBS==='1';
async function downloadBytes(page,download){
 try{return await fs.readFile(await download.path());}
 catch(error){if(!captureBlobs)throw error;console.log('HOST_DOWNLOAD_LIMIT: validating generated Blob; actual save requires interactive-browser check.');return Buffer.from(await page.evaluate(async url=>Array.from(new Uint8Array(await window.__testBlobs.get(url).arrayBuffer())),download.url()));}
}
try{
 for(const width of [360,390,768,1365]){
  const context=await browser.newContext({viewport:{width,height:900},locale:'pt-BR',reducedMotion:'reduce',acceptDownloads:true});
  if(captureBlobs)await context.addInitScript(()=>{window.__testBlobs=new Map();const original=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{const url=original(blob);window.__testBlobs.set(url,blob);return url;};});
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'colecao-fundos.html');await page.waitForSelector('.bg-card');
  assert.equal(await page.locator('.bg-card').count(),width<=600?8:20);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const firstId=await page.locator('[data-obtain]').first().getAttribute('data-obtain');
  await page.locator('[data-obtain]').first().click();assert.equal(await page.locator('#bg-obtained').textContent(),'1');
  await page.reload();await page.waitForSelector('.bg-card');assert.equal(await page.locator('[data-obtain]').first().getAttribute('aria-pressed'),'true');
  await page.locator('[data-obtain]').first().click();assert.equal(await page.locator('#bg-obtained').textContent(),'0');await page.locator('[data-obtain]').first().click();
  await page.locator('[data-ownership="owned"]').click();assert.equal(await page.locator('.bg-card').count(),1);
  await page.locator('[data-ownership=""]').click();await page.locator('#bg-filter-toggle').click();await page.locator('#bg-category').selectOption('special');await page.locator('#bg-year').selectOption('2024');await page.locator('#bg-search').fill('ultra');assert.ok(await page.locator('.bg-card').count()>0);
  await page.locator('#bg-search').fill('no-such-background-xyz');assert.equal(await page.locator('#bg-empty').isVisible(),true);await page.locator('#bg-reset-empty').click();
  await page.locator('[data-detail]').first().click();assert.equal(await page.locator('#bg-detail').isVisible(),true);await page.keyboard.press('Escape');
  const exportWait=page.waitForEvent('download');await page.locator('#bg-export').click();const exportFile=await exportWait;const raw=JSON.parse((await downloadBytes(page,exportFile)).toString('utf8'));assert.deepEqual(raw.obtained,[firstId]);
  const invalid={...emptyCollection(),version:999};await page.locator('#bg-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});await page.waitForFunction(()=>document.querySelector('#bg-toast').textContent.includes('inválido'));assert.equal(await page.locator('#bg-import-dialog').isVisible(),false);
  const incoming={...emptyCollection(),obtained:['unknown-preserved-id']};await page.locator('#bg-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(incoming))});await page.locator('#bg-merge').click();
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).obtained,STORAGE_KEY),[firstId,'unknown-preserved-id']);
  await page.locator('#bg-file').setInputFiles({name:'replace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(emptyCollection()))});assert.equal(await page.locator('#bg-replace').isDisabled(),true);await page.locator('#bg-replace-confirm').check();await page.locator('#bg-replace').click();assert.equal(await page.locator('#bg-obtained').textContent(),'0');
  await page.locator('#bg-restore').click();await page.locator('#bg-merge').click();assert.equal(await page.locator('#bg-obtained').textContent(),'1');
  await page.locator('#bg-share').click();await page.locator('#bg-trainer').fill('João ✦ Treinador');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedLink=text;}}}));
  await page.locator('#bg-copy-link').click();const copiedLink=await page.evaluate(()=>window.__copiedLink);assert.ok(copiedLink.startsWith(base+'colecao-fundos.html#colecao='));
  const imageWait=page.waitForEvent('download');await page.locator('#bg-download-image').click();const image=await imageWait;const bytes=await downloadBytes(page,image);assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),1080);assert.equal(bytes.readUInt32BE(20),1350);if(width===390)await fs.writeFile(out+'/colecao-compartilhada.png',bytes);
  const before=await page.evaluate(key=>localStorage.getItem(key),STORAGE_KEY);
  const url=copiedLink;
  const shared=await context.newPage();await shared.goto(url);await shared.waitForSelector('.bg-card');assert.equal(await shared.locator('#bg-shared').isVisible(),true);assert.equal(await shared.locator('[data-obtain]').first().isDisabled(),true);assert.equal(await shared.locator('#bg-obtained').textContent(),'1');assert.equal(await shared.evaluate(key=>localStorage.getItem(key),STORAGE_KEY),before);await shared.close();
  const invalidLink=await context.newPage();await invalidLink.goto(base+'colecao-fundos.html#colecao=bad');await invalidLink.waitForSelector('#bg-storage-warning');assert.equal(await invalidLink.locator('#bg-import').isVisible(),false);assert.equal(await invalidLink.evaluate(key=>localStorage.getItem(key),STORAGE_KEY),before);await invalidLink.close();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('blocked');}}}));await page.locator('#bg-copy-link').click();assert.equal(await page.locator('#bg-link-fallback').isVisible(),true);assert.equal(await page.locator('#bg-link-value').inputValue(),copiedLink);
  await page.keyboard.press('Escape');await page.locator('#bg-filter-toggle').click();await page.screenshot({path:`${out}/catalogo-${width}.png`,fullPage:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/previa-${width}.png`});
  assert.deepEqual(errors,[]);checks.push({width,status:'passed',checks:['toggle','reload','filters','empty','details','export','invalid-import','merge','replace','restore','png','shared-readonly','invalid-link','no-overflow','no-external-services']});await context.close();
 }

 // Four independently chosen highlights survive reopening the preview without changing the collection.
 {
  const context=await browser.newContext({viewport:{width:390,height:850},locale:'pt-BR',acceptDownloads:true});
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'colecao-fundos.html');await page.waitForSelector('.bg-card');
  const picked=await page.evaluate(async()=>{
    const data=await(await fetch('fundos-catalogo.json')).json();
    const ids=data.items.filter(item=>item.status==='released'&&item.image&&(!item.releaseDate||item.releaseDate<=new Date().toISOString().slice(0,10))).slice(0,6).map(item=>item.id);
    localStorage.setItem('go-nexus:backgrounds:v1',JSON.stringify({format:'go-nexus-backgrounds',version:1,trainer:'Teste do cartão',obtained:ids}));
    return ids;
  });
  assert.equal(picked.length,6);
  await page.reload();await page.waitForSelector('.bg-card');
  await page.locator('#bg-share').click();
  await page.locator('#bg-featured-editor summary').click();
  assert.equal(await page.locator('.bg-featured-item.is-selected').count(),4);
  const initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('go-nexus:backgrounds:v1')));
  await page.locator('.bg-featured-item.is-selected').first().click();
  assert.equal(await page.locator('.bg-featured-item.is-selected').count(),3);
  await page.locator('.bg-featured-item:not(.is-selected)').first().click();
  assert.equal(await page.locator('.bg-featured-item.is-selected').count(),4);
  const chosen=await page.evaluate(()=>JSON.parse(localStorage.getItem('go-nexus:backgrounds:featured:v1')));
  assert.equal(chosen.length,4);assert.ok(chosen.every(id=>picked.includes(id)));
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('go-nexus:backgrounds:v1'))),initial);
  const saved=page.waitForEvent('download');await page.locator('#bg-download-image').click();
  const png=await downloadBytes(page,await saved);
  assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(png.readUInt32BE(16),1080);assert.equal(png.readUInt32BE(20),1350);
  await page.locator('#bg-share-dialog [data-close]').click();
  await page.locator('#bg-share').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('go-nexus:backgrounds:featured:v1')).length),4);
  assert.deepEqual(errors,[]);
  await context.close();
  checks.push({status:'passed',checks:['four-featured-images','personalized-selection','persisted-highlights','collection-unmodified','1080x1350-png']});
 }

 // Corrupt local storage and write quota errors must be visible and recoverable.
 const context=await browser.newContext();await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());const page=await context.newPage();await page.goto(base+'colecao-fundos.html');await page.waitForSelector('.bg-card');await page.evaluate(key=>localStorage.setItem(key,'broken-json'),STORAGE_KEY);await page.reload();await page.waitForSelector('.bg-card');assert.equal(await page.locator('[data-obtain]').first().isDisabled(),true);assert.equal(await page.evaluate(key=>localStorage.getItem(key),STORAGE_KEY),'broken-json');
 await page.locator('#bg-file').setInputFiles({name:'recovery.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(emptyCollection()))});await page.locator('#bg-replace-confirm').check();await page.locator('#bg-replace').click();assert.equal(await page.locator('[data-obtain]').first().isDisabled(),false);assert.equal(await page.evaluate(key=>localStorage.getItem(key),BACKUP_KEY),'broken-json');
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError');};});await page.locator('[data-obtain]').first().click();assert.equal(await page.locator('#bg-storage-warning').isVisible(),true);assert.equal(await page.locator('#bg-obtained').textContent(),'1');await context.close();checks.push({status:'passed',checks:['corrupt-data-preserved','explicit-recovery','quota-warning']});
 await fs.writeFile(out+'/results.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));
}finally{await browser.close();}
