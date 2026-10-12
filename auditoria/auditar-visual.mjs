/* Comparação reproduzível: versão original vs. atual. Não altera o site. */
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT='audit-results';
fs.mkdirSync(OUT,{recursive:true});
const versions=[
 {key:'original',url:'http://127.0.0.1:8766/'},
 {key:'atual',url:'http://127.0.0.1:8765/'}
];
const pages=[
 'index.html','tipagens.html','guia-busca.html','calculadora.html',
 'poeira-estelar.html','central-mega.html','central-max.html',
 'evolucoes-especiais.html','formas-especiais.html',
 'efeitos-aventura.html','pokeparadas.html','quiz.html',
 'anuncie.html','privacidade.html','termos.html'
];
const viewports=[
 {key:'celular360',width:360,height:780},
 {key:'celular390',width:390,height:844},
 {key:'desktop',width:1365,height:850}
];
const samples=[],issues=[];
const browser=await chromium.launch({headless:true});
function overlap(a,b){
 if(!a||!b)return 0;
 return Math.round(Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*
                   Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)));
}
try{
 for(const v of versions){
  for(const vp of viewports){
   const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1,reducedMotion:'reduce',locale:'pt-BR'});
   await context.route(/pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net/,route=>route.abort());
   for(const file of pages){
    const tab=await context.newPage();
    const jsErrors=[];
    tab.on('pageerror',error=>jsErrors.push(error.message));
    try{
     const response=await tab.goto(v.url+file,{waitUntil:'domcontentloaded',timeout:45000});
     await tab.waitForTimeout(180);
     const measured=await tab.evaluate(()=>{
      function rect(el){if(!el)return null;const a=el.getBoundingClientRect();return {left:a.left,top:a.top,right:a.right,bottom:a.bottom,width:a.width,height:a.height}}
      function visible(el){return !!el && getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0}
      const hero=document.querySelector('main .hero'), title=hero?.querySelector('h1');
      const egg=document.getElementById('gnx-egg-placeholder');
      const bubble=egg?.querySelector('[data-lazy-status]')?.parentElement;
      const mobileNav=document.querySelector('go-nexus-header')?.shadowRoot?.querySelector('.mobile-bottom');
      const sponsors=[...document.querySelectorAll('.gnx-ad-wrap')];
      return {
       title:document.title,
       docWidth:document.documentElement.scrollWidth,screenWidth:window.innerWidth,
       heroBg:hero?getComputedStyle(hero).backgroundColor:null,
       heroImage:hero?getComputedStyle(hero).backgroundImage:null,
       heroTitleColor:title?getComputedStyle(title).color:null,
       heroTitle:title?.textContent?.trim()?.slice(0,100)||null,
       heroRect:rect(hero),titleRect:rect(title),eggRect:rect(egg),
       bubbleRect:rect(bubble),mobileNavRect:rect(mobileNav),
       eggImage:egg?.querySelector('img')?.src?.slice(0,70)||null,
       bubbleVisible:visible(bubble),eggVisible:visible(egg),
       sponsorSlots:sponsors.length,visibleSponsorSlots:sponsors.filter(visible).length,
       toolCards:document.querySelectorAll('.gn-v2-card').length,
       bodyFont:getComputedStyle(document.body).fontFamily
      };
     });
     const info={version:v.key,viewport:vp.key,file,http:response?.status(),...measured,jsErrors};
     info.horizontalOverflow=Math.max(0,measured.docWidth-measured.screenWidth);
     info.eggOverNav=overlap(measured.eggRect,measured.mobileNavRect);
     info.eggOverTitle=overlap(measured.eggRect,measured.titleRect);
     info.bubbleOverTitle=overlap(measured.bubbleRect,measured.titleRect);
     samples.push(info);
     if(jsErrors.length)issues.push({file,version:v.key,viewport:vp.key,type:'Erro JavaScript',details:jsErrors.slice(0,2)});
     if(info.horizontalOverflow>2)issues.push({file,version:v.key,viewport:vp.key,type:'Rolagem horizontal',details:Math.round(info.horizontalOverflow)});
     if(info.eggOverNav>0)issues.push({file,version:v.key,viewport:vp.key,type:'Ovo sobre navegação',details:Math.round(info.eggOverNav)});
     if(info.visibleSponsorSlots>0)issues.push({file,version:v.key,viewport:vp.key,type:'Banner interno invasivo',details:info.visibleSponsorSlots});
     const capture=vp.key==='celular390'||(vp.key==='desktop'&&['index.html','efeitos-aventura.html','tipagens.html','central-max.html','quiz.html'].includes(file));
     if(capture){
      const prefix=path.join(OUT,v.key+'-'+vp.key+'-'+file.replace('.html',''));
      await tab.screenshot({path:prefix+'-topo.jpg',type:'jpeg',quality:75,animations:'disabled'});
      if(['index.html','efeitos-aventura.html'].includes(file)){
       await tab.evaluate(()=>window.scrollTo(0,Math.max(0,document.documentElement.scrollHeight*0.5)));
       await tab.waitForTimeout(90);
       await tab.screenshot({path:prefix+'-rolagem.jpg',type:'jpeg',quality:75,animations:'disabled'});
      }
     }
    }catch(error){
     issues.push({file,version:v.key,viewport:vp.key,type:'Falha na auditoria',details:String(error.message).slice(0,280)});
    }finally{await tab.close()}
   }
   await context.close();
  }
 }
}finally{await browser.close()}

