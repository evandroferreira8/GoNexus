/* GO Nexus visual/interaction QA — runs in GitHub Actions, no external AI assertions. */
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const OUT='audit-results/studio-rebuild';
fs.mkdirSync(OUT,{recursive:true});
const pages=['index.html','tipagens.html','guia-busca.html','calculadora.html','poeira-estelar.html','central-mega.html','central-max.html','evolucoes-especiais.html','formas-especiais.html','efeitos-aventura.html','pokeparadas.html','quiz.html','anuncie.html','privacidade.html','termos.html'];
const sizes=[{name:'phone360',width:360,height:780},{name:'phone390',width:390,height:844},{name:'desktop',width:1365,height:850}];
const checks=[],browser=await chromium.launch({headless:true});
const url='http://127.0.0.1:8765/';
for(const s of sizes){
 const context=await browser.newContext({viewport:{width:s.width,height:s.height},deviceScaleFactor:1,reducedMotion:'reduce',locale:'pt-BR'});
 await context.route(/pagead2\.googlesyndication\.com|googleads\.g\.doubleclick\.net/,r=>r.abort());
 for(const file of pages){
  const tab=await context.newPage();const errors=[];
  tab.on('pageerror',e=>errors.push(e.message));
  try{
   await tab.goto(url+file,{waitUntil:'domcontentloaded',timeout:40000});
   await tab.waitForTimeout(170);
   const a=await tab.evaluate(()=>{
     function rgba(x){let a=x?.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)/);return a?[Number(a[1]),Number(a[2]),Number(a[3]),a[4]===undefined?1:Number(a[4])]:null;}
     function lum(col){let c=col.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
     function visible(el){if(!el||!el.isConnected)return false;let s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>.08&&r.width>0&&r.height>0;}
     function bgOf(el){let p=el,depth=0;while(p&&depth++<16){let color=rgba(getComputedStyle(p).backgroundColor);if(color&&color[3]>.93)return color;p=p.parentElement;}return [248,249,251,1];}
     const failures=[];
     for(const el of document.querySelectorAll('main :is(h1,h2,h3,h4,p,label,button,span,a,li,b,strong,small)')){
       if(!visible(el))continue;
       if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent?.trim().length>=8))continue;
       const s=getComputedStyle(el),f=rgba(s.color),b=bgOf(el);
       if(!f||f[3]<.9)continue;
       let aa=lum(f),bb=lum(b),ratio=(Math.max(aa,bb)+.05)/(Math.min(aa,bb)+.05);
       if(ratio<3.3&&failures.length<30){
         failures.push({ratio:Number(ratio.toFixed(2)),tag:el.tagName,cl:String(el.className).slice(0,90),text:el.textContent.trim().slice(0,75),fg:s.color,bg:JSON.stringify(b.slice(0,3))});
       }
     }
     const dark=[];
     for(const el of document.querySelectorAll('main :is(.panel,.card,.fact,.calc,.calc-line,.search-builder,.searchbox,.info,.feedback,.quiz,.mode,.core article,.compare article,.flow>div)')){
       if(!visible(el))continue;
       const b=bgOf(el),L=lum(b);if(L<.24&&dark.length<20)dark.push({tag:el.tagName,cl:String(el.className).slice(0,90),color:b.slice(0,3)});
     }
     const egg=document.getElementById('gnx-egg-placeholder');
     const shadow=document.querySelector('go-nexus-cosmic-egg')?.shadowRoot;
     const floatEgg=shadow?.querySelector('.egg-dock');
     const bubble=egg?.querySelector('[data-lazy-status]');
     const be=shadow?.querySelector('.egg-hint');
     const bottom=document.querySelector('go-nexus-header')?.shadowRoot?.querySelector('.mobile-bottom');
     const eggRect=egg?.getBoundingClientRect()??floatEgg?.getBoundingClientRect();
     const navRect=bottom?.getBoundingClientRect();
     const overlap=eggRect&&navRect?Math.max(0,Math.min(eggRect.right,navRect.right)-Math.max(eggRect.left,navRect.left))*Math.max(0,Math.min(eggRect.bottom,navRect.bottom)-Math.max(eggRect.top,navRect.top)):0;
     const title=document.querySelector('main>.hero h1');
     const hero=document.querySelector('main>.hero');
     return {theme:document.documentElement.dataset.theme,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,
       failures,dark,heroBackground:hero?getComputedStyle(hero).backgroundColor:null,
       titleColor:title?getComputedStyle(title).color:null,
       eggPresent:!!egg||!!floatEgg,eggSource:egg?.querySelector('img')?.getAttribute('src')||'',
       visibleBubble:!!bubble&&visible(bubble)&&bubble.getBoundingClientRect().width>15,cosmosBubble:!!be&&visible(be),
       eggOverNav:Math.round(overlap),visibleSponsors:[...document.querySelectorAll('.gnx-ad-wrap')].filter(visible).length,
       lightSurfaceCount:[...document.querySelectorAll('main .card,main .panel')].filter(visible).length};
   });
   const res={page:file,viewport:s.name,...a,errors};
   checks.push(res);
   await tab.screenshot({path:path.join(OUT,s.name+'-'+file.replace('.html','')+'-top.jpg'),type:'jpeg',quality:73,animations:'disabled'});
   if(file==='formas-especiais.html'){
     const rules=tab.locator('main .rules .rule');
     if(await rules.count()){
       await rules.first().scrollIntoViewIfNeeded();
       const samples=await rules.evaluateAll(nodes=>nodes.slice(0,3).map(el=>({
         title:el.querySelector('strong')?.textContent,
         bg:getComputedStyle(el).backgroundColor,
         titleColor:getComputedStyle(el.querySelector('strong')).color,
         bodyColor:getComputedStyle(el.querySelector('p')).color
       })));
       if(samples.some(x=>/rgb\\((?:10|7), (?:21|17), (?:38|31)\\)/.test(x.bg))){
         errors.push('Legacy dark Fusion rule panels with dark typography: '+JSON.stringify(samples));
       }
       await tab.screenshot({path:path.join(OUT,s.name+'-forms-rules.jpg'),type:'jpeg',quality:82,animations:'disabled'});
     }
   }
   if(file==='calculadora.html'){
     await tab.locator('.saving').scrollIntoViewIfNeeded();
     const surface=await tab.locator('.saving').evaluate(el=>({
       bg:getComputedStyle(el).backgroundColor,
       label:getComputedStyle(el.querySelector('span')).color,
       amount:getComputedStyle(el.querySelector('strong')).color,
       explain:getComputedStyle(document.querySelector('#explain')).color
     }));
     if(/rgb\\(16, 45, 44\\)/.test(surface.bg)||/rgb\\(219, 228, 242\\)/.test(surface.explain)){
       errors.push('Old dark saving panel/light-on-light explanation: '+JSON.stringify(surface));
     }
     await tab.screenshot({path:path.join(OUT,s.name+'-calculator-result.jpg'),type:'jpeg',quality:82,animations:'disabled'});
     const feedback=tab.locator('.feedbackbox');
     await feedback.scrollIntoViewIfNeeded();
     const feedbackPanel=await feedback.evaluate(el=>({
       bg:getComputedStyle(el).backgroundColor,
       gradient:getComputedStyle(el).backgroundImage,
       title:getComputedStyle(el.querySelector('h2')).color,
       caption:getComputedStyle(el.querySelector('p')).color
     }));
     if(feedbackPanel.gradient!=='none'||/rgb\\(20, 32, 57\\)/.test(feedbackPanel.bg)){
       errors.push('Dark feedback panel still present in light theme: '+JSON.stringify(feedbackPanel));
     }
     await tab.screenshot({path:path.join(OUT,s.name+'-calculator-feedback.jpg'),type:'jpeg',quality:82,animations:'disabled'});
   }
   if(file==='efeitos-aventura.html'){
     const card=tab.locator('.grid .card').filter({hasText:'Zamazenta'}).first();
     await card.locator('.details').click();
     const panel=await card.locator('.stats > div').first().evaluate(el=>{
       const value=el.querySelector('strong'),label=el.querySelector('small');
       const bg=getComputedStyle(el).backgroundColor;
       const fg=getComputedStyle(value).color;
       const labelFg=getComputedStyle(label).color;
       const isOpen=getComputedStyle(el).display!=='none'&&el.getBoundingClientRect().height>0;
       return {bg,fg,labelFg,isOpen};
     });
     if(!panel.isOpen||/rgb\\(15, 23, 42\\)/.test(panel.bg)||panel.bg===panel.fg){
       errors.push('Cartão de efeito: painel expandido mantém fundo escuro ou texto ilegível '+JSON.stringify(panel));
     }
     const layout=await card.evaluate(el=>{
       const box=node=>{let r=node.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};
       const img=el.querySelector('.art img');
       return {card:box(el),art:box(el.querySelector('.art')),image:box(img),imageNatural:[img.naturalWidth,img.naturalHeight],details:box(el.querySelector('.details')),stats:box(el.querySelector('.stats'))};
     });
     if(s.width<=680&&layout.details.w<layout.card.w-45)errors.push('Disclosure still confined to a narrow column: '+JSON.stringify(layout));
     if(layout.imageNatural[0]===0)errors.push('Card sticker failed to load: '+JSON.stringify(layout));
     console.log('EFFECT_CARD_LAYOUT '+JSON.stringify({viewport:s.name,layout}));
     await card.scrollIntoViewIfNeeded();
     await tab.screenshot({path:path.join(OUT,s.name+'-efeitos-zamazenta-expanded.jpg'),type:'jpeg',quality:83,animations:'disabled'});
   }
   // Every page receives a mid-page screenshot; top-only audits missed states.
   if(file!=='index.html'&&file!=='efeitos-aventura.html'){
     await tab.evaluate(()=>window.scrollTo(0,Math.round(document.documentElement.scrollHeight*.52)));
     await tab.waitForTimeout(90);
     await tab.screenshot({path:path.join(OUT,s.name+'-'+file.replace('.html','')+'-middle.jpg'),type:'jpeg',quality:72,animations:'disabled'});
   }
   if(file==='index.html'||file==='efeitos-aventura.html'){
     await tab.evaluate(()=>window.scrollTo(0,Math.max(0,document.documentElement.scrollHeight*.48)));
     await tab.waitForTimeout(100);
     await tab.screenshot({path:path.join(OUT,s.name+'-'+file.replace('.html','')+'-scroll.jpg'),type:'jpeg',quality:73,animations:'disabled'});
   }
   if(file==='index.html'){
     if(a.eggSource&&!a.eggSource.includes('egg-original.png'))errors.push('Imagem do ovo original não utilizada');
     const egg=tab.locator('#gnx-egg-placeholder');
     if(await egg.count()){await egg.locator('button').click({force:true});await tab.locator('go-nexus-cosmic-egg').waitFor({state:'attached',timeout:12000});const widget=tab.locator('go-nexus-cosmic-egg');await widget.locator('.egg').click({force:true});await widget.locator('.egg').click({force:true});await widget.locator('.overlay.open').waitFor({state:'visible',timeout:6000});await tab.screenshot({path:path.join(OUT,s.name+'-cosmos-open.jpg'),type:'jpeg',quality:70});}
   }
   console.log('PAGEQA '+JSON.stringify({page:file,viewport:s.name,lowContrast:a.failures.length,samples:a.failures.slice(0,7),dark:a.dark.length,darkExamples:a.dark.slice(0,5),eggOverlap:a.eggOverNav,eggBubble:a.visibleBubble||a.cosmosBubble,overflow:Math.max(0,a.scrollWidth-a.viewport),errors:errors.slice(0,3)}));
  }catch(e){checks.push({page:file,viewport:s.name,crash:String(e.message)});console.log('PAGEQA_FAIL '+JSON.stringify({page:file,viewport:s.name,error:String(e.message).slice(0,420)}));}
  finally{await tab.close();}
 }
 await context.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT,'metrics.json'),JSON.stringify({checks},null,2));
const critical=checks.filter(x=>x.crash||x.errors?.length||x.eggOverNav>0||x.visibleBubble||x.cosmosBubble||x.scrollWidth-x.viewport>2||x.dark.length>0||x.failures.length>0);
console.log('VISUAL_QA_SUMMARY '+JSON.stringify({scanned:checks.length,critical:critical.length,criticalSamples:critical.slice(0,15).map(x=>({page:x.page,viewport:x.viewport,crash:x.crash,errors:x.errors,lowContrast:x.failures?.length,dark:x.dark?.length,overflow:x.scrollWidth-x.viewport}))}));
if(critical.length)process.exitCode=1;
