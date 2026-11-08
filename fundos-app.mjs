import {STORAGE_KEY,BACKUP_KEY,MAX_FILE_SIZE,emptyCollection,parseCollection,validateCollection,readCollection,saveCollection,mergeCollections,progress,filterItems,released,exportCollection,encodeShare,decodeShare,localImage} from './fundos-core.mjs?v=20261108c';
const $=id=>document.getElementById(id), categories={special:'Especial',location:'Localização'};
const mobile=matchMedia('(max-width:600px)');
const pageSize=()=>mobile.matches?8:20;
let catalog, collection=emptyCollection(), shared=location.hash.startsWith('#colecao='), locked=false, memoryOnly=false, page=1, pendingImport, toastTimer;
const filters={query:'',category:'',year:'',event:'',status:'released',ownership:'',sort:'newest'};
const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hue=item=>[...item.id].reduce((n,c)=>(n*31+c.charCodeAt(0))%360,0);
const statusLabel=item=>released(item)?'Lançado':item.status==='announced'?'Anunciado':'A confirmar';
const dateLabel=item=>item.releaseDate?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(item.releaseDate+'T12:00:00Z')):item.year?`${item.year} · data não confirmada`:'Data não confirmada';
function art(item,button=false){const image=localImage(item.image);return `<${button?'button type="button"':'div'} class="bg-art ${item.category}${image?' has-image':''}" style="--hue:${hue(item)};--art-ratio:${image?`${image.width}/${image.height}`:1}" ${button?`data-detail="${escape(item.id)}" aria-label="Ver detalhes de ${escape(item.name)}"`:'aria-hidden="true"'}>${image?`<img src="${escape(button?image.thumbnail:image.src)}" ${button?`srcset="${escape(image.thumbnail)} ${image.thumbnailWidth||200}w, ${escape(image.src)} ${image.width||512}w" sizes="(max-width:600px) 44vw, 260px"`:''} width="${image.width||512}" height="${image.height||512}" alt="" loading="lazy" decoding="async">`:''}<span class="bg-badge">${categories[item.category]}${released(item)?'':` · ${statusLabel(item)}`}</span><span class="bg-art-symbol">${item.category==='special'?'✦':'◎'}</span><span class="bg-art-label">Imagem ainda não disponível</span></${button?'button':'div'}>`;}
function toast(message){$('bg-toast').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('bg-toast').textContent='',5000);}
function storageWarning(message){$('bg-storage-warning').hidden=false;$('bg-storage-warning').textContent=message;}
function fresh(){
  if(shared||locked||memoryOnly)return collection;
  try{return readCollection(localStorage);}catch{locked=true;storageWarning('Os dados salvos não puderam ser lidos. Eles foram preservados. Exporte uma cópia de segurança ou restaure um backup antes de continuar.');return collection;}
}
function persist(next,{backup=false,recovery=false}={}){
  if(shared || (locked&&!recovery))return false;
  try{collection=saveCollection(localStorage,next,{backup});locked=false;memoryOnly=false;$('bg-storage-warning').hidden=true;return true;}
  catch{
    // A failed import must keep the previous in-memory collection intact.
    if(backup||recovery){storageWarning('Não foi possível salvar a restauração neste navegador. Nenhuma importação foi aplicada. Exporte sua coleção e tente liberar espaço.');return false;}
    collection=validateCollection(next);memoryOnly=true;storageWarning('O navegador bloqueou o salvamento. As alterações estão apenas nesta aba: exporte o JSON antes de fechar.');return true;
  }
}
function renderProgress(){
  const p=progress(catalog.items,collection.obtained);
  $('bg-percent').textContent=p.percent.toLocaleString('pt-BR')+'%';$('bg-ring').style.setProperty('--completion',p.percent+'%');
  for(const key of ['obtained','total','remaining'])$('bg-'+key).textContent=p[key];
  $('bg-category-progress').innerHTML=Object.entries(p.categories).map(([key,value])=>`<div><div class="bg-category-line"><span>${key==='special'?'✦ Especiais':'◎ Localização'}</span><b>${value.obtained} / ${value.total}</b></div><progress max="${value.total||1}" value="${value.obtained}" aria-label="${categories[key]}: ${value.obtained} de ${value.total}"></progress></div>`).join('');
}
function render(){
  renderProgress();
  const matches=filterItems(catalog.items,filters,collection.obtained), size=pageSize(), pages=Math.max(1,Math.ceil(matches.length/size));
  page=Math.min(page,pages);
  const owned=new Set(collection.obtained);
  $('bg-grid').innerHTML=matches.slice((page-1)*size,page*size).map(item=>{
    const checked=owned.has(item.id), available=released(item);
    return `<article class="bg-card${checked?' is-owned':''}">${art(item,true)}<div class="bg-card-body"><div class="bg-card-heading"><h2>${escape(item.name)}</h2><span class="bg-card-year">${item.year||'—'}</span></div><p class="bg-card-event">${escape(item.event)}</p><div class="bg-card-actions"><button class="bg-button bg-obtain" data-obtain="${escape(item.id)}" aria-pressed="${checked}" aria-label="${checked?'Desmarcar':'Marcar como obtido'}: ${escape(item.name)}" ${shared||locked||!available?'disabled':''}>${checked?'✓ Obtido':available?'＋ Obter':statusLabel(item)}</button><button class="bg-button bg-info" data-detail="${escape(item.id)}" aria-label="Detalhes: ${escape(item.name)}">↗</button></div></div></article>`;
  }).join('');
  $('bg-grid').setAttribute('aria-busy','false');$('bg-empty').hidden=!!matches.length;
  $('bg-result-count').textContent=`${matches.length} fundo${matches.length===1?'':'s'}`;
  $('bg-pagination').hidden=pages===1;$('bg-page-input').value=String(page);$('bg-page-input').max=String(pages);$('bg-page-total').textContent=`/ ${pages}`;$('bg-prev').disabled=page===1;$('bg-next').disabled=page===pages;
  document.querySelectorAll('[data-ownership]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.ownership===filters.ownership)));
  const count=['category','year','event','ownership'].filter(key=>filters[key]).length+(filters.status!=='released'?1:0);
  $('bg-filter-count').textContent=count?`(${count})`:'';
  $('bg-restore').disabled=shared;
}
function detail(id){
  const item=catalog.items.find(item=>item.id===id);if(!item)return;
  $('bg-detail-content').innerHTML=`<span class="bg-eyebrow">${categories[item.category]} / ${statusLabel(item)}</span><h2 id="bg-detail-title">${escape(item.name)}</h2>${art(item)}<p><strong>${escape(item.event)}</strong><br>${dateLabel(item)}</p><p>${escape(item.availability||'Consulte a fonte do evento para os requisitos de obtenção.')}</p><h3>Pokémon associados · exemplos</h3><div class="bg-pokemon-list">${item.pokemon.length?item.pokemon.map(name=>`<span>${escape(name)}</span>`).join(''):'<p>Lista ainda não confirmada.</p>'}</div><p>A lista de Pokémon é exemplificativa. Uma marcação por fundo, mesmo que você o tenha em mais de um Pokémon.</p><h3>Fontes e identificação</h3><ul class="bg-sources">${item.sources.filter(url=>/^https:\/\//.test(url)).map((url,i)=>`<li><a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(new URL(url).hostname)} · fonte ${i+1} ↗</a></li>`).join('')}</ul><p>${localImage(item.image)?escape(item.image.attribution||'Imagem do jogo; origem registrada, autorização pendente.'):'Ilustração GO Nexus; não é uma reprodução do fundo do jogo.'}</p>`;
  $('bg-detail').showModal();
}
function resetFilters(){Object.assign(filters,{query:'',category:'',year:'',event:'',status:'released',ownership:'',sort:'newest'});$('bg-search').value='';for(const key of ['category','year','event','sort'])$('bg-'+key).value=filters[key];$('bg-status-filter').value='released';page=1;render();}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function openImport(incoming,restore=false){pendingImport=incoming;$('bg-import-title').textContent=restore?'Restaurar backup':'Importar coleção';const unknown=incoming.obtained.filter(id=>!catalog.items.some(item=>item.id===id)).length;$('bg-import-summary').textContent=`${incoming.obtained.length} marcações encontradas.${unknown?` ${unknown} ainda não estão neste catálogo e serão preservadas.`:''}`;$('bg-import-message').textContent='';$('bg-replace-confirm').checked=false;$('bg-replace').disabled=true;$('bg-import-dialog').showModal();}
function applyImport(replace){
  const current=fresh();if(locked&&!replace){$('bg-import-message').textContent='Os dados atuais não podem ser lidos. Exporte a cópia de segurança e use a substituição explícita para recuperar a coleção.';return;}
  const next=replace?pendingImport:mergeCollections(current,pendingImport);
  if(persist(next,{backup:true,recovery:true})){$('bg-import-dialog').close();render();toast('Coleção salva. A versão anterior está no backup local.');}
  else $('bg-import-message').textContent='A importação não foi salva. Confira o aviso de armazenamento e tente novamente.';
}
const shareArtworkCache=new Map();
function shareArtwork(item){
  const art=localImage(item.image);
  if(!art)return Promise.resolve(null);
  if(!shareArtworkCache.has(art.thumbnail)){
    shareArtworkCache.set(art.thumbnail,new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>resolve(null);
      img.src=art.thumbnail;
    }));
  }
  return shareArtworkCache.get(art.thumbnail);
}
async function drawShareThumbs(ctx,obtained){
  const images=await Promise.all(obtained.slice(0,6).map(shareArtwork));
  images.forEach((img,i)=>{
    const x=75+(i%2)*480,y=852+Math.floor(i/2)*90,w=88,h=72;
    ctx.save();
    ctx.fillStyle='#102e53';ctx.fillRect(x,y,w,h);
    if(img){
      const scale=Math.min(w/img.width,h/img.height);
      ctx.drawImage(img,x+(w-img.width*scale)/2,y+(h-img.height*scale)/2,img.width*scale,img.height*scale);
    }else{
      ctx.fillStyle='#f8d777';ctx.font='bold 34px Arial, sans-serif';ctx.fillText('✦',x+30,y+48);
    }
    ctx.restore();
  });
}
async function renderShare(){
  const canvas=$('bg-share-canvas'),ctx=canvas.getContext('2d'),p=progress(catalog.items,collection.obtained),name=$('bg-trainer').value.trim();
  const gradient=ctx.createLinearGradient(0,0,1080,1350);gradient.addColorStop(0,'#102c53');gradient.addColorStop(1,'#1c4b8d');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle='#ffffff10';ctx.lineWidth=2;for(let r=190;r<800;r+=90){ctx.beginPath();ctx.arc(960,50,r,0,Math.PI*2);ctx.stroke();}
  const text=(value,x,y,size,color='#fff',weight=600)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillText(value,x,y);};
  const fit=(value,x,y,size,max,color='#fff')=>{ctx.font=`600 ${size}px Arial, sans-serif`;while(ctx.measureText(value).width>max&&size>12){size--;ctx.font=`600 ${size}px Arial, sans-serif`;}text(value,x,y,size,color);};
  text('◎  GO NEXUS',70,100,32,'#ffcf43',800);text('COLEÇÃO DE FUNDOS',70,173,20,'#bdd5fa');
  fit(name?`O álbum de ${name}`:'Cada fundo, uma história.',70,247,45,940);
  text(String(p.obtained),70,425,150,'#fff',800);text(`DE ${p.total} FUNDOS`,76,475,25,'#c7ddfa');
  ctx.lineWidth=20;ctx.strokeStyle='#ffffff20';ctx.beginPath();ctx.arc(830,376,105,0,Math.PI*2);ctx.stroke();if(p.percent){ctx.strokeStyle='#ffcf43';ctx.beginPath();ctx.arc(830,376,105,-Math.PI/2,-Math.PI/2+2*Math.PI*p.percent/100);ctx.stroke();}
  ctx.textAlign='center';text(p.percent+'%',830,393,49,'#fff',800);ctx.textAlign='left';
  let y=560;for(const [key,value]of Object.entries(p.categories)){ctx.fillStyle='#ffffff10';ctx.fillRect(70,y,940,86);text(key==='special'?'✦  Especiais':'◎  Localização',96,y+53,25);text(`${value.obtained} / ${value.total}`,795,y+53,25,'#ffcf43');y+=102;}
  text('MEMÓRIAS JÁ COLECIONADAS',70,815,20,'#bdd5fa');
  const obtained=catalog.items.filter(item=>released(item)&&collection.obtained.includes(item.id));
  obtained.slice(0,6).forEach((item,i)=>{const x=70+(i%2)*480,y=850+Math.floor(i/2)*90;ctx.fillStyle='#ffffff12';ctx.fillRect(x,y,460,76);ctx.fillStyle=`hsl(${hue(item)},60%,72%)`;ctx.fillRect(x,y,5,76);fit(item.name,x+112,y+32,19,340);text(`${categories[item.category]} · ${item.year||'—'}`,x+112,y+57,15,'#bfd5f4');});
  if(!obtained.length){text('Meu próximo fundo será o primeiro.',70,904,28);text('Uma nova coleção começa aqui.',70,950,23,'#bdd5fa');}
  if(obtained.length>6)text(`+ ${obtained.length-6} fundos no meu álbum`,70,1160,21,'#ffcf43');
  await drawShareThumbs(ctx,obtained);
  text('Explore. Colecione. Compartilhe.',70,1240,29);text(`Catálogo ${catalog.updatedAt} · gonexus · sem cadastro`,70,1290,17,'#bdd5fa');
}
function imageBlob(){return new Promise((resolve,reject)=>$('bg-share-canvas').toBlob(blob=>blob?resolve(blob):reject(new Error('Não foi possível gerar a imagem.')),'image/png'));}
async function init(){
  if(shared){$('bg-shared').hidden=false;$('bg-local-actions').hidden=true;$('bg-save-note').textContent='Visualização compartilhada · suas marcações não serão alteradas.';$('bg-share').textContent='Compartilhar esta coleção';$('bg-collection-label').textContent='COLEÇÃO COMPARTILHADA';try{collection=decodeShare(location.hash);$('bg-shared-title').textContent=collection.trainer?`Coleção de ${collection.trainer}`:'Coleção compartilhada';}catch(error){locked=true;storageWarning(error.message);$('bg-grid').setAttribute('aria-busy','false');$('bg-result-count').textContent='Link inválido';return;}}
  else{try{collection=readCollection(localStorage);}catch{locked=true;storageWarning('Não foi possível ler os dados locais. As marcações existentes foram preservadas. Você pode exportar uma cópia de segurança, importar um arquivo válido ou restaurar o backup.');}}
  const response=await fetch('fundos-catalogo.json');if(!response.ok)throw new Error('Catálogo indisponível. Recarregue a página para tentar novamente.');
  catalog=await response.json();if(catalog.schemaVersion!==1||!Array.isArray(catalog.items)||!catalog.items.length)throw new Error('Catálogo inválido. Suas marcações permanecem salvas.');
  $('bg-coverage').textContent=catalog.coverageNote;$('bg-updated').textContent=catalog.updatedAt;
  for(const year of [...new Set(catalog.items.map(item=>item.year).filter(Boolean))].sort((a,b)=>b-a))$('bg-year').add(new Option(year,year));
  for(const event of [...new Set(catalog.items.map(item=>item.event))].sort((a,b)=>a.localeCompare(b,'pt-BR')))$('bg-event-options').append(new Option(event,event));
  $('bg-share').disabled=false;$('bg-import').disabled=shared;$('bg-export').disabled=shared;render();
}
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$('bg-grid').addEventListener('click',event=>{
  const details=event.target.closest('[data-detail]');if(details){detail(details.dataset.detail);return;}
  const button=event.target.closest('[data-obtain]');if(!button||shared||locked)return;
  const item=catalog.items.find(item=>item.id===button.dataset.obtain);if(!item||!released(item))return;
  const current=fresh();if(locked){render();return;}const ids=new Set(current.obtained),wasOwned=ids.has(item.id);wasOwned?ids.delete(item.id):ids.add(item.id);
  if(persist({...current,obtained:[...ids]})){render();const next=$('bg-grid').querySelector(`[data-obtain="${item.id}"]`);(next||$('bg-search')).focus({preventScroll:true});toast(`${item.name}: ${wasOwned?'removido da coleção':'marcado como obtido'}.`);}
});
$('bg-search').addEventListener('input',event=>{filters.query=event.target.value;page=1;if(catalog)render();});
for(const key of ['category','year','sort','status'])$(key==='status'?'bg-status-filter':'bg-'+key).addEventListener('change',event=>{filters[key]=event.target.value;page=1;if(catalog)render();});
$('bg-event').addEventListener('input',event=>{filters.event=event.target.value;page=1;if(catalog)render();});
document.querySelectorAll('[data-ownership]').forEach(button=>button.addEventListener('click',()=>{filters.ownership=button.dataset.ownership;page=1;if(catalog)render();}));
$('bg-filter-toggle').addEventListener('click',()=>{const expanded=$('bg-filters').hidden;$('bg-filters').hidden=!expanded;$('bg-filter-toggle').setAttribute('aria-expanded',expanded);});
for(const id of ['bg-clear','bg-reset-empty'])$(id).addEventListener('click',()=>{if(catalog)resetFilters();});
function navigatePage(candidate){
  if(!catalog)return;
  const totalPages=Math.max(1,Math.ceil(filterItems(catalog.items,filters,collection.obtained).length/pageSize()));
  const requested=Number(candidate);
  if(String(candidate).trim()==='' || !Number.isInteger(requested) || requested<1 || requested>totalPages){
    $('bg-page-input').value=String(page);
    toast(`Digite uma página entre 1 e ${totalPages}.`);
    return;
  }
  if(requested===page)return;
  page=requested;render();
  document.querySelector('.bg-toolbar').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
for(const [id,step] of [['bg-prev',-1],['bg-next',1]])$(id).addEventListener('click',()=>navigatePage(page+step));
$('bg-page-input').addEventListener('focus',event=>event.target.select());
$('bg-page-input').addEventListener('change',event=>navigatePage(event.target.value));
$('bg-page-input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();event.target.blur();}});
$('bg-export').addEventListener('click',()=>{
  if(locked){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw!==null){download(new Blob([raw],{type:'application/json'}),'go-nexus-fundos-recuperacao.json');return;}}catch{}toast('Os dados locais estão inacessíveis neste navegador.');return;}
  collection=fresh();download(new Blob([exportCollection(collection,catalog.updatedAt)],{type:'application/json'}),'go-nexus-fundos.json');toast('Arquivo de coleção exportado.');
});
$('bg-import').addEventListener('click',()=>$('bg-file').click());
$('bg-file').addEventListener('change',async event=>{const file=event.target.files[0];event.target.value='';if(!file)return;try{if(file.size>MAX_FILE_SIZE)throw new Error('Arquivo muito grande. O limite é 500 KB.');openImport(parseCollection(await file.text()));}catch(error){toast(error.message);}});
$('bg-restore').addEventListener('click',()=>{try{const raw=localStorage.getItem(BACKUP_KEY);if(raw===null){toast('Ainda não há backup local. Ele é criado ao importar ou restaurar uma coleção.');return;}openImport(parseCollection(raw),true);}catch(error){toast(error.message||'Não foi possível ler o backup.');}});
$('bg-replace-confirm').addEventListener('change',event=>$('bg-replace').disabled=!event.target.checked);
$('bg-merge').addEventListener('click',()=>applyImport(false));$('bg-replace').addEventListener('click',()=>{if($('bg-replace-confirm').checked)applyImport(true);});
$('bg-share').addEventListener('click',()=>{$('bg-trainer').value=collection.trainer;renderShare();$('bg-share-dialog').showModal();});
$('bg-trainer').addEventListener('input',()=>{if(!shared&&!locked)persist({...fresh(),trainer:$('bg-trainer').value});renderShare();});
$('bg-download-image').addEventListener('click',async()=>{try{await renderShare();download(await imageBlob(),'minha-colecao-go-nexus.png');$('bg-share-message').textContent='Imagem PNG pronta. Envie pelo WhatsApp ou pela sua rede social.';}catch(error){$('bg-share-message').textContent=error.message;}});
$('bg-native-share').addEventListener('click',async()=>{try{await renderShare();const file=new File([await imageBlob()],'colecao-go-nexus.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Minha coleção · GO Nexus'});}else{download(file,file.name);$('bg-share-message').textContent='Imagem baixada. Este navegador não oferece envio direto; anexe o PNG no aplicativo de sua preferência.';}}catch(error){if(error.name!=='AbortError')$('bg-share-message').textContent='Não foi possível abrir o compartilhamento. Use Baixar imagem.';}});
$('bg-copy-link').addEventListener('click',async()=>{try{const url=new URL(location.href);url.search='';url.hash=encodeShare({...collection,trainer:$('bg-trainer').value});const link=url.href;try{await navigator.clipboard.writeText(link);$('bg-share-message').textContent='Link copiado! Quem abrir verá esta versão da coleção, sem alterar os próprios dados.';$('bg-link-fallback').hidden=true;}catch{$('bg-link-fallback').hidden=false;$('bg-link-value').value=link;$('bg-link-value').focus();$('bg-link-value').select();$('bg-share-message').textContent='Selecione e copie o link acima.';}}catch(error){$('bg-share-message').textContent=error.message;}});
window.addEventListener('storage',event=>{if(!shared&&event.key===STORAGE_KEY){try{collection=readCollection(localStorage);locked=false;memoryOnly=false;$('bg-storage-warning').hidden=true;if(catalog)render();}catch{locked=true;storageWarning('A coleção foi alterada em outra aba e não pôde ser lida. Os dados foram preservados.');if(catalog)render();}}});
// Changing a shared URL must reload into a fresh read-only context, never reuse local state.
window.addEventListener('hashchange',()=>{if(shared||location.hash.startsWith('#colecao='))location.reload();});
mobile.addEventListener('change',()=>{page=1;if(catalog)render();});
document.addEventListener('error',event=>{const image=event.target;if(image instanceof HTMLImageElement&&image.closest('.bg-art')){image.parentElement.classList.remove('has-image');image.remove();}},true);
init().catch(error=>{$('bg-grid').setAttribute('aria-busy','false');$('bg-result-count').textContent='Falha ao carregar';storageWarning(error.message||'Não foi possível carregar o catálogo. Recarregue para tentar novamente.');});

