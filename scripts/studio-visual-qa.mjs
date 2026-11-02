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
   // Product hierarchy contract: visible separation between page, section and card.
   // This checks rendered CSS, not declarations that can be overwritten by legacy rules.
   if(file==='index.html'){
     const layers=await tab.evaluate(()=>{
       const read=s=>getComputedStyle(document.querySelector(s)).backgroundColor;
       const rgb=c=>(c.match(/\d+/g)||[]).slice(0,3).map(Number);
       const delta=(a,b)=>rgb(a).reduce((n,v,i)=>n+Math.abs(v-rgb(b)[i]),0);
       const body=read('body'),section=read('main .gn-section'),card=read('main .gn-section .gn-v2-card');
       return {body,section,card,outerGap:delta(body,section),innerGap:delta(section,card),
        sectionBorder:getComputedStyle(document.querySelector('main .gn-section')).borderColor};
     });
     if(layers.outerGap<18||layers.innerGap<35)
       errors.push('Home surface hierarchy too flat: '+JSON.stringify(layers));
     await tab.locator('main .gn-section').first().scrollIntoViewIfNeeded();
     await tab.screenshot({path:path.join(OUT,s.name+'-home-layered-sections.jpg'),type:'jpeg',quality:82,animations:'disabled'});
     await tab.evaluate(()=>window.scrollTo(0,0));
     console.log('HOME_LAYERS '+JSON.stringify({viewport:s.name,...layers}));
   }
   if(['tipagens.html','evolucoes-especiais.html','poeira-estelar.html'].includes(file)){
     const layers=await tab.evaluate(()=>{
       const hero=document.querySelector('main > section.hero');
       const section=document.querySelector('main > :is(.controls,.route-groups,.combat-panel.active)');
       const child=section?.querySelector('.card,.panel,details.nx-accordion');
       return {heroGradient:hero?getComputedStyle(hero).backgroundImage:'not found',
          outerBackground:section?getComputedStyle(section).backgroundColor:'not found',
          cardBackground:child?getComputedStyle(child).backgroundColor:'not found'};
     });
     if(layers.heroGradient!=='not found'&&!layers.heroGradient.includes('gradient'))
       errors.push('Tool header lacks a distinct light-blue gradient: '+JSON.stringify(layers));
     console.log('TOOL_LAYERS '+JSON.stringify({page:file,viewport:s.name,...layers}));
   }

   const a=await tab.evaluate(()=>{
     function rgba(x){let a=x?.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)/);return a?[Number(a[1]),Number(a[2]),Number(a[3]),a[4]===undefined?1:Number(a[4])]:null;}
     function lum(col){let c=col.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
     function visible(el){if(!el||!el.isConnected)return false;let s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>.08&&r.width>0&&r.height>0;}
     function bgOf(el,forText=false){let p=el,depth=0;while(p&&depth++<16){
       const style=getComputedStyle(p);
       // Um degradê é o fundo VISÍVEL: não atribuir ao texto o fundo claro do body.
       // Sem amostragem dos pixels, o contraste sobre degradê/imagem é inconclusivo;
       // registrar na captura visual em vez de produzir um falso alarme automático.
       if(forText&&style.backgroundImage.includes('gradient('))return null;
       let color=rgba(style.backgroundColor);
       if(color&&color[3]>.93)return color;
       p=p.parentElement;
     }return [248,249,251,1];}
     const failures=[];
     for(const el of document.querySelectorAll('main :is(h1,h2,h3,h4,p,label,button,span,a,li,b,strong,small)')){
       if(!visible(el))continue;
       if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent?.trim().length>=8))continue;
       const s=getComputedStyle(el),f=rgba(s.color),b=bgOf(el,true);
       if(!f||f[3]<.9||!b)continue;
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
   if(file==='tipagens.html'){
     await tab.locator('[data-combat-tab="types"]').click();
     await tab.locator('#attackGrid .type-btn[data-type="poison"]').click();
     const palette=await tab.evaluate(()=>{
       const btn=id=>document.querySelector('#attackGrid .type-btn[data-type="'+id+'"]');
       const style=el=>({bg:getComputedStyle(el).backgroundColor,fg:getComputedStyle(el).color,border:getComputedStyle(el).borderColor});
       const pills=[...document.querySelectorAll('#attackGood .type-badge,#attackBad .type-badge')];
       return {button:style(btn('poison')),fire:style(btn('fire')),water:style(btn('water')),
         pill:pills.map(p=>({text:p.textContent,...style(p)})).slice(0,5)};
     });
     if(palette.button.bg===palette.fire.bg||palette.button.bg===palette.water.bg||palette.fire.bg===palette.water.bg)
       errors.push('Combat type buttons lost their per-type backgrounds: '+JSON.stringify(palette));
     if(palette.pill.some(p=>p.fg==='rgb(255, 255, 255)'))
       errors.push('Type badges have unreadable white text on a light tinted background');
     await tab.locator('#attackGrid').scrollIntoViewIfNeeded();
     await tab.screenshot({path:path.join(OUT,s.name+'-combat-colored-types.jpg'),type:'jpeg',quality:84,animations:'disabled'});
     console.log('TYPE_PALETTE '+JSON.stringify({viewport:s.name,palette}));
   }
   if(file==='poeira-estelar.html'){
     const alignment=await tab.evaluate(()=>{
       const rect=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),right:Math.round(r.right),width:Math.round(r.width)}};
       return {hero:rect(document.querySelector('main > section.hero.wrap')),group:rect(document.querySelector('main > section.wrap')),
          breadcrumb:rect(document.querySelector('main > .gn-breadcrumb')),width:innerWidth};
     });
     if(Math.abs(alignment.hero.x-alignment.group.x)>3||Math.abs(alignment.breadcrumb.x-alignment.group.x)>3)
       errors.push('Stardust hero/breadcrumb misaligned with groups: '+JSON.stringify(alignment));
     if(alignment.hero.x<0||alignment.hero.right>alignment.width+2)
       errors.push('Stardust hero extends outside viewport');
     await tab.screenshot({path:path.join(OUT,s.name+'-stardust-aligned.jpg'),type:'jpeg',quality:84,animations:'disabled'});
     console.log('STARDUST_ALIGNMENT '+JSON.stringify({viewport:s.name,alignment}));
   }
   // Deep visual regression for Evolution routes: old navy image tiles were missed
   // because previous screenshots did not expand and inspect this component.
   if(file==='evolucoes-especiais.html'){
     const routeSection=tab.locator('#grid details.nx-accordion').first();
     await routeSection.evaluate(el=>{el.open=true});
     const routeCard=routeSection.locator('.card').first();
     await routeCard.waitFor({state:'visible',timeout:10000});
     const visual=await routeCard.evaluate(el=>{
       const box=el.querySelector('.pokeart'), img=box.querySelector('img');
       const style=getComputedStyle(box);
       const size=q=>parseFloat(getComputedStyle(el.querySelector(q)).fontSize);
       return {root:parseFloat(getComputedStyle(document.documentElement).fontSize),
         body:parseFloat(getComputedStyle(document.body).fontSize),
         imageBackground:style.backgroundImage,imageColor:style.backgroundColor,
         imageWidth:Math.round(box.getBoundingClientRect().width),
         dexSize:size('.dex'),nameSize:size('.name'),
         costSize:size('.cost'),tagSize:size('.tag'),
         summaryColor:getComputedStyle(document.querySelector('#count strong')).color,
         imgLoaded:!!img&&img.complete&&img.naturalWidth>0};
     });
     const color=visual.imageColor.match(/\d+/g)?.map(Number)||[];
     if(visual.imageBackground!=='none'||color.length<3||color[0]<190||color[1]<190||color[2]<190)
       errors.push('Evolution Pokémon artwork still sits on an old dark tile: '+JSON.stringify(visual));
     if(visual.summaryColor==='rgb(255, 255, 255)') errors.push('Evolution summary count is white on white');
     if(s.width>=1000 && (visual.root<17.5||visual.dexSize<14||visual.costSize<14||visual.tagSize<14||visual.imageWidth<98))
       errors.push('Evolution desktop typography/art dimensions too small: '+JSON.stringify(visual));
     await routeCard.scrollIntoViewIfNeeded();
     await tab.screenshot({path:path.join(OUT,s.name+'-evolution-open-route.jpg'),type:'jpeg',quality:86,animations:'disabled'});
     console.log('EVOLUTION_STYLE '+JSON.stringify({viewport:s.name,visual}));
   }
   if(s.width>=1000){
     const rootSize=await tab.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
     if(rootSize<17.5)errors.push('Desktop font root still too small: '+rootSize+'px');
   }
   if(file==='efeitos-aventura.html'){
     const card=tab.locator('.grid .card').filter({hasText:'Zamazenta'}).first();
     await card.locator('.details').click();
     // The stickers use native lazy loading; allow the browser to finish fetching
     // before treating naturalWidth=0 as a broken resource. Capture failures after timeout.
     await card.locator('.art img').evaluate(async img=>{
       if(img.complete&&img.naturalWidth>0)return;
       img.loading='eager';
       await Promise.race([
         img.decode().catch(()=>null),
         new Promise(resolve=>setTimeout(resolve,6500))
       ]);
     });
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
     if(await egg.count()){
       const widget=tab.locator('go-nexus-cosmic-egg');
       await egg.locator('button').click({force:true});
       // O componente é carregado sob demanda; repetir a ação se a primeira
       // tentativa não anexar o elemento, mantendo falha real após nova tentativa.
       if(!(await widget.waitFor({state:'attached',timeout:12000}).then(()=>true).catch(()=>false))){
         await egg.locator('button').click({force:true});
         await widget.waitFor({state:'attached',timeout:15000});
       }
       await widget.locator('.egg').click({force:true});
       await widget.locator('.egg').click({force:true});
       await widget.locator('.overlay.open').waitFor({state:'visible',timeout:9000});
       await tab.screenshot({path:path.join(OUT,s.name+'-cosmos-open.jpg'),type:'jpeg',quality:70});
     }
   }

   // Screenshot-derived regression cases. The previous QA only inspected top-level
   // cards and therefore missed pale names, dark accordion children, and dialogs.
   if(['tipagens.html','evolucoes-especiais.html','formas-especiais.html','guia-busca.html','calculadora.html','pokeparadas.html','central-mega.html'].includes(file)){
     await tab.evaluate(()=>document.querySelectorAll('main details.nx-accordion').forEach(d=>{d.open=true;}));
     const deep=await tab.evaluate(()=>{
       const page=document.body.dataset.studioPage;
       const watch={
         'tipagens':['.legend .item b','.legend .item small','.quick-type b','.quick-type .line','.meter .stat span'],
         'evolucoes-especiais':['.grid .card .name','.grid .card .cost','.grid .card .reqs li'],
         'formas-especiais':['.grid .card .pname','.grid .card .cost'],
         'guia-busca':['section.max-w-3xl > div.rounded-2xl h2','section.max-w-3xl > div.rounded-2xl p'],
         'calculadora':['.info','.info.warning','.result .hero .answer'],
         'pokeparadas':['.nx-compact-item b'],
         'central-mega':['.event .date']
       };
       const rgb=s=>{let m=s?.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);return m?[+m[1],+m[2],+m[3]]:null};
       const lum=colors=>{let v=colors.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722};
       const backdrop=el=>{let node=el;for(let i=0;node&&i<15;node=node.parentElement,i++){
         const cs=getComputedStyle(node),b=rgb(cs.backgroundColor),a=cs.backgroundColor.match(/[,\s]([\d.]+)\)$/)?.[1];
         if(b&&(cs.backgroundColor.startsWith('rgb(')||a===undefined||+a>.95))return b;
       }return [248,249,251]};
       const failures=[];
       for(const selector of watch[page]||[]){
         const nodes=[...document.querySelectorAll(selector)].slice(0,8);
         for(const node of nodes){let cs=getComputedStyle(node),r=node.getBoundingClientRect();
           if(cs.display==='none'||cs.visibility==='hidden'||r.width<1||r.height<1)continue;
           const fg=rgb(cs.color),bg=backdrop(node);
           if(!fg)continue;
           const ratio=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);
           if(ratio<4.5)failures.push({selector,text:node.textContent.trim().slice(0,36),ratio:+ratio.toFixed(2),fg,bg});
         }
       }
       const layout=document.querySelector('main.wrap.layout');
       if(page==='calculadora'&&layout&&innerWidth>=821){
         const left=layout.querySelector(':scope > section')?.getBoundingClientRect();
         const right=layout.querySelector(':scope > aside')?.getBoundingClientRect();
         const name=layout.querySelector('#name')?.getBoundingClientRect();
         if(left&&right&&left.x>=right.x)failures.push({selector:'main.layout',text:'Form must precede result on desktop'});
         if(name&&name.width<140)failures.push({selector:'#name',text:'Name input crushed',width:name.width});
       }
       return {failures};
     });
     if(deep.failures.length)errors.push('Deep component contrast/layout '+JSON.stringify(deep.failures.slice(0,8)));
     console.log('DEEPQA '+JSON.stringify({page:file,viewport:s.name,failures:deep.failures}));
   }
   if(['central-mega.html','central-max.html','poeira-estelar.html'].includes(file)){
     const dialog=tab.locator('.nx-result-dialog');
     if(await dialog.count()){
       await dialog.evaluate(el=>el.showModal());
       const modal=await dialog.evaluate(el=>({
         title:getComputedStyle(el.querySelector('h2')).color,
         bg:getComputedStyle(el).backgroundColor,
         text:getComputedStyle(el.querySelector('p')).color
       }));
       if(!modal.bg.includes('255, 255, 255')||modal.title.includes('11, 31, 59')&&modal.bg.includes('11, 31, 59')){
         errors.push('Sharing dialog retains legacy dark surface '+JSON.stringify(modal));
       }
       await tab.screenshot({path:path.join(OUT,s.name+'-'+file.replace('.html','')+'-share-modal.jpg'),type:'jpeg',quality:82});
       await dialog.evaluate(el=>el.close());
     }
   }

   // Shared footer already contains policy links; monetization must not append a second set.
   const footer=tab.locator('go-nexus-footer');
   if(await footer.count()){
     const duplicate=await footer.evaluate(el=>el.shadowRoot?.querySelectorAll('.gnx-policy-links').length||0);
     if(duplicate>0)errors.push('Duplicate unstyled policy links injected in shared footer');
     if(file==='formas-especiais.html'||file==='index.html'){
       await footer.scrollIntoViewIfNeeded();
       await tab.screenshot({path:path.join(OUT,s.name+'-'+file.replace('.html','')+'-footer.jpg'),type:'jpeg',quality:78});
     }
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
