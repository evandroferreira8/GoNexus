import {STORAGE_KEY,BACKUP_KEY,MAX_FILE_SIZE,emptyCollection,parseCollection,validateCollection,readCollection,saveCollection,mergeCollections,progress,filterItems,released,exportCollection,encodeShare,decodeShare,localImage,normalize} from './fundos-core.mjs?v=20261108c';
const $=id=>document.getElementById(id), categories={special:'Especial',location:'Localização'};
const mobile=matchMedia('(max-width:600px)');
const pageSize=()=>mobile.matches?8:20;
const renderName=()=>collection.trainer?.trim()||'Minha coleção';
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
function syncPlayerName(){
  const profile=$('bg-player-name');
  if(document.activeElement!==profile)profile.value=collection.trainer||'';
  profile.disabled=shared||locked;
  $('bg-player-saved').textContent=shared?'Somente leitura':locked?'Coleção bloqueada':'Salvo automaticamente';
  $('bg-trainer').value=collection.trainer||'';
  $('bg-share-player-name').textContent=renderName();
  if(shared&&collection.trainer)$('bg-shared-title').textContent='Coleção de '+collection.trainer;
}
function updateTrainer(value){
  if(shared||locked)return;
  const name=String(value||'').slice(0,40);
  if(persist({...fresh(),trainer:name})){
    $('bg-trainer').value=collection.trainer;
    $('bg-share-player-name').textContent=renderName();
    $('bg-player-saved').textContent=memoryOnly?'Salvo somente nesta aba':'Salvo automaticamente';
    if($('bg-share-dialog').open)void renderShare();
  }
}
$('bg-player-name').addEventListener('input',event=>updateTrainer(event.target.value));
function renderProgress(){
  const p=progress(catalog.items,collection.obtained);
  $('bg-percent').textContent=p.percent.toLocaleString('pt-BR')+'%';$('bg-ring').style.setProperty('--completion',p.percent+'%');
  for(const key of ['obtained','total','remaining'])$('bg-'+key).textContent=p[key];
  $('bg-category-progress').innerHTML=Object.entries(p.categories).map(([key,value])=>`<div><div class="bg-category-line"><span>${key==='special'?'✦ Especiais':'◎ Localização'}</span><b>${value.obtained} / ${value.total}</b></div><progress max="${value.total||1}" value="${value.obtained}" aria-label="${categories[key]}: ${value.obtained} de ${value.total}"></progress></div>`).join('');
}
function render(){
  syncPlayerName();
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

const FEATURED_KEY='go-nexus:backgrounds:featured:v1';
const shareArtworkCache=new Map();
let featuredIds=[],shareRenderVersion=0;
function shareAvailableItems(){
  const selected=new Set(collection.obtained);
  return catalog.items.filter(item=>released(item)&&selected.has(item.id));
}
function initializeFeatured(){
  const available=shareAvailableItems();
  const ids=new Set(available.map(item=>item.id));
  let stored=null;
  if(!shared){
    try{
      const value=JSON.parse(localStorage.getItem(FEATURED_KEY));
      if(Array.isArray(value))stored=value;
    }catch{}
  }
  featuredIds=(stored||available.slice().sort((a,b)=>(b.releaseDate||'').localeCompare(a.releaseDate||'')).slice(0,4).map(item=>item.id))
    .filter((id,index,arr)=>typeof id==='string'&&ids.has(id)&&arr.indexOf(id)===index).slice(0,4);
}
function persistFeatured(){
  if(shared)return;
  try{localStorage.setItem(FEATURED_KEY,JSON.stringify(featuredIds));}catch{}
}
function selectedFeatured(){
  const items=new Map(shareAvailableItems().map(item=>[item.id,item]));
  return featuredIds.map(id=>items.get(id)).filter(Boolean).slice(0,4);
}
function renderFeaturedEditor(){
  const items=shareAvailableItems();
  const search=normalize($('bg-featured-search').value.trim());
  const ranked=items.filter(item=>normalize([item.name,item.event,item.year].join(' ')).includes(search))
    .sort((a,b)=>(featuredIds.includes(b.id)?1:0)-(featuredIds.includes(a.id)?1:0)||a.name.localeCompare(b.name,'pt-BR'));
  $('bg-featured-help').textContent=!items.length?'Marque fundos no checklist para escolher as imagens.':
    featuredIds.length===4? '4 de 4 escolhidos. Desmarque um fundo para trocar.':
    featuredIds.length+' de 4 escolhidos. Selecione os que quer mostrar.';
  const limit=36;
  $('bg-featured-list').innerHTML=ranked.slice(0,limit).map(item=>{
    const image=localImage(item.image),active=featuredIds.includes(item.id);
    return '<button type="button" class="bg-featured-item'+(active?' is-selected':'')+'" data-featured="'+escape(item.id)+'" aria-pressed="'+active+'" aria-label="'+(active?'Remover dos destaques: ':'Adicionar aos destaques: ')+escape(item.name)+'">'+
      (image?'<img src="'+escape(image.thumbnail)+'" alt="" loading="lazy">':'<span class="bg-featured-empty" aria-hidden="true">✦</span>')+
      '<span class="bg-featured-name">'+escape(item.name)+'</span><span class="bg-featured-check" aria-hidden="true">'+(active?'✓':'+')+'</span></button>';
  }).join('');
  if(ranked.length>limit)$('bg-featured-help').textContent+=' Exibindo '+limit+' de '+ranked.length+' resultados; pesquise para encontrar outros.';
  if(items.length&&!ranked.length)$('bg-featured-list').innerHTML='<p class="bg-featured-empty-result">Nenhum fundo obtido corresponde à busca.</p>';
}
function shareArtwork(item){
  const art=localImage(item.image);
  if(!art)return Promise.resolve(null);
  if(!shareArtworkCache.has(art.src)){
    shareArtworkCache.set(art.src,new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>resolve(null);
      img.src=art.src;
    }));
  }
  return shareArtworkCache.get(art.src);
}
function roundedBox(ctx,x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
}
function drawFitted(ctx,value,x,y,size,maxWidth,color,weight=700,min=20){
  ctx.fillStyle=color;
  do{ctx.font=weight+' '+size+'px Inter, Arial, sans-serif';if(ctx.measureText(value).width<=maxWidth||size<=min)break;size-=2;}while(true);
  ctx.fillText(value,x,y);
}
function drawWrapped(ctx,value,x,y,maxWidth,size,color,weight=700,maxLines=2){
  ctx.font=weight+' '+size+'px Inter, Arial, sans-serif';
  const words=String(value).split(/\s+/);
  const lines=[];let current='';
  for(const word of words){
    const next=current?current+' '+word:word;
    if(ctx.measureText(next).width>maxWidth&&current){lines.push(current);current=word;}else current=next;
  }
  if(current)lines.push(current);
  const display=lines.slice(0,maxLines);
  if(lines.length>maxLines){let last=display[maxLines-1];while(last&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);display[maxLines-1]=last+'…';}
  display.forEach((line,i)=>drawFitted(ctx,line,x,y+i*(size+7),size,maxWidth,color,weight,18));
}
async function renderShare(){
  if(!catalog)return;
  const version=++shareRenderVersion;
  const canvas=$('bg-share-canvas'),ctx=canvas.getContext('2d');
  if(!ctx)return;
  const p=progress(catalog.items,collection.obtained);
  const chosen=selectedFeatured(),name=$('bg-trainer').value.trim();
  $('bg-share-preview-status').textContent='Atualizando prévia…';
  const images=await Promise.all(chosen.map(shareArtwork));
  if(version!==shareRenderVersion)return;
  const NAVY='#112f52',INK='#173859',BLUE='#2563b5',MUTED='#617791',GOLD='#f0c952',WHITE='#ffffff';
  ctx.clearRect(0,0,1080,1350);ctx.fillStyle='#f2f6fc';ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle=NAVY;ctx.fillRect(0,0,1080,14);
  ctx.fillStyle='#dfeafa';ctx.beginPath();ctx.arc(1012,190,150,0,2*Math.PI);ctx.fill();
  ctx.fillStyle='#c8dbf3';ctx.beginPath();ctx.arc(1012,190,96,0,2*Math.PI);ctx.fill();
  roundedBox(ctx,70,60,62,54,12,NAVY);
  drawFitted(ctx,'GO',79,97,29,47,GOLD,800);
  drawFitted(ctx,'NEXUS',148,98,30,215,NAVY,800);
  drawFitted(ctx,'ÁLBUM DE COLECIONADOR',685,96,18,319,MUTED,700);
  ctx.fillStyle='#d3dfed';ctx.fillRect(70,139,940,2);
  drawFitted(ctx,'COLEÇÃO DE FUNDOS',70,192,23,730,BLUE,800);
  drawFitted(ctx,name||'Minha coleção',70,271,65,920,NAVY,800,34);
  roundedBox(ctx,70,307,940,229,24,NAVY);
  ctx.fillStyle='#284b73';ctx.fillRect(109,484,860,13);
  const bar=(Math.max(0,Math.min(100,p.percent))/100)*860;
  if(bar>0)roundedBox(ctx,109,484,bar,13,6,GOLD);
  drawFitted(ctx,String(p.obtained),108,433,127,420,WHITE,800,85);
  drawFitted(ctx,'de '+p.total+' fundos',114,470,25,410,'#cbdbee',600);
  drawFitted(ctx,p.percent.toLocaleString('pt-BR')+'%',646,408,81,325,GOLD,800,55);
  drawFitted(ctx,'DA COLEÇÃO',652,446,20,300,'#cbdbee',700);
  const categoriesInfo=[
    ['ESPECIAIS',p.categories.special],
    ['LOCALIZAÇÃO',p.categories.location]
  ];
  categoriesInfo.forEach(([label,stats],i)=>{
    const x=70+i*482;
    roundedBox(ctx,x,560,458,140,18,WHITE,'#d9e4f1');
    drawFitted(ctx,label,x+26,607,20,405,MUTED,800);
    drawFitted(ctx,stats.obtained+' / '+stats.total,x+26,666,47,400,NAVY,800);
  });
  drawFitted(ctx,'FUNDOS EM DESTAQUE',70,749,24,560,NAVY,800);
  drawFitted(ctx,'ESCOLHIDOS POR VOCÊ',742,747,16,268,MUTED,700);
  for(let i=0;i<4;i++){
    const x=70+(i%2)*482,y=771+Math.floor(i/2)*220;
    roundedBox(ctx,x,y,458,208,17,WHITE,'#d9e4f1');
    roundedBox(ctx,x+13,y+13,182,182,11,'#123b62');
    const item=chosen[i],img=images[i];
    if(item&&img){
      const sc=Math.min(180/img.width,180/img.height);
      ctx.save();ctx.beginPath();ctx.roundRect(x+14,y+14,180,180,10);ctx.clip();
      ctx.drawImage(img,x+14+(180-img.width*sc)/2,y+14+(180-img.height*sc)/2,img.width*sc,img.height*sc);ctx.restore();
    }else{
      ctx.fillStyle='#e8ca69';ctx.font='700 66px Inter, Arial, sans-serif';ctx.fillText(item?'✦':'+',x+85,y+122);
    }
    drawFitted(ctx,String(i+1).padStart(2,'0'),x+217,y+42,18,225,MUTED,700);
    if(item){
      drawWrapped(ctx,item.name,x+217,y+91,217,25,INK,750,2);
      drawFitted(ctx,(item.category==='special'?'Especial':'Localização')+' · '+(item.year||'—'),x+217,y+178,17,225,MUTED,550);
    }else{
      drawWrapped(ctx,chosen.length?'Escolha mais um fundo':'Seu próximo fundo',x+217,y+92,215,24,INK,650,2);
      drawFitted(ctx,'Marque no checklist',x+217,y+178,16,225,MUTED,550);
    }
  }
  ctx.fillStyle='#d6e2ef';ctx.fillRect(70,1242,940,2);
  drawFitted(ctx,'Explore. Colecione. Compartilhe.',70,1287,23,635,NAVY,700);
  drawFitted(ctx,'GO NEXUS  •  '+catalog.updatedAt.slice(0,4),790,1286,18,220,MUTED,700);
  $('bg-share-preview-status').textContent='Prévia atualizada. Você pode baixar ou compartilhar.';
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
$('bg-share').addEventListener('click',()=>{
  syncPlayerName();
  $('bg-featured-search').value='';
  initializeFeatured();renderFeaturedEditor();
  $('bg-share-dialog').showModal();void renderShare();
});
$('bg-featured-search').addEventListener('input',renderFeaturedEditor);
$('bg-featured-list').addEventListener('click',event=>{
  const button=event.target.closest('[data-featured]');
  if(!button)return;
  const id=button.dataset.featured;
  if(featuredIds.includes(id))featuredIds=featuredIds.filter(item=>item!==id);
  else if(featuredIds.length<4)featuredIds.push(id);
  else{
    $('bg-featured-help').textContent='Você já escolheu quatro. Remova um para adicionar outro.';
    return;
  }
  persistFeatured();renderFeaturedEditor();void renderShare();
});

$('bg-download-image').addEventListener('click',async()=>{try{await renderShare();download(await imageBlob(),'minha-colecao-go-nexus.png');$('bg-share-message').textContent='Imagem PNG pronta. Envie pelo WhatsApp ou pela sua rede social.';}catch(error){$('bg-share-message').textContent=error.message;}});
$('bg-native-share').addEventListener('click',async()=>{try{await renderShare();const file=new File([await imageBlob()],'colecao-go-nexus.png',{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Minha coleção · GO Nexus'});}else{download(file,file.name);$('bg-share-message').textContent='Imagem baixada. Este navegador não oferece envio direto; anexe o PNG no aplicativo de sua preferência.';}}catch(error){if(error.name!=='AbortError')$('bg-share-message').textContent='Não foi possível abrir o compartilhamento. Use Baixar imagem.';}});
$('bg-copy-link').addEventListener('click',async()=>{try{const url=new URL(location.href);url.search='';url.hash=encodeShare(collection);const link=url.href;try{await navigator.clipboard.writeText(link);$('bg-share-message').textContent='Link copiado! Quem abrir verá esta versão da coleção, sem alterar os próprios dados.';$('bg-link-fallback').hidden=true;}catch{$('bg-link-fallback').hidden=false;$('bg-link-value').value=link;$('bg-link-value').focus();$('bg-link-value').select();$('bg-share-message').textContent='Selecione e copie o link acima.';}}catch(error){$('bg-share-message').textContent=error.message;}});
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
 report.document.write('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Relatório da coleção — GO Nexus</title><style>body{font:12px Arial;color:#173454;margin:30px}h1{font-size:28px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px;border-bottom:1px solid #ccd7e7}th{background:#e9f0fa}tr{break-inside:avoid}small{font-size:9px;color:#536783}button{padding:12px;background:#2159cf;color:white;border:0;border-radius:8px;cursor:pointer}@page{size:A4 landscape;margin:14mm}@media print{button,.help{display:none}thead{display:table-header-group}body{margin:0}}</style><button onclick="window.print()">Imprimir / salvar como PDF</button><p class="help">Escolha “Salvar como PDF” na janela de impressão. Para restaurar marcações no GO Nexus, exporte também o JSON.</p><h1>GO NEXUS · Coleção de Fundos</h1><p><strong>Treinador: '+escape(renderName())+'</strong> · '+new Date().toLocaleDateString('pt-BR')+'</p><p><strong>'+stats.obtained+' de '+stats.total+' obtidos · '+stats.percent.toLocaleString('pt-BR')+'% · '+stats.remaining+' restantes</strong></p><p>Especiais: '+stats.categories.special.obtained+'/'+stats.categories.special.total+' · Localização: '+stats.categories.location.obtained+'/'+stats.categories.location.total+'</p><p>Catálogo: '+catalog.updatedAt+'. Anunciados e não confirmados não entram no progresso. '+escape(catalog.coverageNote)+'</p><table><thead><tr><th>Estado</th><th>Fundo</th><th>Evento</th><th>Categoria</th><th>Lançamento</th></tr></thead><tbody>'+rows+'</tbody></table><p>Relatório para consulta. O arquivo JSON é o backup restaurável. Fontes e atribuições: GO Nexus / docs/fundos-fontes.md.</p></html>');report.document.close();
});
