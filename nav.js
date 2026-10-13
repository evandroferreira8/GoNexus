(() => {
  "use strict";

  if(!document.querySelector('link[rel="icon"]')){
    const icon=document.createElement('link');
    icon.rel='icon';icon.type='image/svg+xml';icon.href='favicon.svg?v=studio-v3';
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
          

header{width:100%;background:#fff;border-bottom:1px solid #e2e8f2;position:relative;z-index:800}
.bar{width:min(1190px,100%);min-height:68px;padding:10px 20px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:20px}
.identity{display:flex;align-items:center;gap:10px;min-width:0}
.mark{width:43px;height:43px;display:grid;place-items:center;flex:none;border-radius:50%;background:#fecb2f;border:2px solid #0b1f3b;box-shadow:0 0 0 4px #edf2fa}
.mark svg{width:30px;height:30px}
.brand-wrap{display:flex;flex-direction:column;gap:1px}
.brand{font:800 1.37rem/1.03 'Outfit',sans-serif;letter-spacing:-.04em;color:#0b1f3b;text-decoration:none;display:flex;align-items:baseline;gap:4px;white-space:nowrap}
.brand .nexus{color:#0b1f3b}.brand .version{font:800 .85rem 'Outfit',sans-serif;color:#2563eb}
.subtitle{color:#667993;font-size:.7rem;line-height:1.2;font-weight:600}
nav.nav{display:flex;align-items:center;gap:5px}
.navlink,details.toolmenu>summary{display:flex;align-items:center;justify-content:center;min-height:43px;padding:10px 14px;border:0;border-radius:10px;background:transparent;color:#284366;cursor:pointer;font:700 .84rem 'DM Sans',sans-serif;text-decoration:none;white-space:nowrap}
.navlink.active{color:#1c55ca;background:#eaf1ff}
.navlink.cta{background:#2563eb;color:#fff}
.navlink.cta.active,.navlink.cta:hover{background:#1748b7;color:#fff}
.navlink:hover,details.toolmenu>summary:hover{background:#edf3fb;color:#0b1f3b}
.navlink:focus-visible,summary:focus-visible,.menu a:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
details.toolmenu{position:relative}
details.toolmenu>summary{list-style:none;gap:6px}
details.toolmenu>summary::-webkit-details-marker{display:none}
.chev{font-size:.75rem;color:#2563eb}
.menu{position:absolute;right:0;top:calc(100% + 13px);z-index:900;width:min(520px,calc(100vw - 32px));max-height:min(73vh,650px);overflow-y:auto;padding:10px;background:#fff;border:1px solid #d5e0f1;border-radius:17px;box-shadow:0 20px 60px #12294523;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}
.menu a{display:flex;align-items:center;gap:10px;min-width:0;padding:10px;border-radius:10px;text-decoration:none;color:#0b1f3b;border:1px solid transparent}
.menu a:hover,.menu a.active{background:#eef4ff;border-color:#d2e1fc}
.tool-icon{width:35px;height:35px;flex:0 0 35px;border-radius:9px;background:#eaf1ff;color:#1e5de0;display:grid;place-items:center;font-size:1rem}
.tool-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
.tool-copy strong{font-size:.83rem;color:#0b1f3b;line-height:1.3}
.tool-copy small{font-size:.69rem;color:#526781;line-height:1.3;white-space:normal}
.mobile-bottom{display:none}
@media(max-width:768px){
 header{border-bottom:1px solid #e8edf5}
 .bar{min-height:62px;padding:8px 16px}
 .mark{width:39px;height:39px}.mark svg{width:25px;height:25px}
 .brand{font-size:1.22rem}.subtitle{display:none}
 nav.nav{display:block;margin-left:auto}
 nav.nav>.navlink{display:none}
 details.toolmenu>summary{min-height:44px;width:46px;border:1px solid #dce4f1;border-radius:12px;background:#f4f7fc;gap:0}
 details.toolmenu>summary span:not(.chev){font-size:0;line-height:0}
 details.toolmenu>summary span:not(.chev):before{content:"☰";font-size:21px;color:#16385f;line-height:1}
 details.toolmenu>summary .chev{display:none}
 .menu{position:absolute;right:0;top:calc(100% + 12px);width:min(355px,calc(100vw - 32px));max-height:min(68vh,620px);grid-template-columns:1fr}
 .mobile-bottom{position:fixed;left:0;right:0;bottom:0;z-index:900;display:grid;grid-template-columns:repeat(4,1fr);align-items:stretch;padding:6px 7px calc(6px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #dce4ef;box-shadow:0 -8px 25px #102c4e12}
 .mobile-bottom a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:54px;border-radius:11px;color:#506784;text-decoration:none;font:700 10px/1.3 'DM Sans',sans-serif}
 .mobile-bottom a.active{color:#1857d1;background:#ecf2ff}
 .mobile-bottom a svg{height:21px;width:21px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
}
        </style>
        <header>
          <div class="bar">
            <div class="identity"><a class="mark" href="index.html" aria-label="GO Nexus — início"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="13.5" stroke="#0b1f3b" stroke-width="2.3"/><circle cx="20" cy="20" r="5.2" fill="#0b1f3b"/><path d="M4 20h32" stroke="#0b1f3b" stroke-width="2.3" stroke-linecap="round"/><circle cx="20" cy="20" r="3.1" fill="#fff"/></svg></a><div class="brand-wrap"><a class="brand" href="index.html" aria-label="GO Nexus — início">GO <span class="nexus">NEXUS</span><span class="version">2.0</span></a><div class="subtitle">O seu centro de ferramentas Pokémon GO</div></div></div>
            <nav class="nav" aria-label="Navegação principal">
              <a class="navlink${current==='index.html'?' active':''}" href="index.html"${current==='index.html'?' aria-current="page"':''}>Início</a>
              <details class="toolmenu${inTools?' active':''}"><summary><span>Ferramentas</span><span class="chev">⌄</span></summary><div class="menu">${toolLinks}</div></details>
              <a class="navlink" href="index.html#novidades">Novidades</a>
              <a class="navlink cta${current==='quiz.html'?' active':''}" href="quiz.html"${current==='quiz.html'?' aria-current="page"':''}>Quiz ↗</a>
            </nav>
          </div>
        </header>
        <nav class="mobile-bottom" aria-label="Navegação principal no celular">
          <a href="index.html" class="${current==='index.html'?'active':''}" aria-label="Início"><svg viewBox="0 0 24 24"><path d="m3 11 9-7 9 7v9h-7v-6h-4v6H3z"/></svg><span>Início</span></a>
          <a href="index.html#ferramentas" aria-label="Ferramentas"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg><span>Ferramentas</span></a>
          <a href="index.html#novidades" aria-label="Novidades"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM7 9h4m-4 4h10m-10 3h10"/></svg><span>Novidades</span></a>
          <a href="quiz.html" class="${current==='quiz.html'?'active':''}" aria-label="Quiz"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.7-1.7 1.2-1.7 2.7m0 3.3h.01"/></svg><span>Quiz</span></a>
        </nav>`;
      const details=root.querySelector('details');
      root.addEventListener('keydown',e=>{if(e.key==='Escape'&&details.open){details.open=false;details.querySelector('summary').focus();}});
      document.addEventListener('click',e=>{if(details.open && !this.contains(e.target) && !details.contains(e.composedPath()[0])) details.open=false;});
    }
  }

  class GoNexusFooter extends HTMLElement {
    connectedCallback(){
      if(this.shadowRoot) return;
      const root=this.attachShadow({mode:"open"});
      root.innerHTML=`<style>${baseStyles}footer{border-top:1px solid #dce4ef;background:#f0f4fa;color:#536783;margin-top:50px}.inner{width:min(1180px,100%);margin:auto;padding:24px 18px 32px}.top{display:flex;justify-content:space-between;gap:24px;align-items:start;margin-bottom:20px}.footer-title{font:750 1.28rem 'Outfit',sans-serif;letter-spacing:-.03em;color:#0b1f3b}.footer-title b{color:#2563eb}.tag{font:500 .66rem 'IBM Plex Mono',monospace;color:#58708d;margin-top:4px}.links{display:flex;flex-wrap:wrap;gap:10px 18px}.links a{color:#234f95;text-decoration:none;font-size:.81rem}.bottom{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;border-top:1px solid #dae3f0;padding-top:16px;font-size:.73rem;line-height:1.6}.bottom strong{color:#274567}@media(max-width:768px){.top{flex-direction:column;gap:17px}.inner{padding:23px 17px 29px}.bottom{flex-direction:column}.tag{letter-spacing:0}}</style><footer><div class="inner"><div class="top"><div><div class="footer-title">GO NEXUS <b>2.0</b></div><div class="tag">NEXUS STUDIO / FEITO PARA JOGAR</div></div><nav class="links" aria-label="Informações do projeto"><a href="index.html">Início</a><a href="index.html#ferramentas">Ferramentas</a><a href="quiz.html">Quiz</a><a href="privacidade.html">Privacidade</a><a href="termos.html">Termos</a><a href="anuncie.html">Anuncie</a><a href="${FEEDBACK}" target="_blank" rel="noopener noreferrer">Feedback ↗</a></nav></div><div class="bottom"><span>Projeto independente. Não afiliado às empresas responsáveis pelo Pokémon GO.</span><span>Desenvolvido por <strong>DelorisNyx</strong> · Código de amizade: <strong>8596 0928 0640</strong></span><span>© 2026 GO Nexus</span></div></div></footer>`;
    }
  }

  if(!customElements.get('go-nexus-header')) customElements.define('go-nexus-header',GoNexusHeader);
  if(!customElements.get('go-nexus-footer')) customElements.define('go-nexus-footer',GoNexusFooter);

  // Presentation is defined only in nexus-studio.css. Navigation retains accordion interactions.

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
  const LITE_EGG_IMAGE='egg-original.png?v=studio-20261012-restored';
  const mountLazyEgg=()=>{
    if(currentFile()!=='index.html')return;
    if(document.getElementById('gnx-egg-placeholder') || document.querySelector('go-nexus-cosmic-egg'))return;
    const wrap=document.createElement('div');
    wrap.id='gnx-egg-placeholder';
    wrap.className='gn-explore-card gn-cosmic-card';
    wrap.innerHTML='<button type="button" title="Toque três vezes para revelar uma surpresa" aria-label="Descobrir o ovo misterioso do GO Nexus" style="display:block;width:58px;height:58px;border:0;padding:0;background:transparent;cursor:pointer;filter:drop-shadow(0 4px 9px rgba(13,39,65,.20))"><img alt="" width="58" height="58" src="'+LITE_EGG_IMAGE+'" style="width:58px;height:58px;object-fit:contain"></button><span class="gn-cosmic-copy"><strong>Ovo misterioso</strong><small>Toque e descubra.</small></span><span data-lazy-status role="status" style="position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">Ovo misterioso.</span>';
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
    const slot=document.querySelector('#explorar .gn-two-lanes');
    (slot||document.body).appendChild(wrap);
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