// Printable report contains every record, independently of the active filters.
$('bg-pdf').addEventListener('click',()=>{
 if(!catalog)return;
 const report=window.open('','_blank');if(!report){toast('Permita abrir a janela do relatório para salvar o PDF.');return;}
 const stats=progress(catalog.items,collection.obtained),owned=new Set(collection.obtained);
 const rows=catalog.items.slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).map(item=>'<tr><td>'+escape(owned.has(item.id)?'Obtido':released(item)?'Faltante':statusLabel(item))+'</td><td><strong>'+escape(item.name)+'</strong><br><small>'+escape(item.id)+'</small></td><td>'+escape(item.event)+'</td><td>'+categories[item.category]+'</td><td>'+dateLabel(item)+'</td></tr>').join('');
 report.document.write('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Minha coleção — GO Nexus</title><style>body{font:12px Arial;color:#173454;margin:30px}h1{font-size:28px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px;border-bottom:1px solid #ccd7e7}th{background:#e9f0fa}tr{break-inside:avoid}small{font-size:9px;color:#536783}button{padding:12px;background:#2159cf;color:white;border:0;border-radius:8px;cursor:pointer}@page{size:A4 landscape;margin:14mm}@media print{button,.help{display:none}thead{display:table-header-group}body{margin:0}}</style><button onclick="window.print()">Imprimir / salvar como PDF</button><p class="help">Escolha “Salvar como PDF” na janela de impressão. Para restaurar marcações no GO Nexus, exporte também o JSON.</p><h1>GO NEXUS · Coleção de Fundos</h1><p>'+escape(collection.trainer||'Minha coleção')+' · '+new Date().toLocaleDateString('pt-BR')+'</p><p><strong>'+stats.obtained+' de '+stats.total+' obtidos · '+stats.percent.toLocaleString('pt-BR')+'% · '+stats.remaining+' restantes</strong></p><p>Especiais: '+stats.categories.special.obtained+'/'+stats.categories.special.total+' · Localização: '+stats.categories.location.obtained+'/'+stats.categories.location.total+'</p><p>Catálogo: '+catalog.updatedAt+'. Anunciados e não confirmados não entram no progresso. '+escape(catalog.coverageNote)+'</p><table><thead><tr><th>Estado</th><th>Fundo</th><th>Evento</th><th>Categoria</th><th>Lançamento</th></tr></thead><tbody>'+rows+'</tbody></table><p>Relatório para consulta. O arquivo JSON é o backup restaurável. Fontes e atribuições: GO Nexus / docs/fundos-fontes.md.</p></html>');report.document.close();
});
