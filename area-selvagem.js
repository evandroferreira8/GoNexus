/* GO NEXUS — Área Selvagem GO: Global 2026. Sem rastreamento nem persistência. */
(() => {
 "use strict";
 const $ = id => document.getElementById(id);
 const source = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
 const steel = [
  [10101,"Sandshrew de Alola"],[10105,"Diglett de Alola"],[81,"Magnemite"],[90,"Shellder"],
  [95,"Onix"],[137,"Porygon"],[213,"Shuckle"],[227,"Skarmory"],[299,"Nosepass"],[304,"Aron"],
  [374,"Beldum"],[393,"Piplup"],[410,"Shieldon"],[436,"Bronzor"],[448,"Lucario"],[529,"Drilbur"],
  [597,"Ferroseed"],[599,"Klink"],[10180,"Stunfisk de Galar"],[632,"Durant"],[821,"Rookidee"],[957,"Tinkatink"]
 ];
 const dragon = [
  [4,"Charmander"],[129,"Magikarp"],[147,"Dratini"],[207,"Gligar"],[328,"Trapinch"],[333,"Swablu"],
  [339,"Barboach"],[371,"Bagon"],[443,"Gible"],[602,"Tynamo"],[610,"Axew"],[631,"Heatmor"],
  [633,"Deino"],[690,"Skrelp"],[696,"Tyrunt"],[698,"Amaura"],[704,"Goomy"],[714,"Noibat"],
  [776,"Turtonator"],[782,"Jangmo-o"],[850,"Sizzlipede"],[996,"Frigibax"]
 ];
 const SWITCHES = document.querySelectorAll("[data-day]");
 const dayPanels = {sat:$("waSaturday"),sun:$("waSunday")};
 const dayTitle = $("waDayTitle");

 const mighty = {
  sat:[[10114,"Exeggutor de Alola"],[212,"Scizor"],[330,"Flygon"],[365,"Walrein"],[376,"Metagross"],[395,"Empoleon"],[462,"Magnezone"],[534,"Conkeldurr"],[612,"Haxorus"]],
  sun:[[184,"Azumarill"],[230,"Kingdra"],[306,"Aggron"],[598,"Ferrothorn"],[635,"Hydreigon"],[706,"Goodra"],[715,"Noivern"],[959,"Tinkaton"],[980,"Clodsire"]]
 };
 function renderMighty(day) {
   const rail=$("waMightyList");
   if(!rail)return;
   const cards=mighty[day].map(([id,name])=>{
     const item=document.createElement("div");item.className="wa-mighty-card";
     const image=document.createElement("img");image.src=source+id+".png";image.alt="";image.loading="lazy";image.decoding="async";image.width=69;image.height=69;
     image.addEventListener("error",()=>{image.hidden=true;});
     const title=document.createElement("b");title.textContent=name;
     item.append(image,title);
     return item;
   });
   rail.replaceChildren(...cards);
   rail.scrollLeft=0;
 }

 function setDay(day) {
  if (!dayPanels[day]) return;
  SWITCHES.forEach(btn => btn.setAttribute("aria-pressed",String(btn.dataset.day === day)));
  Object.entries(dayPanels).forEach(([key,panel]) => {panel.hidden=key!==day;});
  dayTitle.textContent = day === "sat" ? "SÁBADO • 14 NOVEMBRO" : "DOMINGO • 15 NOVEMBRO";
  renderMighty(day);
 }
 SWITCHES.forEach(btn => btn.addEventListener("click",()=>setDay(btn.dataset.day)));
 setDay("sat");
 let activeBiome = "steel", expanded = false;
 const speciesPanel = $("waSpawns"), more = $("waShowAll"), switchers = document.querySelectorAll("[data-biome]");
 function speciesCard(species) {
  const [id,name] = species;
  const article = document.createElement("article");
  article.className="wa-mon";
  article.setAttribute("role","listitem");
  const image = document.createElement("img");
  image.src = source + id + ".png";
  image.loading = "lazy";image.decoding = "async";
  image.width=78;image.height=78;image.alt="";
  image.addEventListener("error",()=>{image.hidden=true;});
  const label = document.createElement("b");
  label.textContent=name;
  article.append(image,label);
  return article;
 }
 function renderBiome() {
  const entries = activeBiome === "steel" ? steel : dragon;
  const previewCount = window.matchMedia("(max-width: 600px)").matches ? 6 : 9;
  const list = expanded ? entries : entries.slice(0,previewCount);
  speciesPanel.replaceChildren(...list.map(speciesCard));
  switchers.forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.biome === activeBiome)));
  const rest = entries.length - previewCount;
  more.hidden=rest<=0;
  more.setAttribute("aria-expanded",String(expanded));
  more.textContent = expanded ? "Mostrar menos ↑" : "Mostrar todas ("+entries.length+") ↓";
  $("waSpawnHelp").textContent = activeBiome === "steel" ?
    "Sólido como Aço · "+entries.length+" aparições temáticas previstas." :
    "Determinação de Dragão · "+entries.length+" aparições temáticas previstas.";
 }
 switchers.forEach(btn=>btn.addEventListener("click",()=>{
  if (!["steel","dragon"].includes(btn.dataset.biome))return;
  activeBiome = btn.dataset.biome;expanded=false;renderBiome();
 }));
 more.addEventListener("click",()=>{
  expanded=!expanded;renderBiome();
  if(!expanded) {
   const y = speciesPanel.getBoundingClientRect().top;
   if(y < 0) $("distritos").scrollIntoView({block:"start",behavior:"auto"});
  }
 });
 renderBiome();
 const compactPreview=window.matchMedia("(max-width: 600px)");
 if(typeof compactPreview.addEventListener==="function")compactPreview.addEventListener("change",renderBiome);
 const countdown=$("waCountdown");
 function refreshEventStatus(){
  const now=new Date();
  const start=new Date(2026,10,14,10,0,0);
  const end=new Date(2026,10,15,18,0,0);
  const day1end=new Date(2026,10,14,18,0,0);
  const day2start=new Date(2026,10,15,10,0,0);
  if(now<start){
   const days=Math.max(0,Math.ceil((start-now)/86400000));
   countdown.textContent=days+" dia"+(days===1?"":"s")+" até a expedição global";
  }else if(now<=day1end){
   countdown.textContent="O evento está acontecendo — sábado, até as 18h!";
  }else if(now<day2start){
   countdown.textContent="A próxima missão começa domingo às 10h.";
  }else if(now<=end){
   countdown.textContent="O evento está acontecendo — domingo, até as 18h!";
  }else {
   countdown.textContent="Evento global encerrado · consulte os registros oficiais.";
  }
 }
 refreshEventStatus();
 // Change only on real user actions/time tick; no network and no geolocation.
 window.setInterval(refreshEventStatus,60_000);
})();
