(() => {
  "use strict";

  if(!document.querySelector('link[rel="icon"]')){
    const icon=document.createElement('link');
    icon.rel='icon';icon.type='image/svg+xml';icon.href='favicon.svg?v=2';
    document.head.appendChild(icon);
  }

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
    { file: "tipagens.html", icon: "🛡️", label: "Central de Combate", desc: "Pokémon, tipos, Reides, Max e clima" },
    { file: "pokeparadas.html", icon: "📍", label: "Poképaradas", desc: "Como solicitar sem complicar" }
  ];

  const baseStyles = `
    :host, *, *::before, *::after { box-sizing: border-box; }
    :host { display:block; width:100%; font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
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
          
header{width:100%;position:relative;z-index:120;background:rgba(11,25,28,.98);border-bottom:1px solid #2d4a48}
.bar{width:min(1220px,100%);min-height:84px;margin:auto;padding:17px 22px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.identity{display:flex;align-items:center;gap:12px;flex:0 0 auto;min-width:0}
.mark{width:47px;height:47px;flex:none;border-radius:13px;display:grid;place-items:center;border:1px solid #93ba81;background:#c5f277}
.mark svg{width:31px;height:31px}
.brand-wrap{display:grid;gap:2px}
.brand{display:inline-flex;align-items:baseline;gap:5px;color:#f4f5ec;text-decoration:none;font:700 1.32rem/1.1 'Outfit',system-ui,sans-serif;letter-spacing:-.05em}
.brand .nexus{color:#f4f5ec}
.brand .version{font:600 9px/1 'IBM Plex Mono',monospace;color:#a4c996;align-self:start}
.subtitle{color:#9fbab1;font-size:.72rem;line-height:1.35;font-weight:500;white-space:nowrap}
nav{display:flex;align-items:center;justify-content:flex-end;gap:7px;min-width:0}
.navlink,summary{display:inline-flex;align-items:center;gap:7px;justify-content:center;min-height:43px;padding:10px 14px;border:1px solid transparent;border-radius:11px;background:transparent;color:#d9e8dd;text-decoration:none;font-size:.83rem;font-weight:650;line-height:1.2;white-space:nowrap;cursor:pointer}
.navlink:hover,summary:hover{background:#1a3636;color:#fff;border-color:#45655e}
.navlink.active,details.toolmenu.active>summary{background:#243d38;color:#c5f277;border-color:#547267}
.navlink.cta{background:#c5f277;border-color:#c5f277;color:#132421;font-weight:800}
.navlink.cta:hover{background:#e2ffa6;color:#10221e}
.navlink:focus-visible,summary:focus-visible,.menu a:focus-visible{outline:3px solid #c5f277;outline-offset:3px}
details{position:relative}summary{list-style:none}summary::-webkit-details-marker{display:none}
.chev{font-size:.68rem;color:#a9c4b7;transition:transform .18s}details[open] .chev{transform:rotate(180deg)}
.menu{position:absolute;right:0;top:calc(100% + 10px);width:min(540px,calc(100vw - 30px));max-height:min(76vh,680px);overflow:auto;padding:11px;border:1px solid #4b6d62;border-radius:18px;background:#11282b;box-shadow:0 24px 54px #020e108c;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;z-index:200}
.menu a{display:flex;align-items:center;gap:11px;padding:13px 10px;border-radius:12px;color:#e1ede2;text-decoration:none;border:1px solid transparent;min-width:0}
.menu a:hover{background:#1d3b38;border-color:#5b796c}
.menu a.active{background:#254037;border-color:#7a9a78}
.tool-icon{display:grid;place-items:center;flex:0 0 35px;width:35px;height:35px;border:1px solid #46685a;border-radius:10px;background:#203b36;text-align:center;font-size:1rem}
.tool-copy{display:grid;gap:2px;min-width:0}.tool-copy strong{font-size:.83rem;line-height:1.25}.tool-copy small{font-size:.7rem;color:#afc4b7;font-weight:500;line-height:1.35;white-space:normal}
@media(max-width:1020px){.subtitle{display:none}.navlink{padding:9px 10px}}
@media(max-width:760px){
 .bar{min-height:0;flex-direction:column;align-items:stretch;padding:14px 14px 11px;gap:12px}
 .identity{gap:10px}.mark{width:39px;height:39px}.mark svg{width:27px;height:27px}
 nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;width:100%}
 .navlink,summary{min-width:0;width:100%;min-height:43px;padding:8px 5px;font-size:.76rem;border:1px solid #34534d;background:#142b2b}
 details.toolmenu{position:static}
 .menu{left:14px;right:14px;top:calc(100% - 3px);width:calc(100vw - 28px)}
}
@media(max-width:430px){.menu{grid-template-columns:1fr;max-height:66vh}.tool-copy strong{font-size:.86rem}.brand{font-size:1.2rem}}
        </style>
        <header>
          <div class="bar">
            <div class="identity"><a class="mark" href="index.html" aria-label="GO Nexus — início"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="13.5" stroke="#122620" stroke-width="2.3"/><circle cx="20" cy="20" r="5.2" fill="#122620"/><path d="M20 1.8v9.2M20 29v9.2M1.8 20H11M29 20h9.2" stroke="#122620" stroke-width="2.3" stroke-linecap="round"/></svg></a><div class="brand-wrap"><a class="brand" href="index.html" aria-label="GO Nexus — início">GO <span class="nexus">NEXUS</span><span class="version">2.0</span></a><div class="subtitle">O seu centro de ferramentas Pokémon GO</div></div></div>
            <nav class="nav" aria-label="Navegação principal">
              <a class="navlink${current==='index.html'?' active':''}" href="index.html"${current==='index.html'?' aria-current="page"':''}>Início</a>
              <details class="toolmenu${inTools?' active':''}"><summary><span>Ferramentas</span><span class="chev">⌄</span></summary><div class="menu">${toolLinks}</div></details>
              <a class="navlink" href="index.html#novidades">Novidades</a>
              <a class="navlink cta${current==='quiz.html'?' active':''}" href="quiz.html"${current==='quiz.html'?' aria-current="page"':''}>Quiz ↗</a>
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
      root.innerHTML=`<style>${baseStyles}footer{margin:60px 0 0;border-top:1px solid #385850;background:#0e2024;color:#bacbc3}.inner{width:min(1220px,100%);margin:auto;padding:35px 22px 38px}.top{display:flex;justify-content:space-between;gap:30px;align-items:start;margin-bottom:26px}.footer-title{font:700 1.55rem/1.1 'Outfit',system-ui,sans-serif;letter-spacing:-.045em;color:#f4f5ec}.footer-title b{color:#c5f277}.tag{font:500 11px 'IBM Plex Mono',monospace;color:#96b9a2;margin-top:6px}.links{display:flex;flex-wrap:wrap;gap:8px 21px}.links a{color:#d2e8d5;text-decoration:none;font-size:.85rem}.links a:hover{color:#c5f277}.bottom{border-top:1px solid #35534b;padding-top:18px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:.76rem;line-height:1.6;color:#98b0a8}.bottom strong{color:#d7e8d7}@media(max-width:670px){.top{flex-direction:column;gap:20px}.inner{padding:29px 16px}.links{gap:14px}.bottom{flex-direction:column;gap:4px}}</style><footer><div class="inner"><div class="top"><div><div class="footer-title">GO NEXUS <b>2.0</b></div><div class="tag">FIELD SYSTEM / UMA CENTRAL FEITA PARA JOGAR</div></div><nav class="links" aria-label="Informações do projeto"><a href="index.html">Início</a><a href="index.html#ferramentas">Ferramentas</a><a href="quiz.html">Quiz</a><a href="privacidade.html">Privacidade</a><a href="termos.html">Termos</a><a href="anuncie.html">Anuncie</a><a href="${FEEDBACK}" target="_blank" rel="noopener noreferrer">Feedback ↗</a></nav></div><div class="bottom"><span>Projeto independente. Não afiliado às empresas responsáveis pelo Pokémon GO.</span><span>Desenvolvido por <strong>DelorisNyx</strong> · Código de amizade: <strong>8596 0928 0640</strong></span><span>© 2026 GO Nexus</span></div></div></footer>`;
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




  // A experiência opcional é carregada somente no primeiro toque.
  // O ovo permanece visível sem baixar os sprites e as artes do quiz em cada página.
  window.__GO_NEXUS_BASE_STYLES=baseStyles;
  const LITE_EGG_IMAGE='data:image/svg+xml,'+encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"76\" height=\"76\" viewBox=\"0 0 76 76\"><ellipse cx=\"38\" cy=\"39\" rx=\"26\" ry=\"32\" fill=\"#dcf6c3\" stroke=\"#8dbba1\" stroke-width=\"3\"/><path d=\"M18 33c8-15 31-22 42-7\" fill=\"none\" stroke=\"#87be9a\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M23 51c9 9 20 9 29 2\" fill=\"none\" stroke=\"#b4d18b\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"39\" cy=\"37\" r=\"8\" fill=\"#c5f277\" stroke=\"#6b9784\" stroke-width=\"3\"/></svg>");
  const mountLazyEgg=()=>{
    if(currentFile()!=='index.html')return;
    if(document.getElementById('gnx-egg-placeholder') || document.querySelector('go-nexus-cosmic-egg'))return;
    const wrap=document.createElement('div');
    wrap.id='gnx-egg-placeholder';
    wrap.style.cssText='position:fixed;left:13px;bottom:13px;z-index:1600;display:flex;align-items:flex-end;gap:9px;max-width:calc(100vw - 26px);font-family:Inter,system-ui,sans-serif';
    wrap.innerHTML='<button type="button" aria-label="Descobrir o segredo do ovo Pokémon" style="display:block;flex-shrink:0;width:76px;height:76px;border:0;padding:0;background:transparent;cursor:pointer;filter:drop-shadow(0 8px 14px rgba(0,0,0,.38))"><img alt="" width="76" height="76" src="'+LITE_EGG_IMAGE+'" style="width:76px;height:76px;object-fit:contain"></button><div style="background:#091527;border:1px solid #314462;color:#dcecff;border-radius:14px;padding:9px 12px;max-width:190px;font-size:12px;line-height:1.4;box-shadow:0 8px 22px #0007"><strong>Um ovo incomum...</strong><div data-lazy-status>Parece reagir à sua presença.</div></div>';
    const button=wrap.querySelector('button'), status=wrap.querySelector('[data-lazy-status]');
    const loadScript=src=>new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=src;script.async=true;
      script.onload=resolve;
      script.onerror=()=>{script.remove();reject(new Error('Falha ao carregar '+src))};
      document.head.appendChild(script);
    });
    button.addEventListener('click',async()=>{
      if(button.disabled)return;
      button.disabled=true;status.textContent='Abrindo o segredo...';
      try{
        await Promise.all([1,2,3,4,5].map(n=>loadScript('cosmos-assets-'+n+'.js?v=20261012')));
        await loadScript('cosmos.js?v=20261012');
        wrap.remove();
        document.querySelector('go-nexus-cosmic-egg')?.shadowRoot?.querySelector('.egg')?.click();
      }catch(error){
        button.disabled=false;
        status.textContent='Não foi possível abrir. Toque para tentar de novo.';
        console.warn('GO Nexus: a experiência opcional não pôde carregar.',error);
      }
    });
    document.body.appendChild(wrap);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountLazyEgg,{once:true});else mountLazyEgg();

  const mountBackToTop=()=>{
    if(document.querySelector('.gn-back-to-top'))return;
    const button=document.createElement('button');
    button.type='button';button.className='gn-back-to-top';button.textContent='↑ Topo';
    button.setAttribute('aria-label','Voltar ao topo da página');button.hidden=true;
    document.body.appendChild(button);
    const toggle=()=>{button.hidden=window.scrollY<600};
    window.addEventListener('scroll',toggle,{passive:true});
    button.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
    toggle();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountBackToTop,{once:true});else mountBackToTop();

  const mountBreadcrumb=()=>{
    const page=currentFile();
    if(page==='index.html'||document.querySelector('.gn-breadcrumb'))return;
    const main=document.querySelector('main');
    if(!main)return;
    const match=TOOLS.find(tool=>tool.file===page);
    const title=match?.label||({'quiz.html':'Quiz GO Nexus','anuncie.html':'Anuncie','privacidade.html':'Privacidade','termos.html':'Termos de Uso'}[page]||'GO Nexus');
    const crumbs=document.createElement('div');
    crumbs.className='gn-breadcrumb';
    const link=document.createElement('a');
    link.href='index.html#ferramentas';link.textContent='Todas as ferramentas';
    const slash=document.createElement('span');slash.className='gn-slash';slash.textContent='/';
    const label=document.createElement('span');label.className='gn-current';label.textContent=title;
    crumbs.append(link,slash,label);
    main.prepend(crumbs);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountBreadcrumb,{once:true});else mountBreadcrumb();

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
