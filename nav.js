(() => {
  "use strict";

  const FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLSem76XFAbhD59iByOcJGgVR8tvYhuROQXgmUWOtKPatzjTGBA/viewform?usp=publish-editor";
  const PAGES = [
    { file: "index.html", icon: "🔎", label: "Guia de Busca" },
    { file: "calculadora.html", icon: "🧮", label: "Vale a Caixa?" },
    { file: "efeitos-aventura.html", icon: "⚡", label: "Efeitos Aventura" },
    { file: "poeira-estelar.html", icon: "✨", label: "Poeira Estelar" },
    { file: "evolucoes-especiais.html", icon: "🧬", label: "Evoluções Especiais" }
  ];

  const baseStyles = `
    :host, *, *::before, *::after { box-sizing: border-box; }
    :host {
      display: block;
      width: 100%;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
  `;

  function currentFile() {
    const file = location.pathname.split("/").filter(Boolean).pop();
    return file && file.includes(".") ? file : "index.html";
  }

  class GoNexusHeader extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const current = currentFile();
      const nav = PAGES.map(page => {
        const active = current === page.file;
        return `<a href="${page.file}"${active ? ' class="active" aria-current="page"' : ""}><span class="icon" aria-hidden="true">${page.icon}</span><span>${page.label}</span></a>`;
      }).join("") + `<a href="${FEEDBACK}" target="_blank" rel="noopener noreferrer"><span class="icon" aria-hidden="true">💬</span><span>Feedback</span></a>`;

      const root = this.attachShadow({mode:"open"});
      root.innerHTML = `
        <style>
          ${baseStyles}
          header {
            width: 100%;
            margin: 0;
            padding: 0;
            background: rgba(7, 17, 31, .96);
            border-bottom: 1px solid #263653;
            box-shadow: 0 8px 30px rgba(0,0,0,.18);
          }
          .bar {
            width: min(1180px, 100%);
            min-height: 76px;
            margin: 0 auto;
            padding: 13px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
          }
          .identity { flex: 0 0 auto; min-width: 0; }
          .brand {
            display: inline-block;
            margin: 0;
            color: #f8fafc;
            text-decoration: none;
            font-size: 1.18rem;
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: .035em;
          }
          .brand .nexus {
            background: linear-gradient(90deg,#38bdf8,#8b5cf6,#ec4899);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 0 8px rgba(139,92,246,.20));
          }
          .subtitle {
            margin-top: 5px;
            color: #94a3b8;
            font-size: .78rem;
            font-weight: 500;
            line-height: 1.35;
            white-space: nowrap;
          }
          nav {
            min-width: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 7px;
          }
          nav a {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            min-height: 36px;
            padding: 8px 10px;
            border: 1px solid #2d3b55;
            border-radius: 11px;
            background: transparent;
            color: #cbd5e1;
            text-decoration: none;
            font-size: .82rem;
            font-weight: 800;
            line-height: 1.2;
            white-space: nowrap;
            transition: background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease;
          }
          nav a:hover { background:#111b30; border-color:#415374; color:#fff; }
          nav a:focus-visible { outline:2px solid #38bdf8; outline-offset:2px; }
          nav a.active {
            background:#141e34;
            border-color:#435777;
            color:#fff;
            box-shadow:0 0 18px rgba(56,189,248,.12);
          }
          .icon { line-height: 1; }
          @media (max-width: 900px) {
            .bar { align-items:flex-start; flex-direction:column; gap:13px; padding-top:16px; padding-bottom:16px; }
            nav { width:100%; justify-content:flex-start; }
          }
          @media (max-width: 560px) {
            .bar { padding:15px 14px; gap:12px; }
            .brand { font-size:1.08rem; }
            .subtitle { font-size:.75rem; white-space:normal; }
            nav { gap:6px; }
            nav a { min-height:34px; padding:7px 9px; font-size:.78rem; border-radius:10px; }
          }
          @media (max-width: 360px) {
            nav a { padding:7px 8px; font-size:.75rem; }
          }
        </style>
        <header>
          <div class="bar">
            <div class="identity">
              <a class="brand" href="index.html" aria-label="GO Nexus — página inicial">GO <span class="nexus">NEXUS</span></a>
              <div class="subtitle">Guias e ferramentas para sua jornada no Pokémon GO</div>
            </div>
            <nav aria-label="Navegação principal">${nav}</nav>
          </div>
        </header>`;
    }
  }

  class GoNexusFooter extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:"open"});
      root.innerHTML = `
        <style>
          ${baseStyles}
          footer {
            width:100%;
            margin:48px 0 0;
            padding:0;
            border-top:1px solid #182238;
            background:transparent;
            color:#718096;
            text-align:center;
          }
          .inner {
            width:min(1180px,100%);
            margin:0 auto;
            padding:24px 20px 32px;
            font-size:.78rem;
            font-weight:500;
            line-height:1.65;
          }
          strong { color:#94a3b8; font-weight:800; }
          .line { margin:0; }
          @media (max-width:560px) {
            footer { margin-top:38px; }
            .inner { padding:21px 14px 27px; font-size:.72rem; line-height:1.7; }
          }
        </style>
        <footer>
          <div class="inner">
            <p class="line"><strong>GO Nexus</strong></p>
            <p class="line">Desenvolvido por <strong>DelorisNyx</strong> · Código de amizade: <strong>8596 0928 0640</strong></p>
            <p class="line">© 2026 · Todos os direitos reservados.</p>
            <p class="line">Projeto independente e não oficial. Pokémon e Pokémon GO pertencem aos seus respectivos titulares.</p>
          </div>
        </footer>`;
    }
  }

  if (!customElements.get("go-nexus-header")) customElements.define("go-nexus-header", GoNexusHeader);
  if (!customElements.get("go-nexus-footer")) customElements.define("go-nexus-footer", GoNexusFooter);
})();
