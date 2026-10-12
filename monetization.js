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
    if (!configured || document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.goNexusAdsense = "true";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
    document.head.appendChild(script);
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
  // No artificial sponsored cards. Official Google AdSense remains enabled.
})();
