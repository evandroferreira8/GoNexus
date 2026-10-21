/* Central Max | Painéis visuais: arte local da Pokédex, busca e expansão. */
(() => {
 "use strict";
 const speciesDex = {"bulbasaur":1,"charmander":4,"squirtle":7,"caterpie":10,"pikachu":25,"growlithe":58,"abra":63,"machop":66,"gastly":92,"krabby":98,"hitmonlee":106,"hitmonchan":107,"rhyhorn":111,"chansey":113,"electabuzz":125,"eevee":133,"omanyte":138,"kabuto":140,"articuno":144,"zapdos":145,"moltres":146,"hoothoot":163,"shuckle":213,"hitmontop":237,"raikou":243,"entei":244,"suicune":245,"lugia":249,"hooh":250,"ralts":280,"sableye":302,"wailmer":320,"trapinch":328,"beldum":374,"regirock":377,"regice":378,"registeel":379,"latias":380,"latios":381,"combee":415,"pidove":519,"roggenrola":524,"woobat":527,"drilbur":529,"darumaka":554,"trubbish":568,"cryogonal":615,"deino":633,"inkay":686,"bounsweet":761,"passimian":766,"drampa":780,"grookey":810,"scorbunny":813,"sobble":816,"skwovet":819,"rookidee":821,"wooloo":831,"toxtricity":849,"hatenna":856,"falinks":870,"duraludon":884,"kubfu":891,"sneasel":215,"sizzlipede":850,"uxie":480,"mesprit":481,"azelf":482,"venusaur":3,"charizard":6,"blastoise":9,"butterfree":12,"meowth":52,"machamp":68,"gengar":94,"kingler":99,"lapras":131,"snorlax":143,"rillaboom":812,"cinderace":815,"inteleon":818,"grimmsnarl":861,"garbodor":569,"melmetal":809,"corviknight":823,"orbeetle":826,"drednaw":834,"coalossal":839,"flapple":841,"appletun":842,"sandaconda":844,"centiskorch":851,"hatterene":858,"alcremie":869,"copperajah":879,"urshifu":892};
 const maxForms = {"venusaur":10195,"charizard":10196,"blastoise":10197,"butterfree":10198,"pikachu":10199,"meowth":10200,"machamp":10201,"gengar":10202,"kingler":10203,"lapras":10204,"eevee":10205,"snorlax":10206,"garbodor":10207,"melmetal":10208,"rillaboom":10209,"cinderace":10210,"inteleon":10211,"corviknight":10212,"orbeetle":10213,"drednaw":10214,"coalossal":10215,"flapple":10216,"appletun":10217,"sandaconda":10218,"toxtricity":10228,"centiskorch":10220,"hatterene":10221,"grimmsnarl":10222,"alcremie":10223,"copperajah":10224,"duraludon":10225,"urshifugolpedecisivo":10226,"urshifugolpefluido":10227};
 const spriteRoot = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
 const normalize = s => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
 const $ = id => document.getElementById(id);
 const groups = [
  {id:"dynAvailableBox",list:"dynAvailableList",count:"dynAvailableCount",status:"dynAvailableStatus",more:"dynAvailableMore",tone:"dynamax",records:DYNAMAX.map(chain=>{
    const base=chain.split(" → ")[0].replace(/\s*\(.*/,"").trim();
    return {name:base,detail:chain.includes(" → ") ? chain.substring(base.length).replace(/^\s*→\s*/,"").trim() : (chain.includes("(") ? chain.slice(base.length).trim() : ""),search:chain,id:speciesDex[normalize(base)],form:null};
  }),limit:12},
  {id:"dynFutureBox",list:"dynFutureList",count:"dynFutureCount",status:"dynFutureStatus",more:"dynFutureMore",tone:"future",records:FUTURE.map(v=>({name:v.name,detail:v.note,search:v.name+" "+v.note,id:speciesDex[normalize(v.name)],form:null})),limit:6},
  ...[
   {id:"gAvailableBox",list:"gAvailableList",count:"gAvailableCount",status:"gAvailableStatus",more:"gAvailableMore",tone:"gigamax",values:G_AVAILABLE},
   {id:"gUnavailableBox",list:"gUnavailableList",count:"gUnavailableCount",status:"gUnavailableStatus",more:"gUnavailableMore",tone:"unreleased",values:G_UNAVAILABLE}
  ].map(c=>({...c,limit:8,records:c.values.map(n=>{
    let name=n,detail="";
    if(n.startsWith("Urshifu — ")){name="Urshifu";detail=n.slice("Urshifu — ".length)}
    return {name,detail,search:"Gigamax "+n,id:speciesDex[normalize(name)],form:maxForms[normalize(n)]||maxForms[normalize(name)]||null};
  })}))
 ];
 const expanded={};
 groups.forEach(g=>{
   expanded[g.id]=false;
   const button=$(g.more);
   if(!button)throw new Error("Missing show-more control "+g.more);
   button.addEventListener("click",()=>{
     expanded[g.id]=!expanded[g.id];
     renderLists();
     button.focus({preventScroll:true});
   });
 });
 function createCard(r,g){
   const li=document.createElement("li");
   const card=document.createElement("div");card.className="mx3-species-card";
   const media=document.createElement("span");media.className="mx3-species-art";
   const img=document.createElement("img");
   img.width=69;img.height=69;img.loading="lazy";img.decoding="async";img.alt="";
   img.src=spriteRoot+(r.form||r.id)+".png";
   img.addEventListener("error",()=>{
     const fallback=spriteRoot+r.id+".png";
     if(img.src!==fallback && r.id){img.src=fallback;}else{img.hidden=true;media.textContent="◌";}
   });
   media.append(img);
   const info=document.createElement("span");info.className="mx3-species-copy";
   const number=document.createElement("span");number.className="mx3-species-no";
   number.textContent=r.id?"#"+String(r.id).padStart(4,"0"):"POKÉMON";
   const title=document.createElement("strong");title.className="mx3-species-name";title.textContent=r.name;
   info.append(number,title);
   if(r.detail){
     const detail=document.createElement("span");detail.className="mx3-species-sub";
     detail.textContent=(g.tone==="dynamax" && r.search.includes(" → ")?"Evolução: ":"")+r.detail;
     info.append(detail);
   }
   card.append(media,info);li.append(card);return li;
 }
 function renderLists(){
   const input=$("search");
   const query=normalize(input?.value?.trim()||"");
   let totalMatches=0;
   groups.forEach(group=>{
     const list=$(group.list),details=$(group.id),count=$(group.count),status=$(group.status),more=$(group.more);
     if(!list||!details||!count||!status||!more)return;
     const found=group.records.filter(r=>!query||normalize(r.search+" "+r.name+" "+r.detail).includes(query));
     totalMatches+=found.length;
     const all=query||expanded[group.id]||found.length<=group.limit;
     const visible=all?found:found.slice(0,group.limit);
     const nodes=visible.map(r=>createCard(r,group));
     list.replaceChildren(...nodes);
     if(!found.length){
       const empty=document.createElement("li");empty.className="mx3-no-results";
       empty.textContent=query?"Nenhum Pokémon desta lista corresponde à pesquisa.":"Nenhum Pokémon registrado nesta lista.";
       list.append(empty);
     }
     const total=group.records.length;
     count.textContent=query?found.length+"/"+total:String(total);
     status.textContent=query?
       found.length+" resultado"+(found.length===1?"":"s")+" nesta lista":
       (visible.length===total?total+" Pokémon exibidos":"Exibindo "+visible.length+" de "+total+" Pokémon");
     more.hidden=Boolean(query)||found.length<=group.limit;
     more.setAttribute("aria-expanded",String(expanded[group.id]));
     more.querySelector(".mx3-more-text").textContent=expanded[group.id]?"Mostrar menos":"Mostrar todos os "+total;
     if(query)details.open=found.length>0;
   });
   window.maxHubMatches=totalMatches;
 }
 window.maxHubRender=renderLists;
 renderLists();
 document.querySelectorAll(".mx3-reference details.mx3-accordion").forEach(details=>{
   details.addEventListener("toggle",()=>{
     const pressed=details.open;
     document.querySelectorAll('.mx3-shortcut').forEach(btn=>{
       if(btn.dataset.show===details.id)btn.setAttribute("aria-pressed",String(pressed));
     });
   });
 });
})();
