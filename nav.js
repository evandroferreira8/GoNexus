(() => {
  const FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLSem76XFAbhD59iByOcJGgVR8tvYhuROQXgmUWOtKPatzjTGBA/viewform?usp=publish-editor";

  const pages = [
    { file: "index.html", icon: "🔎", label: "Guia de Busca" },
    { file: "calculadora.html", icon: "🧮", label: "Vale a Caixa?" },
    { file: "efeitos-aventura.html", icon: "⚡", label: "Efeitos Aventura" },
    { file: "poeira-estelar.html", icon: "✨", label: "Poeira Estelar" }
  ];

  const currentFile = () => location.pathname.split("/").pop() || "index.html";

  function findMenu() {
    return document.querySelector(".navlinks")
      || document.querySelector('nav[aria-label="Navegação principal"]')
      || document.querySelector("header nav")
      || document.querySelector("nav");
  }

  function buildMenu() {
    const menu = findMenu();
    if (!menu) return;
    const current = currentFile();

    menu.innerHTML = pages.map(page => {
      const active = current === page.file ? ' class="active"' : "";
      const aria = current === page.file ? ' aria-current="page"' : "";
      return `<a${active}${aria} href="${page.file}">${page.icon} ${page.label}</a>`;
    }).join("") +
    `<a href="${FEEDBACK}" target="_blank" rel="noopener noreferrer">💬 Feedback</a>`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildMenu);
  } else {
    buildMenu();
  }
})();