/* Cards are rendered locally; no upload or external rendering service. */
(() => {
  const style = document.createElement('style');
  style.textContent = `.nx-create-card{width:100%;margin-top:16px;padding:11px;border:1px solid #456086;border-radius:11px;background:#12243c;color:#bae6fd;font:inherit;font-size:.82rem;font-weight:700;cursor:pointer}.nx-create-card:hover{background:#1c3554}.nx-share-dialog{width:min(520px,calc(100% - 24px));max-height:92dvh;overflow:auto;border:1px solid #456086;border-radius:20px;padding:20px;background:#0b1729;color:#f8fafc}.nx-share-dialog::backdrop{background:#020817cc}.nx-share-dialog h2{margin:0;font-size:1.2rem}.nx-share-dialog p{font-size:.85rem;color:#b8c8dc;line-height:1.5}.nx-share-dialog img{display:block;width:100%;height:auto;border-radius:12px}.nx-share-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.nx-share-dialog button,.nx-share-dialog a{font:inherit}.nx-share-close{border:0;background:transparent;color:#fff;padding:8px;cursor:pointer}.nx-share-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.nx-share-actions button,.nx-share-actions a{flex:1;text-align:center;padding:12px;border-radius:10px;border:1px solid #456086;background:#17314f;color:#fff;text-decoration:none;cursor:pointer}.nx-share-actions button{background:#2563eb}.nx-share-actions button:disabled{opacity:.5;cursor:wait}.nx-share-dialog [hidden]{display:none!important}.nx-create-card:focus-visible,.nx-share-dialog :focus-visible{outline:3px solid #38bdf8;outline-offset:3px}`;
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.className = 'nx-share-dialog';
  dialog.setAttribute('aria-labelledby', 'nx-share-title');
  dialog.innerHTML = `<div class="nx-share-top"><h2 id="nx-share-title">Seu card de evolução</h2><button class="nx-share-close" type="button" aria-label="Fechar">✕</button></div><p>Compartilhe os requisitos com outros treinadores.</p><img hidden alt="Prévia do card de evolução"><p role="status" aria-live="polite"></p><div class="nx-share-actions"><button type="button" disabled>Compartilhar</button><a hidden>Baixar imagem</a></div>`;
  document.body.append(dialog);
  const preview = dialog.querySelector('img');
  const status = dialog.querySelector('[role="status"]');
  const share = dialog.querySelector('.nx-share-actions button');
  const download = dialog.querySelector('a');
  let objectURL, file, selected, version = 0, trigger;
  dialog.querySelector('.nx-share-close').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { version++; trigger?.focus(); });
  const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const routeURL = r => `https://evandroferreira8.github.io/GoNexus/evolucoes-especiais.html?pokemon=${encodeURIComponent(r.to)}`;

  function loadArt(dex) {
    return new Promise(resolve => {
      const img = new Image();
      const timer = setTimeout(() => { img.onload = img.onerror = null; resolve(null); }, 7000);
      img.crossOrigin = 'anonymous';
      img.onload = () => { clearTimeout(timer); resolve(img); };
      img.onerror = () => { clearTimeout(timer); resolve(null); };
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
    });
  }
  async function createImage(r) {
    const arts = await Promise.all([loadArt(r.dex_from), loadArt(r.dex_to)]);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    let ctx = canvas.getContext('2d');
    const font = (size, weight = 500) => { ctx.font = `${weight} ${size}px system-ui, sans-serif`; };
    function lines(text, width, size, weight = 500) {
      font(size, weight);
      const result = []; let line = '';
      for (const word of text.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > width) { result.push(line); line = word; }
        else line = next;
      }
      if (line) result.push(line);
      return result;
    }
    const names = [lines(r.frm, 400, 36, 800), lines(r.to, 400, 36, 800)];
    const requirements = r.reqs.map(t => lines(t, 860, 32));
    const notes = r.note ? lines(r.note, 888, 27) : [];
    const nameEnd = 500 + Math.max(...names.map(n => n.length)) * 56;
    const reqStart = nameEnd + 144;
    const noteStart = reqStart + requirements.reduce((n, l) => n + l.length * 44 + 24, 0);
    const footerStart = noteStart + (notes.length ? notes.length * 38 + 48 : 10) + 30;
    canvas.height = Math.max(1080, footerStart + 192);
    ctx = canvas.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, 1080, canvas.height);
    bg.addColorStop(0, '#102440'); bg.addColorStop(1, '#07111f');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, canvas.height);
    const accent = ctx.createLinearGradient(0, 0, 1080, 0);
    accent.addColorStop(0, '#38bdf8'); accent.addColorStop(.5, '#8b5cf6'); accent.addColorStop(1, '#ec4899');
    ctx.fillStyle = accent; ctx.fillRect(0, 0, 1080, 10);
    function text(t, x, y, size, color = '#f8fafc', weight = 500) { font(size, weight); ctx.fillStyle = color; ctx.fillText(t, x, y); }
    ctx.fillStyle='#38bdf8';ctx.fillRect(64, 46, 188, 6);
    text('GO NEXUS', 64, 104, 46, '#7dd3fc', 950);
    text('GUIA DE EVOLUÇÃO • POKÉMON GO', 64, 151, 24, '#a6b8ce', 700);
    [r.frm, r.to].forEach((name, i) => {
      const center = i ? 790 : 290;
      ctx.fillStyle = '#142e4b'; ctx.beginPath(); ctx.arc(center, 304, 136, 0, Math.PI * 2); ctx.fill();
      if (arts[i]) ctx.drawImage(arts[i], center - 124, 180, 248, 248);
      else { ctx.textAlign = 'center'; text('?', center, 340, 90, '#7dd3fc'); }
      ctx.textAlign = 'center';
      text(`#${String(i ? r.dex_to : r.dex_from).padStart(4, '0')}`, center, 169, 22, '#9ab0c9', 700);
      names[i].forEach((line, j) => text(line, center, 520 + j * 66, 54, '#fff', 950));
      ctx.textAlign = 'left';
    });
    text('→', 510, 325, 58, '#7dd3fc', 700);
    text(r.candy == null ? '999 Moedas de Gimmighoul' : `${r.candy} Doces`, 64, nameEnd + 54, 34, '#fde68a', 800);
    text('REQUISITOS', 64, nameEnd + 110, 23, '#9ab0c9', 800);
    let y = reqStart;
    requirements.forEach(ls => { text('✓', 64, y, 32, '#34d399', 800); ls.forEach(l => { text(l, 112, y, 32); y += 44; }); y += 24; });
    if (notes.length) {
      ctx.fillStyle = '#16243c'; ctx.fillRect(64, noteStart - 10, 952, notes.length * 38 + 38);
      notes.forEach((l, i) => text(l, 86, noteStart + 25 + i * 38, 27, '#b8c8dc'));
    }
    const bottom = canvas.height - 180;
    ctx.fillStyle = '#314761'; ctx.fillRect(64, bottom, 952, 1);
    text('Mais guias e ferramentas no GO Nexus', 64, bottom + 54, 30, '#f8fafc', 700);
    text('evandroferreira8.github.io/GoNexus/', 64, bottom + 99, 29, '#7dd3fc', 600);
    text('Requisitos permanentes • Confira as condições no jogo.', 64, bottom + 143, 22, '#9ab0c9');
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('PNG unavailable');
    return { blob, missingArt: arts.some(a => !a) };
  }
  document.getElementById('grid').addEventListener('click', async event => {
    const button = event.target.closest('[data-share-route]');
    if (!button) return;
    trigger = button; selected = routes[Number(button.dataset.shareRoute)];
    const current = ++version;
    if (objectURL) URL.revokeObjectURL(objectURL);
    preview.hidden = download.hidden = true; share.disabled = true; share.hidden = false; file = null;
    status.textContent = 'Criando sua imagem…'; dialog.showModal();
    try {
      const { blob, missingArt } = await createImage(selected);
      if (current !== version) return;
      file = new File([blob], `go-nexus-${slug(selected.frm)}-${slug(selected.to)}.png`, { type: 'image/png' });
      objectURL = URL.createObjectURL(blob);
      preview.src = download.href = objectURL; download.download = file.name;
      preview.alt = `${selected.frm} para ${selected.to}: ${selected.reqs.join('; ')}`;
      preview.hidden = download.hidden = false;
      const canShare = !!navigator.canShare?.({ files: [file] });
      share.hidden = !canShare; share.disabled = false;
      status.textContent = missingArt ? 'As ilustrações não carregaram. Os nomes e requisitos estão completos; você pode baixar o card ou tentar novamente.' : canShare ? 'Pronto! Escolha um aplicativo ou baixe a imagem.' : 'Baixe a imagem e envie no WhatsApp, Instagram ou onde preferir.';
    } catch (error) {
      if (current === version) { status.textContent = 'Não foi possível criar o card. Feche esta janela e tente novamente.'; share.hidden = true; }
    }
  });
  share.addEventListener('click', async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: `${selected.frm} → ${selected.to} | GO Nexus`, text: `Veja os requisitos e mais guias no GO Nexus: ${routeURL(selected)}` });
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'O compartilhamento não foi concluído. Você também pode baixar a imagem e enviá-la pelo aplicativo.';
    }
  });
  const query = new URLSearchParams(location.search).get('pokemon');
  if (query) { document.getElementById('search').value = query; render(); }
})();
