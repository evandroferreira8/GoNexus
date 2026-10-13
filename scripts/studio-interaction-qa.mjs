import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const errors=[];
async function check(width,file,fn){
 const context=await browser.newContext({viewport:{width,height:width<600?844:850},reducedMotion:'reduce',locale:'pt-BR'});
 await context.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:8765/')?route.continue():route.abort());
 const page=await context.newPage(),pageErrors=[];
 page.setDefaultTimeout(6500);
 page.on('pageerror',e=>pageErrors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(100);
  await fn(page);
  assert.deepEqual(pageErrors,[],'Erro JavaScript durante interação');
  console.log('INTERACTION_OK '+width+' '+file);
 }catch(e){
  errors.push({width,file,error:e.message.slice(0,500)});
  console.log('INTERACTION_FAIL '+JSON.stringify(errors.at(-1)));
 }finally{await context.close()}
}
for(const width of [390,1365]){
 await check(width,'tipagens.html',async page=>{
   await page.locator('[data-combat-tab="weather"]').click();
   assert.equal(await page.locator('#weatherPanel').isVisible(),true);
   assert.ok(await page.locator('.weather-btn').count()>=2);
   await page.locator('[data-combat-tab="types"]').click();
   assert.equal(await page.locator('#typesPanel').isVisible(),true);
   await page.locator('[data-combat-tab="analyzer"]').click();
   assert.equal(await page.locator('#analyzerPanel').isVisible(),true);
 });
 await check(width,'guia-busca.html',async page=>{
   await page.locator('.langbtn[data-lang="en"]').click();
   assert.equal(await page.locator('.langbtn[data-lang="en"]').getAttribute('aria-pressed'),'true');
   await page.locator('.langbtn[data-lang="pt"]').click();
   assert.equal(await page.locator('.langbtn[data-lang="pt"]').getAttribute('aria-pressed'),'true');
   await page.locator('#sb-species').fill('Pikachu');
   assert.match((await page.locator('#sb-result').innerText()).toLowerCase(),/pikachu/);
   assert.equal(await page.locator('#sb-copy').isDisabled(),false);
 });
 await check(width,'calculadora.html',async page=>{
   await page.locator('#price').fill('1000');
   assert.doesNotMatch(await page.locator('#answer').innerText(),/Informe o preço/i);
   await page.locator('#price').fill('');
   assert.match(await page.locator('#answer').innerText(),/Informe o preço/i);
 });
 await check(width,'poeira-estelar.html',async page=>{
   assert.ok(await page.locator('#groups').locator('.group').count()>0);
   await page.locator('#groupFilter').selectOption('500');
   assert.equal(await page.locator('#groupFilter').inputValue(),'500');
   await page.locator('#eventBonus').selectOption('2');
   await page.locator('#starPiece').check();
   assert.equal(await page.locator('#eventBonus').inputValue(),'2');
 });
 await check(width,'central-mega.html',async page=>{
   assert.ok(await page.locator('#availableList .mega-row').count()>5);
   await page.locator('#megaHave').fill('9999');
   assert.match(await page.locator('#megaAnswer').innerText(),/Energia suficiente/i);
   await page.locator('#megaDone').fill('30');
   assert.match(await page.locator('#levelAnswer').innerText(),/Nível Máximo/i);
 });
 await check(width,'central-max.html',async page=>{
   await page.evaluate(()=>document.getElementById('maxAnswer').closest('details').open=true);
   await page.locator('.current[data-move="attack"]').selectOption('3');
   await page.locator('.target[data-move="attack"]').selectOption('1');
   assert.match(await page.locator('#maxAnswer').innerText(),/Atenção/i);
 });
 await check(width,'evolucoes-especiais.html',async page=>{
   assert.ok(await page.locator('#grid > *').count()>0);
   await page.locator('#search').fill('Eevee');
   await page.locator('#clear').click();
   assert.equal(await page.locator('#search').inputValue(),'');
   assert.ok(await page.locator('#grid > *').count()>0);
 });
 await check(width,'formas-especiais.html',async page=>{
   await page.locator('.switch .tab[data-tab="ditto"]').click();
   assert.equal(await page.locator('#ditto').isVisible(),true);
   await page.locator('.switch .tab[data-tab="visual"]').click();
   assert.equal(await page.locator('#visual').isVisible(),true);
   await page.locator('.switch .tab[data-tab="fusion"]').click();
   assert.equal(await page.locator('#fusion').isVisible(),true);
 });
 await check(width,'efeitos-aventura.html',async page=>{
   await page.locator('.chip[data-f="capture"]').click();
   assert.ok((await page.locator('.chip[data-f="capture"]').getAttribute('class')).includes('on'));
   const visible=page.locator('.grid .card:not(.hide)');
   assert.ok(await visible.count()>0);
   await visible.first().locator('button.details').click();
   assert.ok(await visible.first().isVisible());
   await page.locator('.chip[data-f="all"]').click();
   assert.ok(await page.locator('.grid .card:not(.hide)').count()>=await visible.count());
 });
 await check(width,'pokeparadas.html',async page=>{
   await page.locator('.cat-btn').first().waitFor();
   assert.ok(await page.locator('.cat-btn').count()>=2);
   await page.locator('.cat-btn').nth(1).click();
   assert.ok(await page.locator('#categoryResult').innerText().then(s=>s.length>40));
 });
 await check(width,'quiz.html',async page=>{
   await page.locator('.mode[data-mode="quick"]').click();
   assert.ok(await page.locator('#answers button').count()>1);
   await page.locator('#answers button').first().click();
   assert.ok((await page.locator('#feedback').innerText()).length>0);
 });
}
await browser.close();
console.log('INTERACTIONS_SUMMARY '+JSON.stringify({cases:22,failed:errors.length,errors}));
if(errors.length)process.exitCode=1;
