(() => {
  "use strict";

  const ADSENSE_CLIENT = "ca-pub-1181520921367951";
  const MANUAL_ADS = [];
  const configured = /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT);

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  function addAdSenseMeta() {
    if (!configured || document.querySelector('meta[name="google-adsense-account"]')) return;
    const meta = document.createElement("meta");
    meta.name = "google-adsense-account";
    meta.content = ADSENSE_CLIENT;
    document.head.appendChild(meta);
  }

  function loadAdSense() {
    if (!configured || document.querySelector("script[data-go-nexus-adsense]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.goNexusAdsense = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
    document.head.appendChild(script);
  }

  function addStyles() {
    if (document.getElementById("go-nexus-ad-styles")) return;
    const style = document.createElement("style");
    style.id = "go-nexus-ad-styles";
    style.textContent = `
      .gnx-ad-wrap{width:min(1120px,calc(100% - 28px));margin:18px auto;display:block;clear:both}
      .gnx-ad-wrap[data-placement="mid-content"]{margin-top:28px;margin-bottom:28px}
      .gnx-ad-label{display:block;margin:0 0 6px;color:#71849d;font:700 11px/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-transform:uppercase;letter-spacing:.08em;text-align:center}
      .gnx-sponsor-card{display:grid;grid-template-columns:1fr auto;align-items:center;gap:14px;min-height:96px;padding:16px 18px;border:1px solid rgba(51,72,99,.72);border-radius:14px;background:linear-gradient(135deg,rgba(56,189,248,.10),rgba(139,92,246,.08)),#091426;color:#e5eefb;text-decoration:none}
      .gnx-sponsor-card strong{display:block;margin-bottom:4px;color:#f8fafc;font-size:1rem}.gnx-sponsor-card span{display:block;color:#a9b8ca;font-size:.86rem;line-height:1.45}.gnx-sponsor-card b{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;border:1px solid #45607f;border-radius:999px;color:#dff6ff;font-size:.82rem;white-space:nowrap}.gnx-sponsor-card:hover{border-color:#5f7fab;background:linear-gradient(135deg,rgba(56,189,248,.16),rgba(139,92,246,.12)),#0b1729}
      .gnx-policy-links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px;font-size:.78rem}.gnx-policy-links a{color:#8bdcff;text-decoration:none;font-weight:800}.gnx-policy-links a:hover{text-decoration:underline;text-underline-offset:3px}
      @media(max-width:640px){.gnx-ad-wrap{width:min(100% - 18px,1120px);margin:14px auto}.gnx-sponsor-card{grid-template-columns:1fr;min-height:0;padding:14px}.gnx-sponsor-card b{width:max-content}}
    `;
    document.head.appendChild(style);
  }

  function buildSponsorFallback(position) {
    const wrap = document.createElement("aside");
    wrap.className = "gnx-ad-wrap";
    wrap.dataset.placement = position;
    wrap.setAttribute("aria-label", "Espaco patrocinado");
    wrap.innerHTML = `<span class="gnx-ad-label">Espaco patrocinado</span><a class="gnx-sponsor-card" href="anuncie.html"><span><strong>Anuncie no GO Nexus</strong><span>Alcance treinadores que consultam guias, calculadoras e ferramentas de Pokemon GO.</span></span><b>Ver midia kit</b></a>`;
    return wrap;
  }

  function insertSponsorSlots() {
    if (MANUAL_ADS.length || document.querySelector(".gnx-ad-wrap")) return;
    addStyles();
    const header = document.querySelector("go-nexus-header") || document.querySelector("header");
    const main = document.querySelector("main");

    if (header?.parentNode) header.insertAdjacentElement("afterend", buildSponsorFallback("after-header"));

    if (main) {
      const sections = [...main.children].filter((child) => !child.matches("script, style"));
      const anchor = sections[Math.min(2, sections.length - 1)];
      const slot = buildSponsorFallback("mid-content");
      if (anchor) anchor.insertAdjacentElement("afterend", slot);
      else main.appendChild(slot);
    }
  }

  function addPolicyLinks() {
    ready(() => {
      const footer = document.querySelector("go-nexus-footer");
      const target = footer?.shadowRoot?.querySelector(".inner") || document.querySelector("footer");
      if (!target || target.querySelector(".gnx-policy-links")) return;
      const links = document.createElement("p");
      links.className = "gnx-policy-links";
      links.innerHTML = '<a href="anuncie.html">Anuncie</a><a href="privacidade.html">Política de Privacidade</a><a href="termos.html">Termos de Uso</a>';
      target.appendChild(links);
    });
  }

  addAdSenseMeta();
  addPolicyLinks();
  if (configured) loadAdSense();
  ready(insertSponsorSlots);
})();
