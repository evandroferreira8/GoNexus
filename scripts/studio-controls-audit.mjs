import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const folder='audit-results/controls';
fs.mkdirSync(folder,{recursive:true});
const pages=['index.html','tipagens.html','guia-busca.html','calculadora.html','poeira-estelar.html','central-mega.html','central-max.html','evolucoes-especiais.html','formas-especiais.html','efeitos-aventura.html','pokeparadas.html','quiz.html','anuncie.html','privacidade.html','termos.html'];
const sizes=[{id:'phone',width:390,height:844},{id:'desktop',width:1365,height:850}];
const results=[], browser=await chromium.launch({headless:true});
for(const size of sizes){
 const context=await browser.newContext({viewport:{width:size.width,height:size.height},locale:'pt-BR',reducedMotion:'reduce'});
 await context.route(/pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net/,r=>r.abort());
 for(const file of pages){
  const page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:8765/'+file,{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForTimeout(220);
   for(const accordion of ['main details.nx-accordion','main details.tools','main details.group'])await page.locator(accordion).evaluateAll(els=>els.forEach(el=>el.open=true)).catch(()=>{});
   if(file==='tipagens.html')await page.locator('[data-combat-tab="types"]').click();
   if(file==='formas-especiais.html')await page.locator('.tab[data-tab="ditto"]').click();
   if(file==='quiz.html')await page.locator('.mode').first().click();
   const controls=await page.evaluate(()=>{
    function parse(s){
      const t=s.match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:[, ]+([\d.]+))?\s*\)/);
      return t?[Number(t[1]),Number(t[2]),Number(t[3]),t[4]===undefined?1:Number(t[4])]:null;
    }
    function contrast(f,b){
      const lum=x=>x.slice(0,3).map(y=>y/255).map(y=>y<=.04045?y/12.92:((y+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
      return +((Math.max(lum(f),lum(b))+.05)/(Math.min(lum(f),lum(b))+.05)).toFixed(2);
    }
    function bg(el){
      let e=el;
      for(let i=0;i<15&&e;i++,e=e.parentElement){
        const c=parse(getComputedStyle(e).backgroundColor);
        if(c&&c[3]>=.98)return c;
      }
      return [248,249,251,1];
    }
    function luminance(x){const c=x.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722}
    const els=[...document.querySelectorAll('main button,main [role="button"],main a.cta,main input[type="submit"],main summary,main select')];
    return els.filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.visibility!=='hidden'&&s.display!=='none'&&r.height>0&&r.width>0}).map(e=>{
      const s=getComputedStyle(e),r=e.getBoundingClientRect(),color=parse(s.color),background=bg(e),linear=s.backgroundImage;
      const label=(e.getAttribute('aria-label')||e.textContent||e.getAttribute('title')||'').replace(/\s+/g,' ').trim().slice(0,82);
      return {tag:e.tagName,id:e.id||'',className:String(e.className).slice(0,100),label,bg:background.slice(0,3),fg:color?.slice(0,3),hexBackground:s.backgroundColor,backgroundImage:linear==='none'?null:linear.slice(0,100),
        ratio:color?contrast(color,background):null,dark:luminance(background)<.16,height:Math.round(r.height),width:Math.round(r.width),disabled:e.disabled||e.getAttribute('aria-disabled')==='true',selected:e.classList.contains('active')||e.classList.contains('on')||e.getAttribute('aria-selected')==='true'||e.getAttribute('aria-pressed')==='true',border:s.borderColor,font:s.fontSize
      };
    });
   });
   const flagged=controls.filter(x=>!x.disabled&&(x.dark||(x.ratio!==null&&x.ratio<4.5)||x.height<35));
   results.push({file,viewport:size.id,controls,flagged});
   console.log('CONTROL_AUDIT '+JSON.stringify({file,viewport:size.id,total:controls.length,problems:flagged.length,flagged:flagged.slice(0,35)}));
   if(['index.html','tipagens.html','calculadora.html','evolucoes-especiais.html','formas-especiais.html','efeitos-aventura.html','pokeparadas.html','quiz.html'].includes(file)){
     const target=page.locator('main button').first();
     if(await target.count())await target.scrollIntoViewIfNeeded().catch(()=>{});
     await page.screenshot({path:path.join(folder,size.id+'-'+file+'.jpg'),type:'jpeg',quality:75,animations:'disabled'});
   }
  }catch(e){results.push({file,viewport:size.id,error:String(e.message)});console.log('CONTROL_AUDIT_ERROR '+JSON.stringify({file,viewport:size.id,error:String(e.message).slice(0,300)}));}
  finally{await page.close()}
 }
 await context.close();
}
await browser.close();
fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify(results,null,2));
console.log('CONTROL_SUMMARY '+JSON.stringify({pages:results.length,controls:results.reduce((n,x)=>n+(x.controls?.length||0),0),flagged:results.reduce((n,x)=>n+(x.flagged?.length||0),0),errors:results.filter(x=>x.error).length}));
