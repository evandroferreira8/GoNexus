(() => {
  "use strict";

  const ADSENSE_CLIENT = "ca-pub-REPLACE_WITH_YOUR_ID";
  const AUTO_ADS = true;
  const DISPLAY_ADS = [
    { slot: "REPLACE_WITH_TOP_SLOT", format: "auto", fullWidthResponsive: true, position: "after-header" },
    { slot: "REPLACE_WITH_CONTENT_SLOT", format: "fluid", layoutKey: "-fb+5w+4e-db+86", position: "mid-content" }
  ];

  const configured = /^ca-pub-\d{16}$/.test(ADSENSE_CLIENT);

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
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
      .gnx-ad-box{min-height:96px;border:1px solid rgba(51,72,99,.72);border-radius:14px;background:rgba(9,20,36,.46);overflow:hidden}
      .gnx-ad-wrap ins.adsbygoogle{display:block;min-height:96px}
      .gnx-policy-links{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px;font-size:.78rem}
      .gnx-policy-links a{color:#8bdcff;text-decoration:none;font-weight:800}.gnx-policy-links a:hover{text-decoration:underline;text-underline-offset:3px}
      @media(max-width:640px){.gnx-ad-wrap{width:min(100% - 18px,1120px);margin:14px auto}.gnx-ad-box{min-height:82px}.gnx-ad-wrap ins.adsbygoogle{min-height:82px}}
    `;
    document.head.appendChild(style);
  }

  function buildAd(config) {
    const wrap = document.createElement("aside");
    wrap.className = "gnx-ad-wrap";
    wrap.dataset.placement = config.position;
    wrap.setAttribute("aria-label", "Publicidade");
    wrap.innerHTML = `<span class="gnx-ad-label">Publicidade</span><div class="gnx-ad-box"><ins class="adsbygoogle" data-ad-client="${ADSENSE_CLIENT}" data-ad-slot="${config.slot}" data-ad-format="${config.format || "auto"}" data-full-width-responsive="${config.fullWidthResponsive ? "true" : "false"}"></ins></div>`;
    if (config.layoutKey) wrap.querySelector("ins").setAttribute("data-ad-layout-key", config.layoutKey);
    return wrap;
  }

  function insertAdSlots() {
    if (!configured || document.querySelector(".gnx-ad-wrap")) return;
    addStyles();

    const header = document.querySelector("go-nexus-header") || document.querySelector("header");
    const main = document.querySelector("main");
    const topConfig = DISPLAY_ADS.find((ad) => ad.position === "after-header");
    const midConfig = DISPLAY_ADS.find((ad) => ad.position === "mid-content");

    if (topConfig && header?.parentNode) {
      header.insertAdjacentElement("afterend", buildAd(topConfig));
    }

    if (midConfig && main) {
      const sections = [...main.children].filter((child) => !child.matches("script, style"));
      const anchor = sections[Math.min(2, sections.length - 1)];
      if (anchor) anchor.insertAdjacentElement("afterend", buildAd(midConfig));
      else main.appendChild(buildAd(midConfig));
    }

    document.querySelectorAll(".gnx-ad-wrap ins.adsbygoogle").forEach(() => {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
    });
  }

  function addPolicyLinks() {
    ready(() => {
      const footer = document.querySelector("go-nexus-footer");
      const target = footer?.shadowRoot?.querySelector(".inner") || document.querySelector("footer");
      if (!target || target.querySelector(".gnx-policy-links")) return;
      const links = document.createElement("p");
      links.className = "gnx-policy-links";
      links.innerHTML = '<a href="privacidade.html">Política de Privacidade</a><a href="termos.html">Termos de Uso</a>';
      target.appendChild(links);
    });
  }

  addAdSenseMeta();
  addPolicyLinks();

  if (configured) {
    loadAdSense();
    ready(insertAdSlots);
  }
})();
