/* CENTRAL MAX 3.0 | Assistência visual progressiva, sem dependências. */
(() => {
  "use strict";
  const roles = {
    attack: {
      title: "Causar dano",
      description: "Priorize um Pokémon Max com ataque de tipo favorável ao chefe. O tipo do Ataque Max comum depende do Ataque Ágil.",
      examples: [{id:376,name:"Metagross"},{id:530,name:"Excadrill"},{id:6,name:"Charizard"}]
    },
    defense: {
      title:"Resistir à batalha",
      description:"Um Pokémon resistente ajuda a suportar golpes enquanto a equipe prepara a próxima fase Max. Guarda Max reduz o dano recebido.",
      examples:[{id:242,name:"Blissey"},{id:832,name:"Dubwool"},{id:143,name:"Snorlax"}]
    },
    healing: {
      title:"Apoiar o grupo",
      description:"Espírito Max recupera PS dos aliados. Uma boa escolha de apoio também precisa sobreviver ao tipo de ataque do chefe.",
      examples:[{id:242,name:"Blissey"},{id:131,name:"Lapras"},{id:3,name:"Venusaur"}]
    }
  };
  const sprites = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const buttons=[...document.querySelectorAll(".mx3-role-button")];
  const panel=document.getElementById("mx3RolePanel");
  function showRole(key){
    const info=roles[key]||roles.attack;
    buttons.forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.role===key)));
    document.getElementById("mx3RoleTitle").textContent=info.title;
    document.getElementById("mx3RoleDescription").textContent=info.description;
    const grid=document.getElementById("mx3RoleExamples");
    grid.replaceChildren();
    info.examples.forEach(ex=>{
      const item=document.createElement("div");item.className="mx3-example";
      const pic=document.createElement("img");pic.src=sprites+ex.id+".png";pic.alt="";pic.width=47;pic.height=47;pic.loading="lazy";
      const name=document.createElement("span");name.className="mx3-example-name";name.textContent=ex.name;
      item.append(pic,name);grid.append(item);
    });
    panel.dataset.role=key;
  }
  buttons.forEach(b=>b.addEventListener("click",()=>showRole(b.dataset.role)));
  showRole("attack");
  const search=document.getElementById("search");
  const clear=document.getElementById("mx3ClearSearch");
  const status=document.getElementById("mx3SearchStatus");
  function updateStatus(){
    const q=search.value.trim();
    clear.hidden=!q;
    if(!q){status.textContent="Escolha uma lista ou pesquise pelo nome.";return}
    const lists=["dynAvailableList","dynFutureList","gAvailableList","gUnavailableList"];
    const found=Number.isFinite(window.maxHubMatches) ? window.maxHubMatches : lists.reduce((n,id)=>n+document.getElementById(id).children.length,0);
    status.textContent=found?found+" resultado"+(found===1?"":"s")+" encontrado"+(found===1?"":"s")+".":"Nenhuma correspondência nesta base. Tente outro nome.";
  }
  search.addEventListener("input",updateStatus);
  clear.addEventListener("click",()=>{search.value="";search.dispatchEvent(new Event("input",{bubbles:true}));search.focus();});
  document.querySelectorAll(".mx3-shortcut").forEach(btn=>btn.addEventListener("click",()=>{
    const selected=btn.dataset.show;
    if(search.value.trim()) { search.value=""; search.dispatchEvent(new Event("input",{bubbles:true})); }
    ["dynAvailableBox","dynFutureBox","gAvailableBox","gUnavailableBox"].forEach(id=>{
      document.getElementById(id).open=id===selected;
    });
    document.getElementById(selected).scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
    if(selected==="dynAvailableBox"||selected==="gAvailableBox")search.focus({preventScroll:true});
  }));
  updateStatus();
})();
