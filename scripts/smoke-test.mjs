import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = process.cwd();
const pages = fs.readdirSync(root).filter(name=>name.endsWith('.html'));
const failures = [];
let checkedScripts = 0;

for (const filename of fs.readdirSync(root).filter(name=>name.endsWith('.js'))) {
  new vm.Script(fs.readFileSync(filename,'utf8'),{filename});
  checkedScripts++;
}
for (const filename of pages) {
  const html = fs.readFileSync(filename,'utf8');
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if(match[1].includes('src=')) continue;
    if(match[1].includes('application/json') || match[1].includes('application/ld+json'))continue;
    if(match[2].trim())new vm.Script(match[2],{filename:filename+':inline'});
  }
  for(const match of html.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/g)){
    const raw=match[1].split(/[?#]/)[0];
    if(!raw || raw.includes('$') || /^[a-z]+:/i.test(raw) || raw.startsWith('//') || raw.startsWith('#') || raw.startsWith('data:'))continue;
    if(/\.(?:js|css|html|json)$/.test(raw) && !fs.existsSync(path.join(root,raw))) {
      failures.push(filename+' aponta para arquivo ausente: '+raw);
    }
  }
}
const news=JSON.parse(fs.readFileSync('news.json','utf8'));
const index=JSON.parse(fs.readFileSync('search-index.json','utf8'));
assert.equal(news.items.length,5,'News needs five articles');
assert.ok(news.items.every(item=>item.url.startsWith('https://pokemongo.com/pt-BR/news/')));
assert.ok(index.length>=11,'Search index missing modules');
assert.ok(index.every(item=>item.url && item.title));
console.log('Arquivos inspecionados:',pages.length,'HTML e',checkedScripts,'JS.');

const browser=await chromium.launch({headless:true});
try{
  for(const viewport of [{width:1365,height:850},{width:390,height:844}]){
    const context=await browser.newContext({viewport});
    await context.route('**/*',route=> {
      const url=route.request().url();
      if(url.startsWith('http://127.0.0.1:8765/'))return route.continue();
      return route.abort();
    });
    for(const file of pages){
      const tab=await context.newPage();
      const errors=[];
      tab.on('pageerror',e=>errors.push(e.message));
      try {
        await tab.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded',timeout:30000});
        await tab.waitForTimeout(180);
        const title=await tab.title();
        assert.ok(title,file+' sem título');
        if(errors.length)throw new Error(errors.join(' | '));
        if(file==='index.html'){
          await tab.locator('#globalSearch').fill('Ditto');
          assert.ok(await tab.locator('.search-result').count()>0,'Busca não retornou Ditto');
          await tab.locator('.news-card').first().waitFor({timeout:5000});
          assert.equal(await tab.locator('.news-card').count(),5,'Carrossel de notícias');
        }
        if(file==='calculadora.html'){
          await tab.locator('#answer').waitFor();
          assert.match(await tab.locator('#answer').innerText(),/Informe o preço/i,'Preço vazio precisa de aviso');
          await tab.locator('#price').fill('1000');
          assert.doesNotMatch(await tab.locator('#answer').innerText(),/Informe o preço/i);
        }
        if(file==='central-max.html'){
          await tab.locator('.current[data-move="attack"]').selectOption('3');
          await tab.locator('.target[data-move="attack"]').selectOption('1');
          await tab.locator('.target[data-move="guard"]').selectOption('2');
          const summary=await tab.locator('#maxAnswer').innerText();
          assert.match(summary,/Atenção/);
          assert.match(summary,/1\.000 Partículas Max/,'Linhas válidas precisam aparecer');
        }
        if(file==='quiz.html'){
          await tab.locator('.mode').first().click();
          assert.ok(await tab.locator('#answers button').count()>0,'Perguntas do quiz');
          await tab.locator('#answers button').first().click();
          assert.ok(await tab.locator('#feedback').innerText());
        }
      } catch(e) {
        failures.push(file+' ['+viewport.width+'px]: '+e.message);
        if(failures.length<10)await tab.screenshot({path:'/tmp/'+file+'-'+viewport.width+'.png',fullPage:true}).catch(()=>{});
      } finally {await tab.close();}
    }
    await context.close();
  }
}finally{await browser.close();}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('OK: todas as páginas abrem em desktop e mobile; buscas, cálculos, notícias e quiz verificados.');
