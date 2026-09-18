(() => {
  const FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLSem76XFAbhD59iByOcJGgVR8tvYhuROQXgmUWOtKPatzjTGBA/viewform?usp=publish-editor";
  const pages = [
    { file:"index.html", icon:"🔎", label:"Guia de Busca" },
    { file:"calculadora.html", icon:"🧮", label:"Vale a Caixa?" },
    { file:"efeitos-aventura.html", icon:"⚡", label:"Efeitos Aventura" },
    { file:"poeira-estelar.html", icon:"✨", label:"Poeira Estelar" }
  ];
  const current = location.pathname.split("/").pop() || "index.html";
  function buildMenu(){
    const menu = document.querySelector(".gn-header .navlinks");
    if(!menu) return;
    menu.innerHTML = pages.map(p => {
      const active = current === p.file ? ' class="active" aria-current="page"' : "";
      return `<a href="${p.file}"${active}>${p.icon} ${p.label}</a>`;
    }).join("") + `<a href="${FEEDBACK}" target="_blank" rel="noopener noreferrer">💬 Feedback</a>`;
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", buildMenu)
    : buildMenu();
})();