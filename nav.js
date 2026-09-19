(() => {
  "use strict";

  const FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLSem76XFAbhD59iByOcJGgVR8tvYhuROQXgmUWOtKPatzjTGBA/viewform?usp=publish-editor";
  const TOOLS = [
    { file: "guia-busca.html", icon: "🔎", label: "Guia de Busca", desc: "Filtros e comandos de pesquisa" },
    { file: "calculadora.html", icon: "🧮", label: "Vale a Caixa?", desc: "Compare ofertas da loja" },
    { file: "efeitos-aventura.html", icon: "⚡", label: "Efeitos Aventura", desc: "Custos, duração e efeitos" },
    { file: "poeira-estelar.html", icon: "✨", label: "Poeira Estelar", desc: "Pokémon com Poeira aumentada" },
    { file: "evolucoes-especiais.html", icon: "🧬", label: "Evoluções Especiais", desc: "Pré-requisitos para evoluir" },
    { file: "formas-especiais.html", icon: "🔄", label: "Formas e Variações", desc: "Fusões, formas e Shinies" },
    { file: "central-mega.html", icon: "🔷", label: "Central Mega", desc: "Megas, energia e Meganíveis" },
    { file: "central-max.html", icon: "🔴", label: "Central Max", desc: "Dinamax, Gigamax e Max" },
    { file: "tipagens.html", icon: "🛡️", label: "Tipagens", desc: "Fortes, fracos e resistências" },
    { file: "pokeparadas.html", icon: "📍", label: "Poképaradas", desc: "Como solicitar sem complicar" }
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
          .bar{width:min(1180px,100%);min-height:78px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:24px}
          .identity{flex:0 0 auto;min-width:0}.brand{display:inline-block;color:#f8fafc;text-decoration:none;font-size:1.2rem;font-weight:900;line-height:1.1;letter-spacing:.035em}.brand .nexus{background:linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 8px rgba(139,92,246,.20))}.subtitle{margin-top:6px;color:#94a3b8;font-size:.82rem;font-weight:520;line-height:1.4;white-space:nowrap}
          nav{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0}.navlink,summary{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:8px 12px;border:1px solid #2d3b55;border-radius:12px;background:transparent;color:#cbd5e1;text-decoration:none;font-size:.84rem;font-weight:800;line-height:1.2;white-space:nowrap;cursor:pointer;transition:.18s}.navlink:hover,summary:hover{background:#111b30;border-color:#415374;color:#fff}.navlink.active,details.toolmenu.active>summary{background:#141e34;border-color:#435777;color:#fff;box-shadow:0 0 18px rgba(56,189,248,.12)}.navlink:focus-visible,summary:focus-visible,.menu a:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}
          details{position:relative}summary{list-style:none}summary::-webkit-details-marker{display:none}.chev{font-size:.7rem;color:#7f91ad;transition:transform .18s}details[open] .chev{transform:rotate(180deg)}
          .menu{position:absolute;right:0;top:calc(100% + 9px);width:350px;max-height:min(70vh,620px);overflow:auto;padding:8px;border:1px solid #30415f;border-radius:16px;background:#091426;box-shadow:0 20px 50px rgba(0,0,0,.42);display:grid;gap:4px}.menu::before{content:"";position:absolute;top:-6px;right:35px;width:11px;height:11px;background:#091426;border-left:1px solid #30415f;border-top:1px solid #30415f;transform:rotate(45deg)}.menu a{position:relative;display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;color:#cbd5e1;text-decoration:none;border:1px solid transparent}.menu a:hover{background:#101e35;border-color:#263b5c;color:white}.menu a.active{background:linear-gradient(135deg,rgba(37,99,235,.18),rgba(124,58,237,.16));border-color:#3b5076;color:white}.tool-icon{width:24px;text-align:center;font-size:1.05rem}.tool-copy{display:grid;gap:2px}.tool-copy strong{font-size:.82rem}.tool-copy small{font-size:.69rem;color:#7f91ad;font-weight:600}
          @media(max-width:760px){.bar{align-items:flex-start;flex-direction:column;gap:13px;padding:16px 14px}.subtitle{white-space:normal;font-size:.84rem}.nav{width:100%;justify-content:flex-start;flex-wrap:wrap}.menu{left:0;right:auto;width:min(350px,calc(100vw - 28px))}.menu::before{left:90px;right:auto}}
          @media(max-width:420px){.brand{font-size:1.18rem}.subtitle{font-size:.82rem}.navlink,summary{min-height:40px;padding:8px 10px;font-size:.82rem}.menu a{padding:10px 10px}}
        </style>
        <header>
          <div class="bar">
            <div class="identity"><a class="brand" href="index.html" aria-label="GO Nexus — Início">GO <span class="nexus">NEXUS</span></a><div class="subtitle">Guias e ferramentas para sua jornada no Pokémon GO</div></div>
            <nav class="nav" aria-label="Navegação principal">
              <a class="navlink${current==='index.html'?' active':''}" href="index.html"${current==='index.html'?' aria-current="page"':''}>🏠 <span>Início</span></a>
              <details class="toolmenu${inTools?' active':''}"><summary>🧰 <span>Ferramentas</span> <span class="chev">▼</span></summary><div class="menu">${toolLinks}</div></details>
              <a class="navlink${current==='quiz.html'?' active':''}" href="quiz.html"${current==='quiz.html'?' aria-current="page"':''}>🎮 <span>Quiz</span></a>
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
      root.innerHTML=`<style>${baseStyles}footer{width:100%;margin:48px 0 0;border-top:1px solid #182238;background:transparent;color:#718096;text-align:center}.inner{width:min(1180px,100%);margin:0 auto;padding:24px 20px 32px;font-size:.85rem;font-weight:500;line-height:1.68}strong{color:#94a3b8;font-weight:800}.line{margin:0}@media(max-width:560px){footer{margin-top:38px}.inner{padding:21px 14px 27px;font-size:.82rem;line-height:1.72}}</style><footer><div class="inner"><p class="line"><strong>GO Nexus</strong></p><p class="line">Desenvolvido por <strong>DelorisNyx</strong> · Código de amizade: <strong>8596 0928 0640</strong></p><p class="line">© 2026 · Todos os direitos reservados.</p><p class="line">Projeto independente e não oficial. Pokémon e Pokémon GO pertencem aos seus respectivos titulares.</p></div></footer>`;
    }
  }

  if(!customElements.get('go-nexus-header')) customElements.define('go-nexus-header',GoNexusHeader);
  if(!customElements.get('go-nexus-footer')) customElements.define('go-nexus-footer',GoNexusFooter);

  if(!document.getElementById('go-nexus-shared-ui')){
    const style=document.createElement('style');
    style.id='go-nexus-shared-ui';
    style.textContent=`
      details.nx-accordion{border:1px solid #263653;border-radius:16px;background:rgba(9,20,36,.82);overflow:hidden;box-shadow:0 10px 28px rgba(0,0,0,.10);transition:border-color .18s,box-shadow .18s,background .18s}
      details.nx-accordion+details.nx-accordion{margin-top:9px}
      details.nx-accordion[open]{border-color:#3c5276;background:rgba(10,23,41,.94);box-shadow:0 0 0 1px rgba(56,189,248,.025),0 14px 34px rgba(0,0,0,.15),0 0 24px rgba(56,189,248,.045)}
      details.nx-accordion>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:58px;padding:13px 16px;color:#e6edf7;font:800 .93rem/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;user-select:none}
      details.nx-accordion>summary::-webkit-details-marker{display:none}
      details.nx-accordion>summary:hover{background:rgba(255,255,255,.018)}
      details.nx-accordion>summary:focus-visible{outline:2px solid #38bdf8;outline-offset:-2px}
      .nx-summary-main{display:flex;align-items:center;gap:10px;min-width:0}.nx-summary-copy{min-width:0}.nx-summary-title{display:block;color:#eef5ff}.nx-summary-sub{display:block;margin-top:2px;color:#71849d;font-size:.77rem;font-weight:650;white-space:normal}
      .nx-summary-side{display:flex;align-items:center;gap:9px;flex:0 0 auto}.nx-count{display:inline-flex;align-items:center;justify-content:center;min-width:31px;padding:4px 8px;border:1px solid #30435f;border-radius:999px;background:#071526;color:#91a5bf;font-size:.71rem;font-weight:900}.nx-chevron{width:24px;height:24px;display:grid;place-items:center;border-radius:8px;color:#7288a6;transition:transform .18s,color .18s;background:rgba(255,255,255,.025)}details.nx-accordion[open] .nx-chevron{transform:rotate(180deg);color:#7dd3fc}
      .nx-body{padding:0 16px 16px;border-top:1px solid rgba(47,65,94,.55)}.nx-body>.nx-body-intro{margin:14px 0 12px;color:#8fa2ba;font-size:.84rem;line-height:1.62}
      .nx-pills{display:flex;flex-wrap:wrap;gap:7px;padding-top:12px}.nx-pill{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid #293d59;border-radius:999px;background:#081629;color:#c5d1df;font-size:.78rem;font-weight:780;line-height:1.25}.nx-pill strong{color:#fff}.nx-pill.good{border-color:rgba(52,211,153,.24);background:rgba(52,211,153,.055);color:#9deec8}.nx-pill.future{border-color:rgba(250,204,21,.22);background:rgba(250,204,21,.055);color:#f5d76e}.nx-pill.muted{color:#8497ae;background:#081321}
      .nx-compact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;padding-top:12px}.nx-compact-item{padding:10px 11px;border:1px solid #263a57;border-radius:12px;background:#081526;color:#cbd7e6;font-size:.79rem;line-height:1.48}.nx-compact-item b{color:#fff}.nx-note{margin-top:10px;padding:10px 12px;border-left:2px solid #49658f;border-radius:0 9px 9px 0;background:rgba(59,130,246,.055);color:#8fa2ba;font-size:.79rem;line-height:1.57}
      @media(max-width:560px){details.nx-accordion>summary{min-height:54px;padding:12px 13px;gap:9px;font-size:.9rem}.nx-summary-sub{display:none}.nx-body{padding:0 13px 13px}.nx-count{padding:3px 7px}.nx-compact-grid{grid-template-columns:1fr}.nx-pill{font-size:.76rem}}
    `;
    document.head.appendChild(style);
  }



  // Acessibilidade móvel do GO Nexus: texto legível, alvos de toque confortáveis e menos espaço desperdiçado.
  if(!document.getElementById('go-nexus-mobile-a11y')){
    const a11y=document.createElement('style');
    a11y.id='go-nexus-mobile-a11y';
    a11y.textContent=`
      :focus-visible{outline:2px solid #38bdf8!important;outline-offset:2px}
      @media(max-width:700px){
        html{font-size:18px;-webkit-text-size-adjust:100%;text-size-adjust:100%}
        body{line-height:1.6}
        main p, main li, main .lead, main .intro, main .info, main .explain, main .details, main .note, main .brasil-note{font-size:max(.89rem,16px)!important;line-height:1.62!important}
        main label, main small, main .updated, main .meta, main .mini, main .searchhint, main .hint, main .footnote, main .kind, main .tag, main .cost, main .remain, main .group-count, main .quick-values span{font-size:max(.78rem,14px)!important;line-height:1.45!important}
        main button, main input, main select, main textarea{font-size:max(.89rem,16px)!important}
        main button, main select, main input:not([type="checkbox"]):not([type="radio"]), main textarea{min-height:44px}
        main .hero{padding-top:24px!important;padding-bottom:14px!important}
        main .hero h1, main h1{margin-top:10px!important;margin-bottom:8px!important}
        main .eyebrow, main .badge{font-size:max(.78rem,14px)!important}
        main .panel.pad, main .card, main .fact{scroll-margin-top:16px}
      }
      @media(max-width:430px){
        html{font-size:18px}
      }
    `;
    document.head.appendChild(a11y);
  }

  const initAccordions=()=>{
    const all=[...document.querySelectorAll('details.nx-accordion[data-nx-group]')];
    all.forEach(d=>{
      if(d.dataset.nxReady) return;
      d.dataset.nxReady='1';
      d.addEventListener('toggle',()=>{
        if(!d.open) return;
        const group=d.dataset.nxGroup;
        if(group && matchMedia('(max-width: 700px)').matches){
          all.forEach(other=>{if(other!==d&&other.open&&other.dataset.nxGroup===group) other.open=false;});
        }
      });
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAccordions,{once:true}); else initAccordions();
})();
