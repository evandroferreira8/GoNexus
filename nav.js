(() => {
  "use strict";

  const FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLSem76XFAbhD59iByOcJGgVR8tvYhuROQXgmUWOtKPatzjTGBA/viewform?usp=publish-editor";
  const TOOLS = [
    { file: "guia-busca.html", icon: "🔎", label: "Guia de Busca", desc: "Filtros e comandos de pesquisa" },
    { file: "calculadora.html", icon: "🧮", label: "Vale a Caixa?", desc: "Compare ofertas da loja" },
    { file: "efeitos-aventura.html", icon: "⚡", label: "Efeitos Aventura", desc: "Custos, duração e efeitos" },
    { file: "poeira-estelar.html", icon: "✨", label: "Poeira Estelar", desc: "Pokémon com Poeira aumentada" },
    { file: "evolucoes-especiais.html", icon: "🧬", label: "Evoluções Especiais", desc: "Pré-requisitos para evoluir" },
    { file: "formas-especiais.html", icon: "🔄", label: "Formas Especiais", desc: "Fusões e mudanças de forma" }
  ];

  const baseStyles = `
    :host, *, *::before, *::after { box-sizing: border-box; }
    :host { display:block; width:100%; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  `;

  function currentFile(){
    const file=location.pathname.split("/").filter(Boolean).pop();
    return file && file.includes(".") ? file : "index.html";
  }

  class GoNexusHeader extends HTMLElement {
    connectedCallback(){
      if(this.shadowRoot) return;
      const current=currentFile();
      const inTools=TOOLS.some(x=>x.file===current);
      const toolLinks=TOOLS.map(page=>{
        const active=current===page.file;
        return `<a href="${page.file}"${active?' class="active" aria-current="page"':''}><span class="tool-icon" aria-hidden="true">${page.icon}</span><span class="tool-copy"><strong>${page.label}</strong><small>${page.desc}</small></span></a>`;
      }).join("");
      const root=this.attachShadow({mode:"open"});
      root.innerHTML=`
        <style>
          ${baseStyles}
          header{width:100%;background:rgba(7,17,31,.97);border-bottom:1px solid #263653;box-shadow:0 8px 30px rgba(0,0,0,.18);position:relative;z-index:100}
          .bar{width:min(1180px,100%);min-height:76px;margin:0 auto;padding:13px 20px;display:flex;align-items:center;justify-content:space-between;gap:24px}
          .identity{flex:0 0 auto;min-width:0}.brand{display:inline-block;color:#f8fafc;text-decoration:none;font-size:1.18rem;font-weight:900;line-height:1.1;letter-spacing:.035em}.brand .nexus{background:linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 8px rgba(139,92,246,.20))}.subtitle{margin-top:5px;color:#94a3b8;font-size:.78rem;font-weight:500;line-height:1.35;white-space:nowrap}
          nav{display:flex;align-items:center;justify-content:flex-end;gap:7px;min-width:0}.navlink,summary{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:8px 11px;border:1px solid #2d3b55;border-radius:11px;background:transparent;color:#cbd5e1;text-decoration:none;font-size:.82rem;font-weight:800;line-height:1.2;white-space:nowrap;cursor:pointer;transition:.18s}.navlink:hover,summary:hover{background:#111b30;border-color:#415374;color:#fff}.navlink.active,details.toolmenu.active>summary{background:#141e34;border-color:#435777;color:#fff;box-shadow:0 0 18px rgba(56,189,248,.12)}.navlink:focus-visible,summary:focus-visible,.menu a:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}
          details{position:relative}summary{list-style:none}summary::-webkit-details-marker{display:none}.chev{font-size:.7rem;color:#7f91ad;transition:transform .18s}details[open] .chev{transform:rotate(180deg)}
          .menu{position:absolute;right:0;top:calc(100% + 9px);width:330px;padding:8px;border:1px solid #30415f;border-radius:16px;background:#091426;box-shadow:0 20px 50px rgba(0,0,0,.42);display:grid;gap:4px}.menu::before{content:"";position:absolute;top:-6px;right:35px;width:11px;height:11px;background:#091426;border-left:1px solid #30415f;border-top:1px solid #30415f;transform:rotate(45deg)}.menu a{position:relative;display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;color:#cbd5e1;text-decoration:none;border:1px solid transparent}.menu a:hover{background:#101e35;border-color:#263b5c;color:white}.menu a.active{background:linear-gradient(135deg,rgba(37,99,235,.18),rgba(124,58,237,.16));border-color:#3b5076;color:white}.tool-icon{width:24px;text-align:center;font-size:1.05rem}.tool-copy{display:grid;gap:2px}.tool-copy strong{font-size:.8rem}.tool-copy small{font-size:.67rem;color:#7f91ad;font-weight:600}
          @media(max-width:760px){.bar{align-items:flex-start;flex-direction:column;gap:13px;padding:16px 14px}.subtitle{white-space:normal}.nav{width:100%;justify-content:flex-start;flex-wrap:wrap}.menu{left:0;right:auto;width:min(330px,calc(100vw - 28px))}.menu::before{left:90px;right:auto}}
          @media(max-width:420px){.brand{font-size:1.08rem}.subtitle{font-size:.75rem}.navlink,summary{min-height:35px;padding:7px 9px;font-size:.78rem}.menu a{padding:9px 10px}}
        </style>
        <header>
          <div class="bar">
            <div class="identity"><a class="brand" href="index.html" aria-label="GO Nexus — Início">GO <span class="nexus">NEXUS</span></a><div class="subtitle">Guias e ferramentas para sua jornada no Pokémon GO</div></div>
            <nav class="nav" aria-label="Navegação principal">
              <a class="navlink${current==='index.html'?' active':''}" href="index.html"${current==='index.html'?' aria-current="page"':''}>🏠 <span>Início</span></a>
              <details class="toolmenu${inTools?' active':''}"><summary>🧰 <span>Ferramentas</span> <span class="chev">▼</span></summary><div class="menu">${toolLinks}</div></details>
              <a class="navlink" href="${FEEDBACK}" target="_blank" rel="noopener noreferrer">💬 <span>Feedback</span></a>
            </nav>
          </div>
        </header>`;
      const details=root.querySelector('details');
      root.addEventListener('keydown',e=>{if(e.key==='Escape'&&details.open){details.open=false;details.querySelector('summary').focus();}});
      document.addEventListener('click',e=>{if(details.open && !this.contains(e.target) && !details.contains(e.composedPath()[0])) details.open=false;});
    }
  }

  class GoNexusFooter extends HTMLElement {
    connectedCallback(){
      if(this.shadowRoot) return;
      const root=this.attachShadow({mode:"open"});
      root.innerHTML=`<style>${baseStyles}footer{width:100%;margin:48px 0 0;border-top:1px solid #182238;background:transparent;color:#718096;text-align:center}.inner{width:min(1180px,100%);margin:0 auto;padding:24px 20px 32px;font-size:.78rem;font-weight:500;line-height:1.65}strong{color:#94a3b8;font-weight:800}.line{margin:0}@media(max-width:560px){footer{margin-top:38px}.inner{padding:21px 14px 27px;font-size:.72rem;line-height:1.7}}</style><footer><div class="inner"><p class="line"><strong>GO Nexus</strong></p><p class="line">Desenvolvido por <strong>DelorisNyx</strong> · Código de amizade: <strong>8596 0928 0640</strong></p><p class="line">© 2026 · Todos os direitos reservados.</p><p class="line">Projeto independente e não oficial. Pokémon e Pokémon GO pertencem aos seus respectivos titulares.</p></div></footer>`;
    }
  }

  if(!customElements.get('go-nexus-header')) customElements.define('go-nexus-header',GoNexusHeader);
  if(!customElements.get('go-nexus-footer')) customElements.define('go-nexus-footer',GoNexusFooter);
})();
