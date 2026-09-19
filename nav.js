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



  // Easter egg cósmico do GO Nexus — versão final.
  // A experiência usa uma árvore mítica/temática, não uma genealogia biológica literal.
  class GoNexusCosmicEgg extends HTMLElement {
    connectedCallback(){
      if(this.shadowRoot) return;

      const A='assets/easter-egg/';
      const lore={
        arceus:{name:'Arceus',tag:'O Original',glow:'250,204,21',text:'A tradição de Sinnoh diz que Arceus moldou tudo o que existe neste mundo. É o ponto central da cosmogonia mais conhecida da franquia.'},
        dialga:{name:'Dialga',tag:'Tempo',glow:'59,130,246',text:'Lendário de Sinnoh ligado ao tempo. Sua Forma Origem é descrita oficialmente como capaz de expandir, destruir e criar o próprio tempo.'},
        palkia:{name:'Palkia',tag:'Espaço',glow:'244,114,182',text:'Lendário de Sinnoh ligado ao espaço e capaz de distorcê-lo. A mitologia o descreve como uma divindade espacial.'},
        giratina:{name:'Giratina',tag:'Mundo Distorção',glow:'168,85,247',text:'Associado ao mundo do lado reverso do nosso, o Mundo Distorção. Sua lenda representa uma face diferente da criação de Sinnoh.'},
        uxie:{name:'Uxie',tag:'Conhecimento',glow:'250,204,21',text:'Conhecido como o Ser do Conhecimento. As lendas de Sinnoh o colocam, junto de Mesprit e Azelf, no equilíbrio espiritual do mundo.'},
        mesprit:{name:'Mesprit',tag:'Emoção',glow:'236,72,153',text:'Conhecido como o Ser da Emoção. Integra o trio dos lagos e simboliza a capacidade de sentir.'},
        azelf:{name:'Azelf',tag:'Vontade',glow:'56,189,248',text:'Conhecido como o Ser da Vontade. A Pokédex afirma que Uxie, Mesprit e Azelf teriam vindo do mesmo ovo.'},

        articuno:{name:'Articuno',tag:'Gelo',glow:'125,211,252',text:'Ave lendária capaz de controlar gelo. Diz-se que o bater de suas asas resfria o ar e pode provocar neve.'},
        zapdos:{name:'Zapdos',tag:'Trovão',glow:'250,204,21',text:'Ave lendária associada a tempestades elétricas. É descrita surgindo das nuvens e ganhando força com relâmpagos.'},
        moltres:{name:'Moltres',tag:'Fogo',glow:'251,113,133',text:'Ave lendária envolta em chamas. Sua passagem e suas asas flamejantes são ligadas ao fogo e à chegada da primavera em antigas histórias.'},
        mewtwo:{name:'Mewtwo',tag:'Ciência genética',glow:'167,139,250',text:'Pokémon criado por engenharia genética a partir de DNA ligado a Mew. A própria franquia o apresenta como resultado de experimentos científicos.'},

        raikou:{name:'Raikou',tag:'Relâmpago',glow:'250,204,21',text:'Fera lendária de Johto associada à velocidade do relâmpago e ao poder das tempestades.'},
        entei:{name:'Entei',tag:'Vulcões',glow:'248,113,113',text:'Fera lendária cuja força é associada ao magma e aos vulcões. Lendas dizem que seu rugido faz vulcões entrarem em erupção.'},
        suicune:{name:'Suicune',tag:'Água pura',glow:'56,189,248',text:'Fera lendária que percorre o mundo em busca de água limpa e possui a capacidade de purificar água contaminada.'},
        lugia:{name:'Lugia',tag:'Mares e tempestades',glow:'147,197,253',text:'Lendário de Johto que vive nas profundezas do mar. Seu enorme poder é associado a tempestades e ao controle de ventos intensos.'},
        ho_oh:{name:'Ho-Oh',tag:'Arco-íris e renascimento',glow:'251,191,36',text:'Lendário de Johto associado ao arco-íris. A tradição da Torre Queimada também o relaciona ao renascimento das três feras lendárias.'},

        latias:{name:'Latias',tag:'Empatia',glow:'251,113,133',text:'Lendário extremamente sensível às emoções humanas. Pode envolver o corpo com luz e alterar sua aparência.'},
        latios:{name:'Latios',tag:'Inteligência',glow:'96,165,250',text:'Lendário inteligente que entende a fala humana e pode compartilhar imagens do que viu ou imaginou por telepatia.'},
        kyogre:{name:'Kyogre',tag:'Mares',glow:'37,99,235',text:'A mitologia de Hoenn atribui a Kyogre a expansão dos mares. Seu conflito ancestral com Groudon é interrompido por Rayquaza.'},
        groudon:{name:'Groudon',tag:'Continentes',glow:'239,68,68',text:'A mitologia de Hoenn atribui a Groudon a expansão das terras. Seu confronto com Kyogre ameaça o equilíbrio natural.'},
        rayquaza:{name:'Rayquaza',tag:'Céu e equilíbrio',glow:'52,211,153',text:'Vive na camada de ozônio e surge como força de equilíbrio quando Groudon e Kyogre entram em conflito.'},

        regirock:{name:'Regirock',tag:'Titã de rocha',glow:'251,146,60',text:'Um dos titãs lendários. Seu corpo é formado por rochas de lugares diferentes, substituídas quando partes dele se quebram.'},
        regice:{name:'Regice',tag:'Titã de gelo',glow:'103,232,249',text:'Titã lendário cujo corpo é feito de gelo extremamente antigo, associado ao período glacial.'},
        registeel:{name:'Registeel',tag:'Titã de aço',glow:'148,163,184',text:'Titã lendário de corpo metálico incomum, endurecido ao longo de milhares de anos sob pressão subterrânea.'},
        regigigas:{name:'Regigigas',tag:'Continentes',glow:'163,230,53',text:'Uma lenda duradoura afirma que Regigigas arrastou continentes usando cordas. Também é ligado à criação de outros titãs.'},
        regieleki:{name:'Regieleki',tag:'Titã elétrico',glow:'250,204,21',text:'Titã composto quase totalmente de energia elétrica. Suas argolas são descritas como restrições impostas ao seu enorme poder.'},
        regidrago:{name:'Regidrago',tag:'Titã dragão',glow:'244,63,94',text:'Titã cujo corpo é composto de energia de dragão cristalizada. A tradição diz que Regigigas não conseguiu completar seu corpo.'},

        heatran:{name:'Heatran',tag:'Magma',glow:'251,113,133',text:'Lendário que habita cavernas vulcânicas. Sangue semelhante a magma circula por seu corpo de aço.'},
        cresselia:{name:'Cresselia',tag:'Lua crescente',glow:'244,114,182',text:'Lendário associado à lua crescente e a sonhos agradáveis. Suas penas são tradicionalmente ligadas ao fim de pesadelos.'},

        cobalion:{name:'Cobalion',tag:'Espadachim da Justiça',glow:'96,165,250',text:'Líder sereno dos Espadachins da Justiça. As lendas de Unova contam que protegeu Pokémon dos conflitos entre humanos.'},
        terrakion:{name:'Terrakion',tag:'Espadachim da Justiça',glow:'251,146,60',text:'Integrante dos Espadachins da Justiça, conhecido por força suficiente para romper enormes estruturas e defender Pokémon.'},
        virizion:{name:'Virizion',tag:'Espadachim da Justiça',glow:'74,222,128',text:'Integrante veloz dos Espadachins da Justiça, descrito enfrentando humanos para proteger Pokémon.'},
        tornadus:{name:'Tornadus',tag:'Ventos e tempestades',glow:'74,222,128',text:'Força da Natureza associada a ventos violentos e tempestades que atravessam regiões inteiras.'},
        thundurus:{name:'Thundurus',tag:'Trovões',glow:'96,165,250',text:'Força da Natureza associada a relâmpagos e tempestades. Suas descargas podem provocar incêndios e destruição.'},
        landorus:{name:'Landorus',tag:'Colheitas e solo',glow:'251,146,60',text:'Força da Natureza venerada por enriquecer o solo e favorecer colheitas após absorver energia do vento e do relâmpago.'},
        reshiram:{name:'Reshiram',tag:'Verdade',glow:'226,232,240',text:'Parte da lenda do dragão original de Unova. Reshiram se associa à verdade e escolhe aqueles que buscam um mundo verdadeiro.'},
        zekrom:{name:'Zekrom',tag:'Ideais',glow:'71,85,105',text:'Parte da lenda do dragão original de Unova. Zekrom se associa aos ideais e à construção de um mundo desejado.'},
        kyurem:{name:'Kyurem',tag:'O que restou',glow:'125,211,252',text:'Ligado ao mito do dragão original de Unova. Pode se fundir com Reshiram ou Zekrom, assumindo as formas Kyurem Branco ou Preto.'},

        tapu_koko:{name:'Tapu Koko',tag:'Guardião de Melemele',glow:'250,204,21',text:'Divindade guardiã de Melemele, curiosa e ligada ao relâmpago. Apesar do título de guardião, pode ser feroz quando provocada.'},
        tapu_lele:{name:'Tapu Lele',tag:'Guardião de Akala',glow:'244,114,182',text:'Divindade guardiã de Akala. Espalha escamas brilhantes que estimulam o corpo, mas seu poder pode ser perigoso em excesso.'},
        tapu_bulu:{name:'Tapu Bulu',tag:'Guardião de Ula’ula',glow:'74,222,128',text:'Divindade guardiã de Ula’ula que controla plantas. Prefere evitar conflitos, mas possui força devastadora.'},
        tapu_fini:{name:'Tapu Fini',tag:'Guardião de Poni',glow:'103,232,249',text:'Divindade guardiã de Poni, capaz de manipular água e névoa. É reverenciada e temida por quem se aproxima sem cautela.'},
        cosmog:{name:'Cosmog',tag:'Nebulosa',glow:'167,139,250',text:'Pequeno Pokémon lendário de corpo gasoso. Sua origem é misteriosa e ele pode abrir caminhos espaciais para escapar do perigo.'},
        cosmoem:{name:'Cosmoem',tag:'Protostrela',glow:'250,204,21',text:'Evolução extremamente densa de Cosmog. Sua forma funciona como uma etapa entre a nebulosa e Solgaleo ou Lunala.'},
        solgaleo:{name:'Solgaleo',tag:'Emissário do Sol',glow:'250,204,21',text:'Lendário de Alola venerado como emissário do sol. Pode atravessar Ultra Wormholes e liberar luz intensa.'},
        lunala:{name:'Lunala',tag:'Emissária da Lua',glow:'129,140,248',text:'Lendário de Alola venerado como emissário da lua. Absorve luz e também está ligado às Ultra Wormholes.'},
        necrozma:{name:'Necrozma',tag:'Luz',glow:'168,85,247',text:'Entidade lendária ligada à luz e ao Ultra Space. Busca luz como fonte de energia e pode fundir-se com Solgaleo ou Lunala.'},

        zacian:{name:'Zacian',tag:'Espada heroica',glow:'96,165,250',text:'Herói lendário de Galar. Absorve partículas metálicas para formar uma arma e, com Zamazenta, enfrentou a calamidade do Darkest Day.'},
        zamazenta:{name:'Zamazenta',tag:'Escudo heroico',glow:'248,113,113',text:'Herói lendário de Galar. Seu corpo protegido se torna um escudo e, com Zacian, enfrentou a calamidade do Darkest Day.'},
        eternatus:{name:'Eternatus',tag:'Darkest Day',glow:'236,72,153',text:'Lendário alienígena cuja energia está ligada ao fenômeno Dynamax e ao Darkest Day, antiga calamidade de Galar.'},
        kubfu:{name:'Kubfu',tag:'Treinamento',glow:'148,163,184',text:'Jovem Lendário treinado nas artes marciais. Evolui para Urshifu após superar um dos caminhos das torres de Galar.'},
        urshifu:{name:'Urshifu',tag:'Artes marciais',glow:'71,85,105',text:'Lendário mestre de artes marciais que assume dois estilos: Golpe Decisivo ou Golpes Fluidos, conforme seu treinamento.'},
        glastrier:{name:'Glastrier',tag:'Corcel de gelo',glow:'186,230,253',text:'Corcel lendário de força extrema. Seu frio intenso forma uma máscara de gelo descrita como muito mais dura que diamante.'},
        spectrier:{name:'Spectrier',tag:'Corcel espectral',glow:'139,92,246',text:'Corcel lendário que corre pela noite e absorve força vital de criaturas adormecidas. Prefere silêncio e isolamento.'},
        calyrex:{name:'Calyrex',tag:'Rei da colheita',glow:'167,139,250',text:'Lendário lembrado como antigo rei de Galar. É associado a colheitas abundantes e pode cavalgar Glastrier ou Spectrier.'},
        enamorus:{name:'Enamorus',tag:'Primavera e amor',glow:'244,114,182',text:'Força da Natureza registrada em Hisui. Sua chegada é associada ao fim do inverno, à primavera e ao florescimento da vida.'},

        wo_chien:{name:'Wo-Chien',tag:'Tabletes da Ruína',glow:'132,204,22',text:'A rancorosa memória de alguém punido por registrar os crimes de um rei teria envolvido tabletes de madeira e folhas, originando Wo-Chien.'},
        chien_pao:{name:'Chien-Pao',tag:'Espada da Ruína',glow:'186,230,253',text:'O ódio daqueles que morreram por uma espada antiga teria envolvido neve e os fragmentos da arma, dando origem a Chien-Pao.'},
        ting_lu:{name:'Ting-Lu',tag:'Vaso da Ruína',glow:'161,98,7',text:'O medo derramado em um antigo recipiente ritual teria se envolvido em terra e pedras, tomando a forma de Ting-Lu.'},
        chi_yu:{name:'Chi-Yu',tag:'Contas da Ruína',glow:'251,113,133',text:'A inveja acumulada em antigas contas teria ganhado vida como Chi-Yu, capaz de derreter rochas com chamas intensas.'},
        koraidon:{name:'Koraidon',tag:'Passado',glow:'248,113,113',text:'Lendário de Paldea estreitamente relacionado a um Pokémon Paradoxo do passado. Sua história é central em Pokémon Scarlet.'},
        miraidon:{name:'Miraidon',tag:'Futuro',glow:'139,92,246',text:'Lendário de Paldea estreitamente relacionado a um Pokémon Paradoxo do futuro. Sua história é central em Pokémon Violet.'},
        ogerpon:{name:'Ogerpon',tag:'Máscaras de Kitakami',glow:'74,222,128',text:'Lendária de Kitakami cuja história é ligada a quatro máscaras especiais. A verdade sobre ela contradiz a antiga lenda popular da região.'},
        okidogi:{name:'Okidogi',tag:'Corrente Tóxica',glow:'74,222,128',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain ampliou sua força física e o liga diretamente à história de Pecharunt.'},
        munkidori:{name:'Munkidori',tag:'Corrente Tóxica',glow:'167,139,250',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain estimulou o cérebro e lhe concedeu capacidades psíquicas.'},
        fezandipiti:{name:'Fezandipiti',tag:'Corrente Tóxica',glow:'244,114,182',text:'Um dos “Três Leais” de Kitakami. Sua Toxic Chain aumentou seu charme e está ligada à influência de Pecharunt.'},
        terapagos:{name:'Terapagos',tag:'Energia Terastal',glow:'56,189,248',text:'Lendário no centro do mistério do fenômeno Terastal. Sua carapaça armazena energia de todos os tipos e possui múltiplas formas.'},

        mew:{name:'Mew',tag:'DNA ancestral',glow:'244,114,182',text:'Pokémon Mítico cujo DNA contém material genético de muitas espécies. Por isso, cientistas da franquia o tratam como peça-chave para estudar a origem dos Pokémon.'},
        celebi:{name:'Celebi',tag:'Viagem no tempo',glow:'74,222,128',text:'Mítico que atravessa o tempo. Sua presença é associada a florestas saudáveis e à esperança de um futuro brilhante.'},
        jirachi:{name:'Jirachi',tag:'Desejos',glow:'250,204,21',text:'Mítico dos desejos. A tradição afirma que desperta por apenas sete dias a cada mil anos e pode realizar desejos nesse período.'},
        deoxys:{name:'Deoxys',tag:'DNA do espaço',glow:'248,113,113',text:'Mítico originado quando o DNA de um vírus extraterrestre sofreu mutação após exposição a um raio laser. Seu cristal atua como cérebro.'},
        phione:{name:'Phione',tag:'Deriva marinha',glow:'125,211,252',text:'Mítico marinho que deriva em mares quentes e sempre retorna ao lugar onde nasceu, por mais longe que tenha sido levado.'},
        manaphy:{name:'Manaphy',tag:'Vínculo',glow:'56,189,248',text:'Mítico marinho que nasce com uma capacidade extraordinária de criar laços com qualquer espécie de Pokémon.'},
        darkrai:{name:'Darkrai',tag:'Pesadelos',glow:'88,28,135',text:'Mítico que provoca pesadelos como mecanismo de defesa. É fortemente associado à lua nova e contraposto a Cresselia em várias histórias.'},
        shaymin:{name:'Shaymin',tag:'Gratidão',glow:'74,222,128',text:'Mítico conhecido como Pokémon Gratidão. Flores de Gracidea permitem sua transformação e a gratidão é o tema central de sua lenda.'},
        victini:{name:'Victini',tag:'Vitória e energia',glow:'251,113,133',text:'Mítico associado à vitória. Suas descrições afirmam que produz energia ilimitada e pode compartilhá-la com quem toca.'},
        keldeo:{name:'Keldeo',tag:'Espadachim',glow:'56,189,248',text:'Mítico ligado aos Espadachins da Justiça. Seu crescimento e sua Forma Resoluta representam treinamento, coragem e domínio da técnica.'},
        meloetta:{name:'Meloetta',tag:'Música e dança',glow:'74,222,128',text:'Mítico cuja voz e dança alteram as emoções de quem as presencia. Relic Song permite alternar entre as Formas Ária e Pirueta.'},
        genesect:{name:'Genesect',tag:'Paleozoico modificado',glow:'168,85,247',text:'Inseto antigo de cerca de 300 milhões de anos que foi modificado tecnologicamente pela Equipe Plasma e recebeu um canhão nas costas.'},
        magearna:{name:'Magearna',tag:'Alma artificial',glow:'226,232,240',text:'Mítico artificial construído por um cientista cerca de 500 anos atrás. Seu verdadeiro ser é o Soul-Heart, uma alma artificial.'},
        marshadow:{name:'Marshadow',tag:'Sombras',glow:'148,163,184',text:'Mítico que se esconde nas sombras de pessoas e Pokémon, observando movimentos para aprender e reproduzir suas técnicas.'},
        zeraora:{name:'Zeraora',tag:'Eletricidade',glow:'250,204,21',text:'Mítico que concentra eletricidade nas patas e usa campos magnéticos para atingir velocidades extremas.'},
        meltan:{name:'Meltan',tag:'Metal líquido',glow:'148,163,184',text:'Mítico de corpo metálico líquido. Dissolve ferro e outros metais no solo para absorvê-los e incorporá-los ao próprio corpo.'},
        melmetal:{name:'Melmetal',tag:'Metal ancestral',glow:'148,163,184',text:'Evolução de Meltan. Antigas tradições dizem que ressurgiu após cerca de 3.000 anos e possui a capacidade de produzir metal.'},
        zarude:{name:'Zarude',tag:'Floresta',glow:'74,222,128',text:'Mítico que vive em bandos dentro de florestas densas. As vinhas que se desprendem de seu corpo viram nutrientes para a vegetação.'},
        pecharunt:{name:'Pecharunt',tag:'Mochi e Correntes Tóxicas',glow:'168,85,247',text:'Mítico de Kitakami que produz mochi venenoso capaz de controlar quem o come. Sua história está diretamente ligada aos Três Leais.'}
      };

      const legendaryGroups=[
        {title:'Kanto · aves e ciência',members:['articuno','zapdos','moltres','mewtwo']},
        {title:'Johto · feras, céu e mar',members:['raikou','entei','suicune','lugia','ho_oh']},
        {title:'Hoenn · Eons e clima ancestral',members:['latias','latios','groudon','kyogre','rayquaza']},
        {title:'Titãs · elementos e continentes',members:['regirock','regice','registeel','regigigas','regieleki','regidrago']},
        {title:'Sinnoh · criação, lagos e sonhos',members:['dialga','palkia','giratina','uxie','mesprit','azelf','heatran','cresselia']},
        {title:'Unova · justiça, natureza e dragão original',members:['cobalion','terrakion','virizion','tornadus','thundurus','landorus','reshiram','zekrom','kyurem']},
        {title:'Alola · guardiões, luz e Ultra Space',members:['tapu_koko','tapu_lele','tapu_bulu','tapu_fini','cosmog','cosmoem','solgaleo','lunala','necrozma']},
        {title:'Galar e Hisui · heróis e soberanos',members:['zacian','zamazenta','eternatus','kubfu','urshifu','glastrier','spectrier','calyrex','enamorus']},
        {title:'Paldea e Kitakami · ruína e Terastal',members:['wo_chien','chien_pao','ting_lu','chi_yu','koraidon','miraidon','ogerpon','okidogi','munkidori','fezandipiti','terapagos']}
      ];
      const mythicals=['mew','celebi','jirachi','deoxys','phione','manaphy','darkrai','shaymin','victini','keldeo','meloetta','genesect','magearna','marshadow','zeraora','meltan','melmetal','zarude','pecharunt'];

      const img=(key,cls='')=>`<img ${cls?`class="${cls}"`:''} loading="lazy" src="${A}${key}.png" alt="${lore[key].name}">`;
      const node=(key,extra='')=>{const p=lore[key];return `<button type="button" class="cosmic-node ${extra}" data-key="${key}" style="--node-glow:${p.glow}" aria-label="Ver a história de ${p.name}">${img(key)}<span>${p.name}</span><small>${p.tag}</small></button>`};
      const legendaryHtml=legendaryGroups.map(group=>`<section class="legend-group"><div class="legend-title">${group.title}</div><div class="legend-orbit">${group.members.map(k=>node(k,'mini')).join('')}</div></section>`).join('');
      const mythicalHtml=mythicals.map(k=>node(k,'myth-mini')).join('');

      const root=this.attachShadow({mode:'open'});
      root.innerHTML=`
      <style>
        ${baseStyles}
        :host{--cyan:#38bdf8;--violet:#8b5cf6;--pink:#ec4899;--gold:#facc15;--ink:#07111f;--line:#2b3c59;color:#f8fafc}
        button{font:inherit}
        .egg-dock{position:fixed;left:13px;bottom:13px;z-index:1600;display:flex;align-items:center;gap:9px}
        .egg{width:76px;height:76px;position:relative;border:0;background:transparent;padding:0;cursor:pointer;transition:transform .28s ease,filter .28s ease;filter:drop-shadow(0 8px 18px rgba(0,0,0,.36)) drop-shadow(0 0 10px rgba(250,204,21,.16))}
        .egg:hover{transform:translateY(-2px) scale(1.035);filter:drop-shadow(0 8px 18px rgba(0,0,0,.36)) drop-shadow(0 0 14px rgba(250,204,21,.28)) drop-shadow(0 0 18px rgba(134,239,172,.14))}
        .egg:focus-visible{outline:2px solid #facc15;outline-offset:4px;border-radius:50%}
        .egg-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform-origin:50% 58%;transition:filter .42s ease,transform .42s ease;filter:saturate(.98) brightness(.98)}
        .egg-aura{position:absolute;inset:-5px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(250,204,21,.14) 35%,rgba(134,239,172,.08) 54%,transparent 73%);filter:blur(5px);opacity:.58;transition:opacity .42s ease,transform .42s ease}
        .cracks{position:absolute;left:19px;right:19px;top:14px;bottom:13px;opacity:0;pointer-events:none;filter:drop-shadow(0 0 5px rgba(255,255,255,.75));transition:opacity .35s ease,transform .35s ease}
        .cracks::before,.cracks::after{content:"";position:absolute;left:50%;top:17%;width:28px;height:42px;background:linear-gradient(132deg,transparent 0 20%,#fff 21% 23%,transparent 24% 41%,#fff 42% 44%,transparent 45% 62%,#fff 63% 65%,transparent 66%);transform:translateX(-50%)}
        .cracks::after{top:34%;left:44%;transform:rotate(95deg);opacity:.72}
        .egg-stars{position:absolute;inset:-2px;pointer-events:none}.egg-stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 8px currentColor;opacity:.72}.egg-stars i:nth-child(1){left:5px;top:22px;color:#facc15}.egg-stars i:nth-child(2){right:6px;top:13px;color:#86efac}.egg-stars i:nth-child(3){right:8px;bottom:9px;color:#fde68a}.egg-stars i:nth-child(4){left:12px;bottom:7px;color:#a7f3d0}
        .egg[data-stage="1"] .egg-art{animation:eggWake1 .85s ease;filter:saturate(1.06) brightness(1.04) drop-shadow(0 0 7px rgba(250,204,21,.32))}.egg[data-stage="1"] .egg-aura{opacity:.82;transform:scale(1.05)}.egg[data-stage="1"] .cracks{opacity:.28}
        .egg[data-stage="2"] .egg-art{animation:eggWake2 1.15s ease;filter:saturate(1.12) brightness(1.09) drop-shadow(0 0 9px rgba(250,204,21,.42)) drop-shadow(0 0 8px rgba(134,239,172,.25))}.egg[data-stage="2"] .egg-aura{opacity:1;transform:scale(1.1)}.egg[data-stage="2"] .cracks{opacity:.78;transform:scale(1.05)}
        .egg[data-stage="3"]{filter:drop-shadow(0 0 20px rgba(250,204,21,.34))}.egg[data-stage="3"] .egg-art{filter:brightness(1.2) saturate(1.12);transform:scale(1.04)}.egg[data-stage="3"] .cracks{opacity:1}
        @keyframes eggWake1{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-3deg) scale(1.02)}50%{transform:rotate(3deg) scale(1.03)}75%{transform:rotate(-2deg) scale(1.015)}}
        @keyframes eggWake2{0%,100%{transform:rotate(0) scale(1)}18%{transform:rotate(-4deg) scale(1.025)}36%{transform:rotate(4deg) scale(1.045)}54%{transform:rotate(-3deg) scale(1.04)}72%{transform:rotate(3deg) scale(1.03)}}
        .egg-hint{opacity:0;transform:translateY(5px);transition:.2s;max-width:185px;padding:8px 10px;border-radius:12px;border:1px solid rgba(55,75,110,.65);background:rgba(7,17,31,.93);color:#a9b9cc;font-size:.72rem;line-height:1.45;box-shadow:0 14px 30px rgba(0,0,0,.28)}.egg-dock:hover .egg-hint,.egg-dock:focus-within .egg-hint{opacity:1;transform:none}.egg-hint b{color:#fff3bf}

        .flash{position:fixed;inset:0;z-index:1690;display:none;place-items:center;background:radial-gradient(circle at center,rgba(250,204,21,.12),rgba(5,9,24,.9) 58%,rgba(3,6,18,.97));backdrop-filter:blur(9px)}.flash.show{display:grid;animation:flashFade 2.65s ease forwards}.flash-stage{position:relative;width:min(430px,82vw);aspect-ratio:1/1;display:grid;place-items:center}.flash-ring{position:absolute;inset:3%;border-radius:50%;background:conic-gradient(from 0deg,transparent,rgba(250,204,21,.26),transparent 14%,rgba(134,239,172,.18),transparent 32%,rgba(56,189,248,.16),transparent 52%,rgba(250,204,21,.24),transparent 72%);filter:blur(8px);animation:spinRing 4.6s linear infinite}.flash-egg{position:relative;z-index:2;width:76%;height:76%;object-fit:contain;filter:drop-shadow(0 0 22px rgba(250,204,21,.42)) drop-shadow(0 0 18px rgba(134,239,172,.2));animation:hatchEgg 2.35s ease forwards}.flash-arceus{position:absolute;z-index:1;width:66%;height:66%;object-fit:contain;opacity:0;filter:drop-shadow(0 0 22px rgba(250,204,21,.28));animation:arceusReveal 2.35s ease forwards}.flash-crack{position:absolute;z-index:3;width:44%;height:46%;top:29%;left:28%;opacity:0;background:linear-gradient(135deg,transparent 0 22%,#fff 23% 25%,transparent 26% 43%,#fff 44% 46%,transparent 47% 63%,#fff 64% 66%,transparent 67%);filter:drop-shadow(0 0 8px white);animation:crackReveal 2.35s ease forwards}
        @keyframes hatchEgg{0%{transform:scale(.82);opacity:0}12%{opacity:1}35%{transform:scale(.95) rotate(-2deg)}50%{transform:scale(1.04) rotate(2deg)}67%{transform:scale(1.08);opacity:1}82%,100%{transform:scale(1.2);opacity:0}}
        @keyframes arceusReveal{0%,55%{opacity:0;transform:scale(.72)}72%{opacity:.38;transform:scale(.86)}100%{opacity:1;transform:scale(1)}}
        @keyframes crackReveal{0%,38%{opacity:0}52%{opacity:.45}68%{opacity:1;transform:scale(1.05)}82%,100%{opacity:0;transform:scale(1.2)}}
        @keyframes flashFade{0%,82%{opacity:1}100%{opacity:0}}@keyframes spinRing{to{transform:rotate(360deg)}}

        .overlay{position:fixed;inset:0;z-index:1700;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,.87);backdrop-filter:blur(12px)}.overlay.open{display:flex}
        .cosmos{width:min(1160px,96vw);max-height:min(92vh,980px);overflow:auto;position:relative;border:1px solid rgba(81,104,151,.58);border-radius:28px;background:radial-gradient(circle at 50% -8%,rgba(250,204,21,.08),transparent 24%),radial-gradient(circle at 88% 5%,rgba(236,72,153,.09),transparent 24%),radial-gradient(circle at 10% 16%,rgba(56,189,248,.11),transparent 24%),linear-gradient(180deg,#081424,#07111f);box-shadow:0 35px 90px rgba(0,0,0,.58),0 0 0 1px rgba(255,255,255,.025)}
        .cosmos::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.48;background-image:radial-gradient(circle at 10% 10%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 68% 18%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 28% 56%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 82% 70%,#fff 0 1px,transparent 1.4px),radial-gradient(circle at 45% 83%,#fff 0 1px,transparent 1.4px);background-size:110px 110px,150px 150px,170px 170px,130px 130px,190px 190px}
        .close{position:sticky;float:right;top:12px;right:12px;z-index:5;margin:12px 12px 0 0;width:42px;height:42px;border-radius:999px;border:1px solid #354967;background:#0b1729;color:#e7eef8;font-size:1.25rem;cursor:pointer}.close:hover{border-color:#64748b;background:#13233a}.close:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
        .cosmic-hero{position:relative;display:grid;grid-template-columns:230px 1fr;gap:24px;align-items:center;padding:34px 34px 22px}.arceus-stage{min-height:230px;display:grid;place-items:center;position:relative}.arceus-stage::before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;border:1px solid rgba(250,204,21,.22);box-shadow:0 0 34px rgba(250,204,21,.08),inset 0 0 30px rgba(56,189,248,.05)}.arceus-stage img{position:relative;z-index:1;max-width:210px;max-height:210px;filter:drop-shadow(0 10px 16px rgba(0,0,0,.38)) drop-shadow(0 0 11px rgba(250,204,21,.16))}.hero-copy .eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;border:1px solid rgba(250,204,21,.2);background:rgba(250,204,21,.055);color:#fde68a;font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.hero-copy h2{font-size:clamp(1.65rem,3vw,2.35rem);margin:11px 0 8px}.hero-copy p{margin:0;color:#a7b8cd;line-height:1.7;font-size:.91rem;max-width:760px}.hero-copy strong{color:#f5e9bd}
        .tabs{position:relative;display:flex;gap:8px;padding:0 34px 18px;flex-wrap:wrap}.tab{border:1px solid #314765;border-radius:12px;background:#0a1729;color:#98abc2;padding:9px 13px;font-size:.82rem;font-weight:900;cursor:pointer}.tab.active{color:#fff;border-color:#536b99;background:linear-gradient(135deg,rgba(37,99,235,.3),rgba(124,58,237,.3));box-shadow:0 0 18px rgba(99,102,241,.13)}
        .panel{display:none;position:relative;padding:0 34px 30px}.panel.active{display:block}.panel-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.panel-title h3{margin:0;font-size:1.02rem}.panel-title p{margin:4px 0 0;color:#8498b1;font-size:.77rem}.micro{color:#8ea5bf;font-size:.7rem;font-weight:800}
        .origin-map{border:1px solid rgba(48,69,103,.72);border-radius:22px;background:rgba(7,16,29,.72);padding:17px;display:grid;gap:10px}.origin-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.down{display:grid;place-items:center;color:#7dd3fc;opacity:.64;font-size:1.05rem}
        .legend-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.legend-group{position:relative;overflow:hidden;border:1px solid rgba(48,69,103,.72);border-radius:20px;background:linear-gradient(180deg,rgba(8,18,33,.9),rgba(7,16,29,.94));padding:14px}.legend-group::before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899,#facc15)}.legend-title{color:#dce8f6;font-size:.78rem;font-weight:900;margin-bottom:10px}.legend-orbit{display:flex;gap:7px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:thin}.myth-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:9px}
        .cosmic-node{--node-glow:56,189,248;position:relative;display:grid;justify-items:center;align-content:start;gap:4px;width:150px;padding:12px 10px;border:1px solid rgba(var(--node-glow),.26);border-radius:18px;background:linear-gradient(180deg,rgba(13,28,49,.95),rgba(7,17,31,.96));color:#f8fbff;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.17),0 0 14px rgba(var(--node-glow),.07);transition:transform .2s,border-color .2s,box-shadow .2s}
        .cosmic-node::before{content:"";position:absolute;left:50%;top:9px;width:96px;height:96px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(var(--node-glow),.16) 0%,rgba(var(--node-glow),.07) 48%,transparent 73%);opacity:.78;pointer-events:none;transition:.2s}.cosmic-node:hover,.cosmic-node:focus-visible{transform:translateY(-2px);border-color:rgba(var(--node-glow),.62);box-shadow:0 10px 26px rgba(0,0,0,.2),0 0 20px rgba(var(--node-glow),.17)}.cosmic-node:hover::before,.cosmic-node:focus-visible::before{opacity:1;background:radial-gradient(circle,rgba(var(--node-glow),.22) 0%,rgba(var(--node-glow),.09) 50%,transparent 74%)}.cosmic-node.selected{border-color:rgba(var(--node-glow),.82);box-shadow:0 10px 26px rgba(0,0,0,.2),0 0 0 1px rgba(var(--node-glow),.16),0 0 25px rgba(var(--node-glow),.24)}.cosmic-node.selected::before{opacity:1;background:radial-gradient(circle,rgba(var(--node-glow),.3) 0%,rgba(var(--node-glow),.12) 50%,transparent 74%)}.cosmic-node:focus-visible{outline:2px solid rgba(var(--node-glow),.78);outline-offset:2px}.cosmic-node img{position:relative;z-index:1;width:84px;height:84px;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(0,0,0,.32)) drop-shadow(0 0 8px rgba(var(--node-glow),.17));transition:filter .2s,transform .2s}.cosmic-node:hover img,.cosmic-node.selected img{filter:drop-shadow(0 8px 10px rgba(0,0,0,.32)) drop-shadow(0 0 12px rgba(var(--node-glow),.34));transform:scale(1.025)}.cosmic-node span{font-size:.82rem;font-weight:900}.cosmic-node small{font-size:.66rem;color:#8aa0ba;font-weight:700;line-height:1.25;text-align:center}.cosmic-node.god{width:190px;padding:16px}.cosmic-node.god img{width:112px;height:112px}.cosmic-node.mini,.cosmic-node.myth-mini{width:112px;padding:9px}.cosmic-node.mini img,.cosmic-node.myth-mini img{width:66px;height:66px}.cosmic-node.mini span,.cosmic-node.myth-mini span{font-size:.75rem}.cosmic-node.mini small,.cosmic-node.myth-mini small{display:none}
        .poke-popover{--pop-glow:56,189,248;position:fixed;z-index:1810;width:min(340px,calc(100vw - 28px));display:none;grid-template-columns:68px 1fr;gap:11px;align-items:center;padding:12px 13px;border:1px solid rgba(var(--pop-glow),.56);border-radius:17px;background:linear-gradient(145deg,rgba(9,22,40,.99),rgba(8,17,31,.99));box-shadow:0 18px 44px rgba(0,0,0,.44),0 0 22px rgba(var(--pop-glow),.18);backdrop-filter:blur(11px);pointer-events:none}.poke-popover.show{display:grid}.poke-popover img{width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.3)) drop-shadow(0 0 8px rgba(var(--pop-glow),.25))}.poke-popover strong{display:block;color:#f8fbff;font-size:.89rem;line-height:1.25}.poke-popover b{display:inline-block;margin-left:5px;color:rgb(var(--pop-glow));font-size:.68rem}.poke-popover p{margin:5px 0 0;color:#a9b9cc;font-size:.76rem;line-height:1.52}.poke-popover::after{content:"";position:absolute;width:10px;height:10px;background:#091628;border-left:1px solid rgba(var(--pop-glow),.56);border-top:1px solid rgba(var(--pop-glow),.56);transform:rotate(45deg);left:var(--arrow-x,22px);top:var(--arrow-y,-6px)}
        details.sources{margin-top:15px;border:1px solid rgba(49,69,103,.65);border-radius:16px;background:#081526;overflow:hidden}details.sources summary{cursor:pointer;padding:12px 14px;color:#bcd0e5;font-size:.78rem;font-weight:850;list-style:none}details.sources summary::-webkit-details-marker{display:none}.source-body{padding:0 14px 14px;border-top:1px solid rgba(49,69,103,.55);color:#8ca0b7;font-size:.73rem;line-height:1.6}.source-body a{color:#7dd3fc;text-underline-offset:2px}
        @media(max-width:800px){.cosmic-hero{grid-template-columns:1fr;padding:28px 18px 18px}.arceus-stage{min-height:190px}.tabs{padding:0 18px 16px}.panel{padding:0 18px 22px}.legend-grid{grid-template-columns:1fr}.panel-title{align-items:flex-start;flex-direction:column}.origin-row{gap:8px}.cosmic-node{width:calc(33.333% - 6px);min-width:94px;padding:9px 6px}.cosmic-node.god{width:170px}.cosmic-node img{width:70px;height:70px}.cosmic-node span{font-size:.74rem}.cosmic-node small{font-size:.61rem}}
        @media(max-width:520px){.egg-dock{left:9px;bottom:9px}.egg{width:68px;height:68px}.egg-hint{display:none}.overlay{padding:8px}.cosmos{width:100%;border-radius:22px;max-height:94vh}.cosmic-hero{padding:24px 14px 14px}.arceus-stage{min-height:170px}.arceus-stage img{max-width:170px;max-height:170px}.hero-copy{text-align:center}.tabs{padding:0 12px 14px;justify-content:center}.tab{font-size:.78rem}.panel{padding:0 12px 18px}.origin-map{padding:12px}.origin-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.origin-row:first-child{display:flex}.cosmic-node{width:100%;min-width:0}.cosmic-node.god{width:165px}.legend-group{padding:12px}.myth-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cosmic-node.myth-mini{width:100%}}
        @media(prefers-reduced-motion:reduce){.egg-art,.egg-aura,.flash,.flash-ring,.flash-egg,.flash-arceus,.flash-crack,.cosmic-node,.cosmic-node img{animation:none!important;transition:none!important}}
      </style>

      <div class="egg-dock">
        <button class="egg" data-stage="0" type="button" aria-label="Ovo de Pokémon GO com as cores de Arceus">
          <span class="egg-aura" aria-hidden="true"></span>
          <span class="egg-stars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <img class="egg-art" src="${A}ovo-arceus-reide.png" alt="">
          <span class="cracks" aria-hidden="true"></span>
        </button>
        <div class="egg-hint"><b>Um ovo incomum...</b><br>Parece um ovo de Pokémon GO, mas suas cores lembram Arceus.</div>
      </div>

      <div class="flash" aria-hidden="true"><div class="flash-stage"><span class="flash-ring"></span><img class="flash-arceus" src="${A}arceus.png" alt=""><img class="flash-egg" src="${A}ovo-arceus-reide.png" alt=""><span class="flash-crack"></span></div></div>

      <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="cosmos-title">
        <div class="cosmos">
          <button class="close" type="button" aria-label="Fechar a cosmogonia Pokémon">×</button>
          <div class="poke-popover" data-popover aria-live="polite"></div>
          <div class="cosmic-hero">
            <div class="arceus-stage">${img('arceus')}</div>
            <div class="hero-copy"><span class="eyebrow">✦ Segredo descoberto</span><h2 id="cosmos-title">O Ovo Original</h2><p><strong>Segundo as lendas de Sinnoh</strong>, Arceus está no centro da criação. O mapa abaixo separa a cosmogonia principal, os grandes grupos lendários e os Pokémon Míticos — sem transformar mito em uma árvore genealógica literal.</p></div>
          </div>
          <div class="tabs" role="tablist" aria-label="Cosmogonia Pokémon">
            <button class="tab active" type="button" data-tab="origin" role="tab" aria-selected="true">🌌 Origem</button>
            <button class="tab" type="button" data-tab="legendary" role="tab" aria-selected="false">⭐ Lendários</button>
            <button class="tab" type="button" data-tab="mythical" role="tab" aria-selected="false">✦ Míticos</button>
          </div>

          <section class="panel active" data-panel="origin" role="tabpanel">
            <div class="panel-title"><div><h3>Árvore mítica da criação</h3><p>O núcleo mais conhecido das lendas de Sinnoh.</p></div><span class="micro">Toque em um Pokémon para ver sua história</span></div>
            <div class="origin-map">
              <div class="origin-row">${node('arceus','god selected')}</div><div class="down">↓</div>
              <div class="origin-row">${node('dialga')}${node('palkia')}${node('giratina')}</div><div class="down">↓</div>
              <div class="origin-row">${node('uxie')}${node('mesprit')}${node('azelf')}</div>
            </div>
            <details class="sources"><summary>Como interpretar esta árvore ▾</summary><div class="source-body">Ela representa uma <strong>cosmogonia</strong>, não parentesco biológico. Materiais oficiais dizem que Arceus teria moldado tudo o que existe; Dialga é ligado ao tempo, Palkia ao espaço, Giratina ao mundo reverso e o trio dos lagos a conhecimento, emoção e vontade.</div></details>
          </section>

          <section class="panel" data-panel="legendary" role="tabpanel">
            <div class="panel-title"><div><h3>Constelações lendárias</h3><p>Os principais núcleos de Lendários das regiões, apresentados visualmente.</p></div><span class="micro">Toque para abrir a nota ao lado</span></div>
            <div class="legend-grid">${legendaryHtml}</div>
          </section>

          <section class="panel" data-panel="mythical" role="tabpanel">
            <div class="panel-title"><div><h3>Pokémon Míticos</h3><p>Seres raros ligados a tempo, sonhos, desejos, natureza, tecnologia, metal e outros mitos.</p></div><span class="micro">Toque para descobrir a lore</span></div>
            <div class="myth-grid">${mythicalHtml}</div>
            <details class="sources"><summary>Fontes e critério editorial ▾</summary><div class="source-body">As notas foram revisadas a partir da Pokédex oficial e de páginas oficiais dos jogos. Para o núcleo da criação: <a href="https://legends.arceus.pokemon.com/en-us/pokemon/arceus/" target="_blank" rel="noopener">Arceus</a> · <a href="https://diamondpearl.pokemon.com/en-au/story/" target="_blank" rel="noopener">mitos de Sinnoh</a>. Para descrições individuais, a referência principal é a <a href="https://www.pokemon.com/br/pokedex" target="_blank" rel="noopener">Pokédex oficial Pokémon</a>. Quando a franquia apresenta algo como lenda, rumor ou tradição, o GO Nexus mantém essa linguagem em vez de tratar a afirmação como fato científico do universo Pokémon.</div></details>
          </section>
        </div>
      </div>`;

      const egg=root.querySelector('.egg');
      const flash=root.querySelector('.flash');
      const overlay=root.querySelector('.overlay');
      const close=root.querySelector('.close');
      const tabs=[...root.querySelectorAll('.tab')];
      const panels=[...root.querySelectorAll('.panel')];
      const popover=root.querySelector('[data-popover]');
      let activeNode=null;
      let clicks=0,revealed=false,flashTimer=null,openTimer=null;

      const setStage=stage=>{egg.dataset.stage=String(stage);};
      const openCosmos=()=>{overlay.classList.add('open');close.focus();};
      const reveal=()=>{
        revealed=true;setStage(3);flash.classList.add('show');
        clearTimeout(flashTimer);clearTimeout(openTimer);
        openTimer=setTimeout(openCosmos,2100);
        flashTimer=setTimeout(()=>flash.classList.remove('show'),2700);
      };
      egg.addEventListener('click',()=>{
        if(revealed){openCosmos();return;}
        clicks++;
        if(clicks===1){setStage(1);}
        else if(clicks===2){setStage(2);}
        else reveal();
      });
      const closeCosmos=()=>{overlay.classList.remove('open');popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;};
      close.addEventListener('click',closeCosmos);
      overlay.addEventListener('click',e=>{if(e.target===overlay)closeCosmos();});
      root.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeCosmos();});

      tabs.forEach(tab=>tab.addEventListener('click',()=>{
        tabs.forEach(b=>{const on=b===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
        panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===tab.dataset.tab));
        popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;
      }));

      const positionPopover=(button)=>{
        const r=button.getBoundingClientRect();
        const width=Math.min(340,window.innerWidth-28),estimatedH=132,gap=10;
        let left=r.right+gap,top=r.top+(r.height-estimatedH)/2,arrowX=-6,arrowY=32;
        if(left+width>window.innerWidth-12){left=r.left-width-gap;arrowX=width-5;arrowY=32;}
        if(window.innerWidth<=700){
          left=Math.max(14,Math.min(r.left+r.width/2-width/2,window.innerWidth-width-14));
          top=r.bottom+gap;arrowX=Math.max(18,Math.min(width-28,r.left+r.width/2-left-5));arrowY=-6;
          if(top+estimatedH>window.innerHeight-12){top=r.top-estimatedH-gap;arrowY=estimatedH-5;}
        }
        top=Math.max(12,Math.min(top,window.innerHeight-estimatedH-12));
        popover.style.left=`${Math.round(left)}px`;popover.style.top=`${Math.round(top)}px`;
        popover.style.setProperty('--arrow-x',`${Math.round(arrowX)}px`);popover.style.setProperty('--arrow-y',`${Math.round(arrowY)}px`);
      };
      const showDetail=(button)=>{
        const key=button.dataset.key,p=lore[key];if(!p)return;
        root.querySelectorAll('.cosmic-node.selected').forEach(n=>n.classList.remove('selected'));
        button.classList.add('selected');activeNode=button;
        popover.style.setProperty('--pop-glow',p.glow);
        popover.innerHTML=`${img(key)}<div><strong>${p.name} <b>${p.tag}</b></strong><p>${p.text}</p></div>`;
        popover.classList.add('show');requestAnimationFrame(()=>positionPopover(button));
      };
      const popOverClose=()=>{popover.classList.remove('show');activeNode?.classList.remove('selected');activeNode=null;};
      root.querySelectorAll('.cosmic-node[data-key]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();showDetail(btn);}));
      root.addEventListener('click',e=>{if(!e.composedPath().some(el=>el?.classList?.contains?.('cosmic-node')))popOverClose();});
      root.querySelector('.cosmos').addEventListener('scroll',()=>{if(activeNode)popOverClose();},{passive:true});
      window.addEventListener('resize',()=>{if(activeNode)positionPopover(activeNode);});
    }
  }

  if(!customElements.get('go-nexus-cosmic-egg')) customElements.define('go-nexus-cosmic-egg',GoNexusCosmicEgg);
  const mountCosmicEgg=()=>{if(!document.querySelector('go-nexus-cosmic-egg'))document.body.appendChild(document.createElement('go-nexus-cosmic-egg'));};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountCosmicEgg,{once:true});else mountCosmicEgg();

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
