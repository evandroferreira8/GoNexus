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

  // Navigation already contains Anuncie/Privacidade/Termos in the shared footer.
  // Do not append an unstyled second copy from the monetization loader.

  addAdSenseMeta();
  if (configured) loadAdSense();
  // No artificial sponsored cards. Official Google AdSense remains enabled.
})();
