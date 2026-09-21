(() => {
  // Newest first. Keep the release list here; the carousel displays the latest five.
  const releases = [
    {icon:'🛡️', title:'Leve as fraquezas para o seu grupo', text:'Pesquise um Pokémon e crie um card com fraquezas, resistências e clima favorável.', link:'tipagens.html?novidade=cards', action:'Criar card de combate'},
    {icon:'🧮', title:'Essa caixa vale a pena? Mostre a conta!', text:'Transforme a comparação de uma oferta em uma imagem com itens, preço e economia.', link:'calculadora.html?novidade=cards', action:'Comparar e compartilhar'},
    {icon:'🔴', title:'Compartilhe seu plano de Movimentos Max', text:'Escolha os níveis atuais e desejados. O card mostra o plano e os recursos necessários.', link:'central-max.html?novidade=cards', action:'Planejar Movimentos Max'},
    {icon:'🔷', title:'Seu progresso Mega, pronto para enviar', text:'Crie cards de Megaenergia e de progresso até o Nível Máximo para compartilhar.', link:'central-mega.html?novidade=cards', action:'Calcular e criar card'},
    {icon:'✨', title:'Mostre quanto rende cada captura', text:'Escolha um Pokémon, combine os bônus e compartilhe a estimativa de Poeira Estelar.', link:'poeira-estelar.html?novidade=cards', action:'Calcular Poeira Estelar'},
    {icon:'🧬', title:'Compartilhe os requisitos de evolução', text:'Envie ao grupo um card com os requisitos e as observações da evolução.', link:'evolucoes-especiais.html', action:'Consultar evoluções'}
  ].slice(0, 5);
  const root = document.getElementById('featureUpdates');
  if (!root) return;
  root.innerHTML = `<div class="nx-updates-head"><div><span class="nx-updates-kicker">Acabou de chegar</span><h2 id="featureUpdatesTitle">Novidades do GO Nexus</h2><p>Descubra os cinco recursos mais recentes.</p></div><div class="nx-updates-controls"><button type="button" data-direction="-1" aria-label="Novidade anterior">←</button><button type="button" data-pause aria-label="Pausar novidades automáticas">Pausar</button><button type="button" data-direction="1" aria-label="Próxima novidade">→</button></div></div><div class="nx-updates-track" aria-label="Últimos cinco recursos">${releases.map((r,i)=>`<a class="nx-update" href="${r.link}" aria-label="${i+1} de ${releases.length}: ${r.title}. ${r.action}"><span class="nx-update-icon" aria-hidden="true">${r.icon}</span><div><small>NOVO · CARDS COMPARTILHÁVEIS</small><h3>${r.title}</h3><p>${r.text}</p><strong>${r.action} →</strong></div></a>`).join('')}</div><div class="nx-updates-bottom"><span data-position>1 de 5 · Deslize para explorar</span><div class="nx-update-dots">${releases.map((r,i)=>`<button type="button" data-slide="${i}" aria-label="Ver novidade ${i+1}: ${r.title}" aria-current="${i===0}"></button>`).join('')}</div></div>`;
  const track = root.querySelector('.nx-updates-track');
  const cards = [...track.children];
  const pause = root.querySelector('[data-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = reduced.matches, hovered = false, focused = false, visible = true, timer;
  const left = i => cards[i].offsetLeft - cards[0].offsetLeft;
  // Let the last card align at the same starting point as the first.
  const spacer = document.createElement('span'); spacer.setAttribute('aria-hidden','true'); spacer.style.flexShrink = '0'; track.append(spacer);
  function sizeSpacer(){spacer.style.width = Math.max(0, track.clientWidth - cards[0].offsetWidth - 18)+'px';}
  function paint(){root.querySelector('[data-position]').textContent = `${index+1} de ${cards.length} · Deslize para explorar`;root.querySelectorAll('[data-slide]').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));pause.textContent=paused?'Reproduzir':'Pausar';pause.setAttribute('aria-label',paused?'Reproduzir novidades automáticas':'Pausar novidades automáticas');}
  function schedule(){clearTimeout(timer);if(!paused&&!hovered&&!focused&&visible&&!document.hidden)timer=setTimeout(()=>go(index+1),6500);}
  function go(next){index=(next+cards.length)%cards.length;track.scrollTo({left:left(index),behavior:reduced.matches?'instant':'smooth'});paint();schedule();}
  root.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>go(index+Number(b.dataset.direction)));
  root.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>go(Number(b.dataset.slide)));
  pause.onclick=()=>{paused=!paused;paint();schedule();};
  root.addEventListener('mouseenter',()=>{hovered=true;schedule();});root.addEventListener('mouseleave',()=>{hovered=false;schedule();});
  root.addEventListener('focusin',()=>{focused=true;schedule();});root.addEventListener('focusout',e=>{focused=root.contains(e.relatedTarget);schedule();});
  track.addEventListener('pointerdown',()=>{clearTimeout(timer);});
  track.addEventListener('scroll',()=>{index=cards.reduce((best,_,i)=>Math.abs(left(i)-track.scrollLeft)<Math.abs(left(best)-track.scrollLeft)?i:best,0);paint();schedule();},{passive:true});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{paused=reduced.matches;paint();schedule();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(root);
  new ResizeObserver(()=>{sizeSpacer();track.scrollTo({left:left(index),behavior:'instant'});}).observe(track);
  sizeSpacer();paint();schedule();
})();
