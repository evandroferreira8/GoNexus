(() => {
  "use strict";

  const root = document.documentElement;

  function enforceDarkTheme() {
    root.dataset.theme = "dark";
    root.style.colorScheme = "dark";

    try {
      localStorage.removeItem("go-nexus-theme");
    } catch (_) {}

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#07111f");

    document.querySelectorAll("go-nexus-header, go-nexus-footer").forEach((el) => {
      el.setAttribute("data-theme", "dark");
    });
  }

  enforceDarkTheme();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceDarkTheme, { once: true });
  }

  const observer = new MutationObserver(enforceDarkTheme);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
