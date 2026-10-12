/* Exercita estados interativos e flutuantes nas versões original e 2.0. */
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const OUT='audit-results';
fs.mkdirSync(OUT,{recursive:true});
const variants=[
 {name:'original',url:'http://127.0.0.1:8766/'},
 {name:'atual',url:'http://127.0.0.1:8765/'}
];
const screens=[
 {name:'celular',width:390,height:844},
 {name:'desktop',width:1365,height:850}
];
const records=[],warnings=[],browser=await chromium.launch({headless:true});
async function photo(tab,code){
 await tab.screenshot({path:path.join(OUT,'estado-'+code+'.jpg'),type:'jpeg',quality:72,animations:'disabled'});
}
async function visit(context,v,screen,file,callback){
 const tab=await context.newPage();
 const base={version:v.name,screen:screen.name,file};
 try{
  await tab.goto(v.url+file,{waitUntil:'domcontentloaded',timeout:45000});
  await tab.waitForTimeout(230);
  await callback(tab,base);
 }catch(e){warnings.push({...base,problem:'Interação não concluída',details:String(e.message).slice(0,230)})}
 finally{await tab.close()}
}
function rect(r){if(!r)return null;return {x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height)}}
try{
 for(const v of variants)for(const screen of screens){
  const context=await browser.newContext({viewport:{width:screen.width,height:screen.height},reducedMotion:'reduce',locale:'pt-BR'});
  await context.route(/pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net/,r=>r.abort());
  await visit(context,v,screen,'index.html',async(tab,base)=>{
   const egg=tab.locator('#gnx-egg-placeholder');
   const hasEgg=await egg.count()>0;
   if(hasEgg){
    const originalImage=await egg.locator('img').getAttribute('src');
    const box=await egg.boundingBox();
    const bubble=await egg.locator('[data-lazy-status]').isVisible();
    await photo(tab,v.name+'-'+screen.name+'-ovo-inicial');
    await tab.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight*.55));
    await tab.waitForTimeout(160);
    const after=await egg.boundingBox();
    const floating=(await egg.evaluate(el=>getComputedStyle(el).position))==='fixed';
    const bubbleAfter=await egg.locator('[data-lazy-status]').isVisible();
    records.push({...base,state:'ovo com rolagem',initial:rect(box),after:rect(after),isFixed:floating,bubbleVisible:bubble,bubbleAfterScroll:bubbleAfter,art:originalImage?.slice(0,43)});
    if(floating&&bubbleAfter)warnings.push({...base,problem:'Balão fixo e persistente sobre o conteúdo'});
    await photo(tab,v.name+'-'+screen.name+'-ovo-rolagem');
    await tab.locator('#gnx-egg-placeholder button').first().click({force:true});
    try{
      const widget=tab.locator('go-nexus-cosmic-egg');
      await widget.waitFor({state:'attached',timeout:17000});
      // O ovo ORIGINAL precisa de 3 toques; o carregador automático já deu o primeiro.
      await widget.locator('.egg').click({force:true});
      await widget.locator('.egg').click({force:true});
      await widget.locator('.overlay.open').waitFor({state:'visible',timeout:8000});
      const modal=await widget.locator('.overlay.open').isVisible();
      records.push({...base,state:'abrir experiência do ovo após três toques',modalVisible:modal});
      await photo(tab,v.name+'-'+screen.name+'-ovo-aberto');
      const close=widget.locator('.close');
      if(await close.count()){
        await close.first().click();
        records.push({...base,state:'fechar experiência do ovo',closed:!(await widget.locator('.overlay.open').isVisible())});
      }
    }catch(e){warnings.push({...base,problem:'Ovo não abriu experiência',details:String(e.message).slice(0,180)})}
   }else records.push({...base,state:'ovo',present:false});
   if(screen.name==='celular'){
    const mobile=tab.locator('go-nexus-header').locator('.mobile-bottom');
    records.push({...base,state:'navegação inferior',display:await mobile.evaluate(el=>getComputedStyle(el).display).catch(()=>null)});
    const menu=tab.locator('go-nexus-header').locator('details.toolmenu');
    await menu.locator('summary').click();
    records.push({...base,state:'menu ferramentas',open:await menu.getAttribute('open')!==null});
    await photo(tab,v.name+'-celular-menu-aberto');
   }
  });
  await visit(context,v,screen,'efeitos-aventura.html',async(tab,base)=>{
   const cards=tab.locator('.grid .card');
   const before=await cards.filter({visible:true}).count();
   const filter=tab.locator('.chips [data-f="capture"]');
   await filter.click();
   await tab.waitForTimeout(110);
   const filtered=await cards.filter({visible:true}).count();
   await photo(tab,v.name+'-'+screen.name+'-efeitos-filtrado');
   const details=cards.filter({visible:true}).first().locator('.details');
   await details.click();
   const expanded=await cards.filter({visible:true}).first().evaluate(el=>el.classList.contains('open'));
   records.push({...base,state:'filtro e expansão',initialCards:before,filteredCards:filtered,expanded});
   await photo(tab,v.name+'-'+screen.name+'-efeitos-expandido');
  });
  await visit(context,v,screen,'quiz.html',async(tab,base)=>{
   await tab.locator('.mode').first().click();
   const answers=await tab.locator('#answers button').count();
   records.push({...base,state:'quiz iniciado',answers});
   await photo(tab,v.name+'-'+screen.name+'-quiz-pergunta');
   if(answers){await tab.locator('#answers button').first().click();records.push({...base,state:'quiz respondido',feedback:await tab.locator('#feedback').innerText()});}
  });
  await visit(context,v,screen,'calculadora.html',async(tab,base)=>{
   const initial=await tab.locator('#answer').innerText();
   await tab.locator('#price').fill('1000');
   const updated=await tab.locator('#answer').innerText();
   records.push({...base,state:'calculadora preço',initial:initial.slice(0,110),after:updated.slice(0,110)});
   await photo(tab,v.name+'-'+screen.name+'-calculadora');
  });
  await visit(context,v,screen,'central-max.html',async(tab,base)=>{
   const answer=tab.locator('#maxAnswer');
   await answer.evaluate(el=>{const details=el.closest('details');if(details)details.open=true});
   await tab.locator('.current[data-move="attack"]').selectOption('3');
   await tab.locator('.target[data-move="attack"]').selectOption('1');
   const result=await answer.innerText();
   records.push({...base,state:'Max inválido',result:result.slice(0,240)});
   await photo(tab,v.name+'-'+screen.name+'-max-calculadora');
  });
  await context.close();
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(OUT,'estados-interativos.json'),JSON.stringify({records,warnings},null,2));
const md=['# Estados interativos — original x atual','','Registros de navegação, expansão, filtros, cálculo e experiência cósmica.',''];
for(const x of records)md.push('- '+x.version+' / '+x.screen+' / '+x.file+' / '+x.state+': '+JSON.stringify(x));
md.push('','## Falhas e observações');
for(const x of warnings)md.push('- '+x.version+' / '+x.screen+' / '+x.file+': '+x.problem);
fs.writeFileSync(path.join(OUT,'ESTADOS.md'),md.join('\n')+'\n');
console.log('ESTADOS_RESUMO '+JSON.stringify({records:records.length,warnings:warnings.length}));
for(const x of records.filter(v=>v.state==='ovo com rolagem'||v.state==='abrir experiência do ovo'))console.log('OVO '+JSON.stringify(x));
warnings.slice(0,40).forEach(x=>console.log('ESTADO_ALERTA '+JSON.stringify(x)));
