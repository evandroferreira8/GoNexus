(() => {
  "use strict";

  const root = document.documentElement;

  function enforceStudioTheme() {
    root.dataset.theme = "light";
    root.style.colorScheme = "light";

    try {
      localStorage.removeItem("go-nexus-theme");
    } catch (_) {}

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#f8f9fb");

    document.querySelectorAll("go-nexus-header, go-nexus-footer").forEach((el) => {
      el.setAttribute("data-theme", "dark");
    });
  }

  function loadMonetization() {
    if (document.querySelector('script[src^="monetization.js"]')) return;
    const script = document.createElement("script");
    script.src = "monetization.js?v=20260922";
    script.defer = true;
    document.head.appendChild(script);
  }

  enforceStudioTheme();
  loadMonetization();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceStudioTheme, { once: true });
  }

  // O tema é aplicado no carregamento e novamente após o DOM estar pronto.
  // Observar cada atualização da página gerava trabalho extra desnecessário.
})();