const comparison=[];
for(const file of pages){
 const before=samples.find(s=>s.file===file&&s.viewport==='celular390'&&s.version==='original');
 const after=samples.find(s=>s.file===file&&s.viewport==='celular390'&&s.version==='atual');
 if(before&&after)comparison.push({
  file,
  before:{heroBg:before.heroBg,heroImage:before.heroImage,sponsored:before.visibleSponsorSlots,overflow:before.horizontalOverflow,egg:before.eggImage},
  after:{heroBg:after.heroBg,heroImage:after.heroImage,sponsored:after.visibleSponsorSlots,overflow:after.horizontalOverflow,egg:after.eggImage}
 });
}
const data={baseline:'676614b53a49ca825e61cbdec35f53a8c00584ad',current:'branch de auditoria',samples,issues,comparison};
fs.writeFileSync(path.join(OUT,'dados.json'),JSON.stringify(data,null,2));
const lines=[
 '# Auditoria visual: versão original versus atual',
 '',
 'Comparação de 15 páginas, 3 tamanhos de tela e 2 versões. Fotos do topo e de rolagem nos arquivos anexos.',
 '',
 '| Página | Fundo antes / depois | Banners antes / depois | Excesso horizontal antes / depois |',
 '|---|---|---|---|',
 ...comparison.map(x=>'| '+x.file+' | '+x.before.heroBg+' / '+x.after.heroBg+' | '+x.before.sponsored+' / '+x.after.sponsored+' | '+x.before.overflow+' / '+x.after.overflow+' |'),
 '',
 '## Ocorrências',
 ...issues.map(x=>'- '+x.version+' / '+x.viewport+' / '+x.file+': '+x.type+' '+JSON.stringify(x.details)),
 '',
 '## Conferência visual obrigatória',
 'Comparar topo e rolagem: legibilidade e contrastes, localização do ovo e balão, navegação, cards, botões e patrocínio.',
 'Conferir estados: menu aberto, filtros, calculadoras, quiz, modal cósmico, botões e campos focados.',
 'Divergência de pixels entre identidades diferentes não significa necessariamente regressão.',
 'A aprovação final exige inspeção contextual das imagens e preservação funcional.'
];
fs.writeFileSync(path.join(OUT,'RELATORIO.md'),lines.join('\n')+'\n');
console.log('AUDITORIA '+JSON.stringify({files:pages.length,viewports:viewports.length,versions:versions.length,records:samples.length,issueCount:issues.length}));
comparison.forEach(row=>console.log('COMPARACAO '+JSON.stringify(row)));
issues.slice(0,30).forEach(row=>console.log('OCORRENCIA '+JSON.stringify(row)));
