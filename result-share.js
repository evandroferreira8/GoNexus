(() => {
  const byId = id => document.getElementById(id);
  const txt = id => byId(id)?.innerText.trim() || '';
  const value = id => byId(id)?.value || '';
  const option = id => byId(id)?.selectedOptions[0]?.textContent || '';
  const fmtNumber = n => Number(n).toLocaleString('pt-BR');
  const section = (label, text) => ({label, text});
  const page = location.pathname.split('/').pop();
  const configs = {
    'tipagens.html': [{after:'pokeSummary', valid:()=>!byId('pokeResult').hidden, data:()=>({title:txt('pokeName'), subtitle:'Central de Combate · Pokémon GO', image:byId('pokeImage').src, sections:[section('Tipos', [...byId('pokeTypes').children].map(e=>e.textContent).join(' / ')),...['pokeDoubleWeak','pokeWeak','pokeResist','pokeStrongResist'].map((id,i)=>section(['Fraqueza ampliada','Fraquezas','Resistências','Resistências fortes'][i],[...byId(id).children].map(e=>e.textContent).join(' · '))),section('Clima favorável',txt('weatherAdvice'))], note:'Análise de tipagem. Golpes, nível e desempenho individual também influenciam a batalha.'})}],
    'calculadora.html': [{after:'explain', valid:()=>currentPrice()>0&&[...document.querySelectorAll('#items .row')].some(r=>Number(r.querySelector('.qty').value)>0), data:()=>{
      const rows=[...document.querySelectorAll('#items .row')].map(r=>({item:catalog.find(c=>c.id===r.querySelector('.sel').value),qty:Math.max(0,parseInt(r.querySelector('.qty').value)||0)})).filter(r=>r.qty);
      return {title:value('name').trim()||'Vale a Caixa?',subtitle:'Comparação de oferta · Pokémon GO',sections:[section('Itens da oferta',rows.map(r=>`${r.qty} × ${r.item.name}${!r.item.packs?' (sem preço individual)':r.item.restricted?' (restrição na loja brasileira)':''}`).join('\n')),section('Preço da oferta',txt('combo')),section('Compra separada',txt('separate')),section('Resultado',txt('answer')),section(txt('savingLabel'),txt('saving')),section('Como comparar',txt('explain'))],note:'Estimativa com os preços de referência da ferramenta. Itens sem preço individual não entram na comparação. Em reais, considera os pacotes de moedas da Web Store; preços e disponibilidade podem mudar.'};
    }}],
    'central-max.html': [{after:'maxAnswer',valid:()=>[...document.querySelectorAll('.current')].every(el=>Number(document.querySelector(`.target[data-move="${el.dataset.move}"]`).value)>=Number(el.value)),data:()=>({title:'Meu plano de Movimentos Max',subtitle:'Central Max · Pokémon GO',sections:[...['attack','guard','spirit'].map((move,i)=>{const current=document.querySelector(`.current[data-move="${move}"]`),target=document.querySelector(`.target[data-move="${move}"]`);return section(['Ataque Max','Guarda Max','Espírito Max'][i],`${current.selectedOptions[0].textContent} → ${target.selectedOptions[0].textContent}`);}),section('Recursos necessários',txt('maxAnswer'))],note:'Custos calculados para os níveis selecionados de um Pokémon, conforme a tabela da ferramenta.'})}],
    'central-mega.html': [
      {after:'megaAnswer',valid:()=>byId('megaHave').validity.valid,data:()=>({title:option('megaSelect').split(' — ')[0],subtitle:'Planejamento de Megaenergia · Pokémon GO',sections:[section('Custo inicial',option('megaSelect')),section('Megaenergia disponível',fmtNumber(value('megaHave')||0)),section('Resultado',txt('megaAnswer'))],note:'Cálculo da primeira Megaevolução. Confira as condições específicas e o custo exibido no jogo.'})},
      {after:'levelAnswer',valid:()=>byId('megaDone').validity.valid,data:()=>({title:'Meu progresso de Meganível',subtitle:'Central Mega · Pokémon GO',sections:[section('Megaevoluções realizadas',fmtNumber(value('megaDone')||0)),section('Próximo passo',txt('levelAnswer'))],note:'O progresso pertence ao Pokémon individual. O Super Nível Máximo tem requisitos adicionais e depende da elegibilidade da Mega.'})}
    ],
    'poeira-estelar.html': [{after:'formula',valid:()=>!!selected,data:()=>({title:selected.name,subtitle:'Poeira Estelar por captura · Pokémon GO',image:selected.img,sections:[section('Poeira Estelar estimada',txt('resultValue').replace('✨','').trim()),section('Valor base',fmtNumber(selected.base)),section('Bônus selecionados',`Clima favorável: ${byId('weather').checked?'sim (+25%)':'não'}\nPedaço de Estrela: ${byId('starPiece').checked?'sim (×1,5)':'não'}\nEvento: ${option('eventBonus')}`),section('Cálculo',txt('formula'))],note:'Estimativa para os bônus selecionados. Confira os bônus ativos no jogo.'})}]
  };
  const entries=configs[page]; if(!entries)return;
  const style=document.createElement('style');
  style.textContent=`.nx-result-share{display:block;width:100%;margin-top:15px;padding:12px 16px;border:1px solid #487398;border-radius:12px;background:#15324c;color:#c9ecff;font:700 .88rem system-ui;cursor:pointer}.nx-result-share:disabled{opacity:.5;cursor:not-allowed}.nx-result-share:hover:not(:disabled){background:#214c6d}.nx-result-share:focus-visible,.nx-result-dialog :focus-visible{outline:3px solid #7dd3fc;outline-offset:3px}.nx-result-dialog{width:min(520px,calc(100% - 24px));max-height:92dvh;overflow:auto;padding:20px;border:1px solid #456086;border-radius:20px;background:#0b1729;color:#f8fafc;font-family:system-ui}.nx-result-dialog::backdrop{background:#020817cc}.nx-result-dialog header{display:flex;align-items:center;justify-content:space-between;gap:10px}.nx-result-dialog h2{margin:0;font-size:1.2rem}.nx-result-dialog img{display:block;width:100%;height:auto;border-radius:12px;margin-top:16px}.nx-result-dialog p{font-size:.85rem;color:#b8c8dc;line-height:1.5}.nx-result-dialog button,.nx-result-dialog a{font:inherit;cursor:pointer}.nx-result-close{border:0;background:transparent;color:#fff;padding:10px}.nx-result-actions{display:flex;gap:10px;flex-wrap:wrap}.nx-result-actions button,.nx-result-actions a{flex:1;padding:12px;border:1px solid #456086;border-radius:10px;background:#17314f;color:#fff;text-align:center;text-decoration:none}.nx-result-actions button{background:#2563eb}.nx-result-dialog [hidden]{display:none!important}`;
  document.head.append(style);
  const dialog=document.createElement('dialog');dialog.className='nx-result-dialog';dialog.setAttribute('aria-labelledby','nx-result-title');
  dialog.innerHTML='<header><h2 id="nx-result-title">Seu card está quase pronto</h2><button type="button" class="nx-result-close" aria-label="Fechar">✕</button></header><img hidden alt="Prévia do resultado"><p role="status" aria-live="polite"></p><div class="nx-result-actions"><button type="button" hidden>Compartilhar</button><a hidden>Baixar imagem</a></div>';
  document.body.append(dialog);
  const status=dialog.querySelector('[role="status"]'),preview=dialog.querySelector('img'),share=dialog.querySelector('.nx-result-actions button'),download=dialog.querySelector('a');
  let token=0,objectURL,file,trigger,snapshot;
  dialog.querySelector('.nx-result-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{token++;trigger?.focus();});
  async function artwork(src){if(!src)return null;return new Promise(resolve=>{const img=new Image();const timer=setTimeout(()=>{img.onload=img.onerror=null;resolve(null);},6000);img.crossOrigin='anonymous';img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);resolve(null);};img.src=src;});}
  async function renderCard(data){
    const art=await artwork(data.image),canvas=document.createElement('canvas');canvas.width=1080;
    const ctx=canvas.getContext('2d');
    const font=(size,weight=500)=>{ctx.font=`${weight} ${size}px system-ui,sans-serif`;};
    function wrap(text,width,size,weight=500){font(size,weight);const result=[];for(const paragraph of String(text).split('\n')){let line='';for(const word of paragraph.split(/\s+/)){// Also wrap unusually long user-entered words.
      for(const part of (ctx.measureText(word).width>width?[...word]:[word])){const next=line?(part===word?line+' '+part:line+part):part;if(line&&ctx.measureText(next).width>width){result.push(line);line=part;}else line=next;}}
      if(line)result.push(line);}return result;}
    const title=wrap(data.title,art?690:952,92,950);
    const blocks=data.sections.filter(s=>s.text).map(s=>({...s,labels:wrap(s.label.toLocaleUpperCase('pt-BR'),888,23,750),lines:wrap(s.text,888,32)}));
    const note=wrap(data.note,952,24);
    const start=260+Math.max(title.length*108,art?210:0)+52;
    const blocksHeight=blocks.reduce((h,b)=>h+40+b.labels.length*31+b.lines.length*44+28,0);
    canvas.height=Math.max(1080,start+blocksHeight+note.length*34+210);
    if(canvas.height>16000)throw new Error('O resultado ficou muito grande. Reduza a quantidade de itens para criar o card.');
    const gradient=ctx.createLinearGradient(0,0,1080,canvas.height);gradient.addColorStop(0,'#122b47');gradient.addColorStop(1,'#07111f');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,canvas.height);
    const stripe=ctx.createLinearGradient(0,0,1080,0);stripe.addColorStop(0,'#38bdf8');stripe.addColorStop(.5,'#8b5cf6');stripe.addColorStop(1,'#ec4899');ctx.fillStyle=stripe;ctx.fillRect(0,0,1080,10);
    const draw=(t,x,y,size,color='#f8fafc',weight=500)=>{font(size,weight);ctx.fillStyle=color;ctx.fillText(t,x,y);};
    ctx.fillStyle='#38bdf8';ctx.fillRect(64,50,188,6);draw('GO NEXUS',64,104,46,'#7dd3fc',950);draw(data.subtitle,64,151,25,'#b8c8dc');
    ctx.fillStyle='#163653';ctx.fillRect(48,184,720,Math.max(126,title.length*108+32));
    draw('POKÉMON ANALISADO',72,220,22,'#7dd3fc',850);
    title.forEach((l,i)=>draw(l,72,312+i*108,92,'#fff',950));
    ctx.fillStyle='#38bdf8';ctx.fillRect(72,330+title.length*108,Math.min(430,ctx.measureText(title[0]||'').width),8);
    if(art)ctx.drawImage(art,816,155,200,200);
    let y=start;
    blocks.forEach(b=>{const height=40+b.labels.length*31+b.lines.length*44;ctx.fillStyle='#142b45';ctx.fillRect(64,y,952,height);let lineY=y+36;b.labels.forEach(l=>{draw(l,90,lineY,23,'#7dd3fc',750);lineY+=31;});lineY+=10;b.lines.forEach(l=>{draw(l,90,lineY,32);lineY+=44;});y+=height+28;});
    note.forEach(l=>{draw(l,64,y+22,24,'#b8c8dc');y+=34;});
    const bottom=canvas.height-138;ctx.fillStyle='#36506c';ctx.fillRect(64,bottom,952,1);draw('Mais guias e ferramentas no GO Nexus',64,bottom+53,30,'#fff',700);draw('evandroferreira8.github.io/GoNexus/',64,bottom+99,29,'#7dd3fc',600);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Não foi possível gerar a imagem. Tente novamente.');
    return {blob,missing:!!data.image&&!art};
  }
  async function openCard(config,button){
    if(!config.valid())return;
    snapshot=config.data();trigger=button;const generation=++token;
    if(objectURL)URL.revokeObjectURL(objectURL);
    preview.hidden=share.hidden=download.hidden=true;file=null;status.textContent='Criando a imagem com os dados desta consulta…';byId('nx-result-title').textContent='Seu card está quase pronto';dialog.showModal();
    try{const result=await renderCard(snapshot);if(generation!==token)return;
      const slug=snapshot.title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,80);
      file=new File([result.blob],`go-nexus-${slug}.png`,{type:'image/png'});objectURL=URL.createObjectURL(result.blob);preview.src=download.href=objectURL;download.download=file.name;preview.alt=snapshot.title+' — '+snapshot.sections.map(s=>s.label+': '+s.text).join('; ');preview.hidden=download.hidden=false;
      share.hidden=!(navigator.share&&navigator.canShare?.({files:[file]}));byId('nx-result-title').textContent='Seu card está pronto';status.textContent=result.missing?'A ilustração não carregou; os dados estão completos. Você pode baixar ou compartilhar a imagem.':share.hidden?'Baixe a imagem e envie no aplicativo de sua preferência.':'Compartilhe no aplicativo de sua preferência ou baixe a imagem.';
    }catch(e){if(generation===token){byId('nx-result-title').textContent='Não foi possível criar o card';status.textContent=e.message||'Feche a janela e tente novamente.';}}
  }
  share.onclick=async()=>{if(!file)return;try{await navigator.share({files:[file],title:snapshot.title+' | GO Nexus',text:'Crie sua consulta no GO Nexus: https://evandroferreira8.github.io/GoNexus/'+page});}catch(e){if(e.name!=='AbortError')status.textContent='Não foi possível compartilhar. Baixe a imagem e envie pelo aplicativo.';}};
  entries.forEach(config=>{const target=byId(config.after);if(!target)return;const button=document.createElement('button');button.type='button';button.className='nx-result-share';button.textContent='Criar card para compartilhar';target.insertAdjacentElement('afterend',button);button.onclick=()=>openCard(config,button);config.button=button;});
  const sync=()=>entries.forEach(c=>{if(c.button){c.button.disabled=!c.valid();c.button.title=c.button.disabled?'Preencha uma consulta válida para criar o card':'';}});
  document.addEventListener('input',()=>queueMicrotask(sync));document.addEventListener('change',()=>queueMicrotask(sync));document.addEventListener('click',()=>queueMicrotask(sync));
  entries.forEach(c=>new MutationObserver(sync).observe(byId(c.after),{childList:true,subtree:true,characterData:true}));sync();
  if(new URLSearchParams(location.search).get('novidade')==='cards'){
    const target=byId(entries[0].after);const details=target.closest('details');if(details)details.open=true;
  }
})();
