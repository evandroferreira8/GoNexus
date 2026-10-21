/* GO Nexus — Pesquisa bidirecional: nomes ↔ Pokédex. Funciona localmente. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const byId = new Map(), byName = new Map();
  const input = $("namesInput"), sample = $("sampleBtn"), clear = $("clearBtn");
  const copy = $("copyBtn"), copyLabel = $("copyLabel"), output = $("searchOutput");
  const count = $("resultCount"), ready = $("dataStatus");
  const matches = $("matchesPanel"), matchList = $("matchList"), matchCount = $("matchesCount");
  const errorsBox = $("issuesBox"), errorsTitle = $("issuesTitle"), errorsList = $("issuesList");
  const formsNote = $("formsNote"), inputLabel = $("gpInputLabel");
  const outputCaption = $("gpOutputCaption"), resultTitle = $("gpResultTitle");
  const spotlight = $("lookupSpotlight"), spotNumber = $("spotNumber"), spotName = $("spotName");
  const bottomHint = $("gpBottomHint"), inputHelp = $("gp-input-help");
  const modes = [...document.querySelectorAll(".gp-mode-btn")];
  const examples = {
    search: "Palkia Origin\nReshiram\nXerneas\nDialga Origin\nLugia\nLunala\nZekrom\nHo-oh",
    reverse: "484\n643\n716\n483\n249\n792\n644\n250"
  };
  let mode = "search", drafts = {search:"",reverse:""}, latestCopy = "";
  const fallback = {
    1:["Bulbasaur"],25:["Pikachu"],29:["Nidoran♀"],32:["Nidoran♂"],83:["Farfetch'd"],
    122:["Mr. Mime"],150:["Mewtwo"],249:["Lugia"],250:["Ho-Oh"],439:["Mime Jr."],
    483:["Dialga"],484:["Palkia"],643:["Reshiram"],644:["Zekrom"],716:["Xerneas"],
    772:["Type: Null"],792:["Lunala"],865:["Sirfetch'd"],866:["Mr. Rime"],1025:["Pecharunt"]
  };
  const normalize = (s) => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().replace(/♀/g,"female").replace(/♂/g,"male").replace(/[^a-z0-9]/g,"");
  const formRx = /\b(origin(?:e)?|origem|originaria|originario|forme?|formas?|altered|alterada|alternada|mega|primal|primordial|shiny|brilhante|shadow|sombrio|purified|purificado|alolan|alola|galarian|galar|hisuian|hisui|paldean|paldea|gigantamax|gigamax|dynamax|dinamax)\b/gi;
  function addIndex(id, names) {
    id = Number(id);
    if (!Number.isInteger(id) || id<1 || id>1025 || !Array.isArray(names) || !names[0]) return;
    const record = {id, name:names[0]};
    byId.set(id, record);
    for(const name of names){const key=normalize(name);if(key&&!byName.has(key))byName.set(key,record)}
  }
  Object.entries(fallback).forEach(([id,names]) => addIndex(id,names));
  function addAliases(){
    const extra = {"nidoranf":29,"nidoranm":32,"nidoranfemale":29,"nidoranmale":32,"mimejr":439,
      "mrmime":122,"mrrime":866,"farfetchd":83,"sirfetchd":865,"hooh":250,"typenull":772};
    Object.entries(extra).forEach(([name,id])=>{if(byId.has(id))byName.set(normalize(name),byId.get(id))});
  }
  addAliases();
  function splitEntries(str){
    return String(str||"").split(/[\r\n,;|]+/).map(s=>s.trim()
      .replace(/^\s*(?:[-*•–]|\d+[.)])\s+/, "")
      .replace(/^[«“"'‘]+|[»”"'’]+$/g, "").trim()).filter(Boolean);
  }
  function splitNumbers(str){
    return String(str||"").split(/[\s,;|]+/).map(s=>s.trim().replace(/^\s*[#№]/,"")).filter(Boolean);
  }
  function resolve(raw){
    const candidate=raw.trim().replace(/^pok[eé]dex\s*#?\s*/i,"").trim();
    const matched=candidate.match(/^#?0*(\d{1,4})$/);
    if(matched){const x=byId.get(Number(matched[1]));return x?{...x,qualified:false}:null}
    const exact=byName.get(normalize(candidate));
    if(exact)return {...exact,qualified:false};
    const cleaned=candidate.replace(formRx," ").replace(/[()[\]{}]/g," ").replace(/\s+/g," ").trim();
    if(cleaned===candidate||!cleaned)return null;
    const record=byName.get(normalize(cleaned));
    return record?{...record,qualified:true}:null;
  }
  function pill(record) {
    const el=document.createElement("span");el.className="gp-pill";
    const no=document.createElement("span");no.className="gp-pill-no";
    no.textContent="#"+String(record.id).padStart(4,"0");
    const name=document.createElement("span");name.textContent=record.name;
    el.append(no,name);
    if(record.qualified){
      const tag=document.createElement("span");tag.className="gp-pill-note";tag.textContent="forma";el.append(tag);
    }
    return el;
  }
  function render(){
    const raw=input.value.trim();
    drafts[mode]=input.value;
    clear.disabled=!raw;
    const entries=(mode==="reverse"?splitNumbers(raw):splitEntries(raw));
    const found=new Map(), unknown=[];
    for(const part of entries.slice(0,200)){
      let record;
      if(mode==="reverse"){
        const matched=part.match(/^0*(\d{1,4})$/);
        const hit=matched?byId.get(Number(matched[1])):null;
        record=hit?{...hit,qualified:false}:null;
      }else record=resolve(part);
      if(!record){unknown.push(part);continue}
      if(found.has(record.id)){if(record.qualified)found.get(record.id).qualified=true;}
      else found.set(record.id,record);
    }
    const selected=[...found.values()];
    const isReverse=mode==="reverse", isSingle=isReverse&&selected.length===1;
    latestCopy=isReverse?selected.map(p=>p.name).join(", "):selected.map(p=>p.id).join(",");
    output.textContent=latestCopy||(isReverse?"O nome aparece aqui.":"Sua pesquisa aparece aqui.");
    output.hidden=isSingle;
    output.classList.toggle("empty",!latestCopy);
    spotlight.hidden=!isSingle;
    if(isSingle){
      spotNumber.textContent="#"+String(selected[0].id).padStart(4,"0");
      spotName.textContent=selected[0].name;
    }
    count.textContent=selected.length+" Pokémon";
    copy.disabled=!latestCopy;
    copyLabel.textContent=isReverse?"Copiar nomes":"Copiar pesquisa";
    matches.hidden=!selected.length||isSingle;
    matchCount.textContent=selected.length+(selected.length===1?" identificado":" identificados");
    matchList.replaceChildren(...selected.map(pill));
    const extra=entries.length>200;
    errorsBox.hidden=!unknown.length&&!extra;
    if(unknown.length||extra){
      errorsTitle.textContent=unknown.length ? unknown.length+(unknown.length===1?
        (isReverse?" número não encontrado":" nome não encontrado"):
        (isReverse?" números não encontrados":" nomes não encontrados")) : "Lista longa";
      errorsList.textContent=unknown.slice(0,12).join(" · ")+(unknown.length>12?" · …":"")+
        (extra?" · Limite de 200 por vez.":"");
    }
    formsNote.hidden=isReverse||!selected.some(p=>p.qualified);
  }
  function setMode(next){
    if(next===mode)return;
    drafts[mode]=input.value;
    mode=next;
    document.querySelectorAll(".gp-mode-btn").forEach(btn=>{
      const active=btn.dataset.mode===mode;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
    });
    const reverse=mode==="reverse";
    inputLabel.textContent=reverse?"Números da Pokédex":"Nomes ou números da Pokédex";
    input.placeholder=reverse?"484, 643, 716\nou\n#0025": "Palkia Origin\nReshiram\nXerneas\nDialga Origin\nLugia";
    inputHelp.textContent=reverse?"Separe números por vírgula, espaço ou linha.":"Uma linha por Pokémon ou separados por vírgulas.";
    resultTitle.textContent=reverse?"Pokémon identificados":"Pronto para o jogo";
    outputCaption.textContent=reverse?"NOMES DOS POKÉMON":"SEQUÊNCIA DE PESQUISA";
    sample.textContent=reverse?"Ver exemplo ↗":"Ver exemplo ↗";
    bottomHint.textContent=reverse?"Nº 484 = Palkia. Nº 483 = Dialga.":"Onde colar? Pokémon GO → Armazenamento → Lupa.";
    input.value=drafts[mode];
    render();
  }
  modes.forEach(btn=>btn.addEventListener("click",()=>setMode(btn.dataset.mode)));
  input.addEventListener("input",render);
  sample.addEventListener("click",()=>{input.value=examples[mode];render();input.focus();});
  clear.addEventListener("click",()=>{input.value="";render();input.focus();});
  copy.addEventListener("click",async()=>{
    if(!latestCopy)return;
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(latestCopy);
      else{
        const el=document.createElement("textarea");el.value=latestCopy;el.style.position="fixed";el.style.top="-9999px";
        document.body.appendChild(el);el.focus();el.select();
        const success=document.execCommand("copy");el.remove();if(!success)throw Error("Não foi possível copiar");
      }
      copyLabel.textContent=mode==="reverse"?"Nomes copiados!":"Copiado! Abra o Pokémon GO";
    }catch(e){copyLabel.textContent="Não foi possível copiar. Selecione o resultado acima.";}
  });
  render();
  fetch("dex-index.json",{cache:"force-cache"}).then(response=>{
    if(!response.ok)throw Error("Pokédex indisponível");
    return response.json();
  }).then(data=>{
    if(!data||typeof data!=="object"||Object.keys(data).length<1025)throw Error("Dados incompletos");
    Object.entries(data).forEach(([id,names])=>addIndex(id,names));
    addAliases();
    ready.classList.add("ready");
    ready.lastChild.textContent=" Pokédex pronta · 1.025 espécies";
    render();
  }).catch(()=>{
    ready.lastChild.textContent=" Base reduzida disponível. Recarregue para buscar todos.";
    render();
  });
})();
