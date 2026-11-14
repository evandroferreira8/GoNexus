/* GO NEXUS · BINGO DE CAPTURA — Área Selvagem GO 2026 */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "gonexus-area-selvagem-bingo-2026-v1";
  const ASSET_ROOT = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const labels = {
    aco:"Aço", dragao:"Dragão", incriveis:"Incríveis", reides:"Reides",
    max:"Batalhas Max", ovos:"Ovos 10 km", incenso:"Incenso"
  };
  const filters = [
    ["todos","Todos"],["aco","Aço"],["dragao","Dragão"],["incriveis","Incríveis"],
    ["reides","Reides"],["max","Batalhas Max"],["ovos","Ovos 10 km"],["incenso","Incenso"]
  ];
  const grid = $("waBingoGrid");
  const filterRoot = $("waBingoFilters");
  const search = $("waBingoSearch");
  const notice = $("waBingoNotice");
  if (!grid || !filterRoot || !search || !notice) return;

  let items = [];
  let activeFilter = "todos";
  let query = "";
  let progress = loadProgress();

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {};
    } catch (_) { return {}; }
  }
  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({version:1,updatedAt:new Date().toISOString(),progress}));
      notice.textContent = "Progresso salvo neste navegador.";
    } catch (_) {
      notice.textContent = "Não foi possível salvar. Verifique o espaço disponível no navegador.";
    }
  }
  function stateFor(key) {
    const value = progress[key] || {};
    return {shiny:value.shiny === true, perfect:value.perfect === true};
  }
  function counts() {
    let shiny = 0, perfect = 0, caught = 0;
    for (const item of items) {
      const state = stateFor(item.key);
      if (state.shiny) shiny++;
      if (state.perfect) perfect++;
      if (state.shiny || state.perfect) caught++;
    }
    return {shiny,perfect,caught,total:items.length};
  }
  function updateStats() {
    const c = counts();
    $("waBingoShinyCount").textContent = c.shiny;
    $("waBingoPerfectCount").textContent = c.perfect;
    $("waBingoCaughtCount").textContent = c.caught + " / " + c.total;
    $("waBingoShinyLabel").textContent = c.shiny === 1 ? "espécie Shiny" : "espécies Shiny";
    $("waBingoPerfectLabel").textContent = c.perfect === 1 ? "espécie 100% IV" : "espécies 100% IV";
  }
  function drawFilters() {
    filterRoot.replaceChildren();
    for (const [id,label] of filters) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wa-bingo-filter";
      button.textContent = label;
      button.dataset.filter = id;
      button.setAttribute("aria-pressed",String(activeFilter === id));
      button.addEventListener("click",() => { activeFilter = id; drawFilters(); render(); });
      filterRoot.append(button);
    }
  }
  function visibleItems() {
    return items.filter(item => {
      const matchesGroup = activeFilter === "todos" || item.groups.includes(activeFilter);
      const haystack = (item.name + " " + (item.note || "") + " " + item.groups.map(g => labels[g] || g).join(" ")).toLocaleLowerCase("pt-BR");
      return matchesGroup && (!query || haystack.includes(query));
    });
  }
  function makeMark(item, flag, active, icon, text) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wa-bingo-mark";
    button.dataset.flag = flag;
    button.setAttribute("aria-pressed",String(active));
    button.setAttribute("aria-label",(active ? "Desmarcar " : "Marcar ") + text + " para " + item.name);
    const symbol = document.createElement("span");
    symbol.className = "wa-bingo-mark-icon";
    symbol.textContent = active ? "✓" : icon;
    const label = document.createElement("span");
    label.textContent = active ? (flag === "shiny" ? "Shiny!" : "100%!") : text;
    button.append(symbol,label);
    button.addEventListener("click",() => {
      const next = stateFor(item.key);
      next[flag] = !next[flag];
      progress[item.key] = next;
      saveProgress();
      render();
    });
    return button;
  }
  function makeCard(item,index) {
    const state = stateFor(item.key);
    const card = document.createElement("article");
    card.className = "wa-bingo-card" + (state.shiny || state.perfect ? " is-caught" : "");
    const head = document.createElement("div");
    head.className = "wa-bingo-card-head";
    const number = document.createElement("span");
    number.className = "wa-bingo-number";
    number.textContent = String(index + 1).padStart(2,"0");
    const tags = document.createElement("span");
    tags.className = "wa-bingo-groups";
    const uniqueGroups = item.groups.filter((g,i,a) => a.indexOf(g) === i).slice(0,2);
    uniqueGroups.forEach(group => {
      const tag = document.createElement("span");
      tag.className = "wa-bingo-tag";
      tag.textContent = labels[group] || group;
      tags.append(tag);
    });
    head.append(number,tags);
    const art = document.createElement("div");
    art.className = "wa-bingo-art";
    const image = document.createElement("img");
    image.src = ASSET_ROOT + item.sprite + ".png";
    image.alt = item.name;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error",() => { image.hidden = true; });
    art.append(image);
    const name = document.createElement("h3");
    name.className = "wa-bingo-name";
    name.textContent = item.name;
    card.append(head,art,name);
    if (item.note) {
      const note = document.createElement("p");
      note.className = "wa-bingo-note";
      note.textContent = item.note;
      card.append(note);
    }
    const flags = document.createElement("div");
    flags.className = "wa-bingo-flags";
    flags.append(
      makeMark(item,"shiny",state.shiny,"✦","Shiny"),
      makeMark(item,"perfect",state.perfect,"💯","100% IV")
    );
    card.append(flags);
    return card;
  }
  function render() {
    const list = visibleItems();
    grid.setAttribute("aria-busy","false");
    grid.replaceChildren();
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "wa-bingo-empty";
      empty.textContent = "Nenhum Pokémon encontrado com esse filtro. Tente outra busca.";
      grid.append(empty);
    } else {
      list.forEach((item,index) => grid.append(makeCard(item,index)));
    }
    updateStats();
  }
  function loadData() {
    fetch("area-selvagem-bingo-data.json?v=20261113a")
      .then(response => {
        if (!response.ok) throw new Error("Falha ao carregar a lista de Pokémon.");
        return response.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.items)) throw new Error("Formato de dados inválido.");
        items = data.items;
        drawFilters();
        render();
        const saved = counts();
        notice.textContent = items.length + " entradas carregadas. " + saved.caught + " espécies com marcações neste navegador.";
      })
      .catch(error => {
        grid.innerHTML = "";
        const empty = document.createElement("div");
        empty.className = "wa-bingo-empty";
        empty.textContent = error.message + " Atualize a página ou tente novamente.";
        grid.append(empty);
        grid.setAttribute("aria-busy","false");
        notice.textContent = "A cartela não conseguiu acessar o arquivo de dados.";
      });
  }
  search.addEventListener("input",() => {
    query = search.value.trim().toLocaleLowerCase("pt-BR");
    render();
  });
  $("waBingoClearFilter").addEventListener("click",() => {
    activeFilter = "todos";
    search.value = "";
    query = "";
    drawFilters();
    render();
  });
  $("waBingoReset").addEventListener("click",() => {
    const c = counts();
    if (!c.caught) { notice.textContent = "Ainda não há marcações para apagar."; return; }
    if (!window.confirm("Apagar todas as marcações de Shiny e 100% IV deste navegador?")) return;
    progress = {};
    saveProgress();
    render();
    notice.textContent = "Cartela reiniciada. Você pode começar novamente.";
  });

  function roundedRect(ctx,x,y,w,h,r) {
    const radius = Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+radius,y);
    ctx.arcTo(x+w,y,x+w,y+h,radius);
    ctx.arcTo(x+w,y+h,x,y+h,radius);
    ctx.arcTo(x,y+h,x,y,radius);
    ctx.arcTo(x,y,x+w,y,radius);
    ctx.closePath();
  }
  function loadImage(src) {
    return new Promise(resolve => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }
  async function exportImage() {
    const button = $("waBingoExport");
    button.disabled = true;
    button.textContent = "Preparando imagem…";
    try {
      const width = 1200, padding = 54, columns = 4, gap = 14;
      const cardWidth = (width - padding*2 - gap*(columns-1)) / columns;
      const cardHeight = 194;
      const rows = Math.ceil(items.length / columns);
      const height = 390 + rows * (cardHeight + gap) + padding;
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Seu navegador não conseguiu criar a imagem.");
      const bg = ctx.createLinearGradient(0,0,width,height);
      bg.addColorStop(0,"#090d20"); bg.addColorStop(.55,"#17132c"); bg.addColorStop(1,"#080b19");
      ctx.fillStyle = bg; ctx.fillRect(0,0,width,height);
      ctx.fillStyle = "#ffcc67"; ctx.fillRect(padding,48,48,6);
      ctx.fillStyle = "#f7f8ff"; ctx.font = "900 48px Arial";
      ctx.fillText("BINGO DE CAPTURA",padding,112);
      ctx.fillStyle = "#ff75b7"; ctx.font = "800 22px Arial";
      ctx.fillText("ÁREA SELVAGEM GO 2026 · 14 E 15 NOV",padding,151);
      const c = counts();
      ctx.fillStyle = "#c9d3ea"; ctx.font = "700 21px Arial";
      ctx.fillText("✦ " + c.shiny + " Shiny     💯 " + c.perfect + " Pokémon 100%     " + c.caught + "/" + c.total + " espécies marcadas",padding,204);
      ctx.fillStyle = "#97a7c8"; ctx.font = "18px Arial";
      ctx.fillText("Marcações manuais · GO Nexus",padding,240);
      const images = await Promise.all(items.map(item => loadImage(ASSET_ROOT + item.sprite + ".png")));
      for (let i=0;i<items.length;i++) {
        const item = items[i], state = stateFor(item.key);
        const col = i % columns, row = Math.floor(i / columns);
        const x = padding + col*(cardWidth+gap), y = 280 + row*(cardHeight+gap);
        roundedRect(ctx,x,y,cardWidth,cardHeight,15);
        ctx.fillStyle = state.shiny || state.perfect ? "#183334" : "#171e37";
        ctx.fill();
        ctx.strokeStyle = state.shiny ? "#e8c76d" : state.perfect ? "#73d6a3" : "#4a5270";
        ctx.lineWidth = 2; ctx.stroke();
        const img = images[i];
        if (img) {
          const size = 91, ix = x+(cardWidth-size)/2, iy = y+8;
          ctx.drawImage(img,ix,iy,size,size);
        } else {
          ctx.fillStyle = "#9fafd0"; ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
          ctx.fillText("◉",x+cardWidth/2,y+62); ctx.textAlign = "left";
        }
        ctx.fillStyle = "#f7f8ff"; ctx.font = "800 19px Arial"; ctx.textAlign = "center";
        ctx.fillText(item.name.length>22 ? item.name.slice(0,21)+"…" : item.name,x+cardWidth/2,y+122);
        ctx.font = "700 15px Arial";
        ctx.fillStyle = state.shiny ? "#ffe397" : "#8796b5";
        ctx.fillText(state.shiny ? "✦ SHINY" : "○ SHINY",x+cardWidth*.28,y+157);
        ctx.fillStyle = state.perfect ? "#9ff0c1" : "#8796b5";
        ctx.fillText(state.perfect ? "✓ 100%" : "○ 100%",x+cardWidth*.73,y+157);
        ctx.textAlign = "left";
      }
      ctx.fillStyle = "#8796b5"; ctx.font = "16px Arial";
      ctx.fillText("Lista baseada no especial da Área Selvagem GO no GO Nexus. Confira os encontros e horários no jogo.",padding,height-28);
      const blob = await new Promise(resolve => canvas.toBlob(resolve,"image/png"));
      if (!blob) throw new Error("Não foi possível gerar o PNG neste navegador.");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "go-nexus-bingo-area-selvagem-2026.png";
      document.body.append(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url),1000);
      notice.textContent = "Imagem da cartela gerada. Confira a pasta de downloads.";
    } catch (error) {
      notice.textContent = error.message || "Não foi possível exportar a cartela.";
    } finally {
      button.disabled = false;
      button.textContent = "Baixar cartela em PNG";
    }
  }
  $("waBingoExport").addEventListener("click",exportImage);
  loadData();
})();