(() => {
  "use strict";
  const STORAGE_KEY="go-nexus-theme";
  const root=document.documentElement;
  const cssLink=document.getElementById("go-nexus-theme-styles");

  if(cssLink&&cssLink.parentNode===document.head) document.head.appendChild(cssLink);

  const getTheme=()=>root.dataset.theme==="light"?"light":"dark";

  function updateThemeColor(theme){
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content",theme==="light"?"#f4f7fb":"#07111f");
  }

  function syncToggle(toggle){
    if(!toggle)return;
    const light=getTheme()==="light";
    const icon=toggle.querySelector(".theme-icon");
    const text=toggle.querySelector(".theme-text");
    if(icon)icon.textContent=light?"🌙":"☀️";
    if(text)text.textContent=light?"Escuro":"Claro";
    toggle.setAttribute("aria-label",light?"Ativar modo escuro":"Ativar modo claro");
    toggle.setAttribute("title",light?"Usar tema escuro":"Usar tema claro");
    toggle.setAttribute("aria-pressed",light?"true":"false");
  }

  function syncShadowTheme(theme){
    document.querySelectorAll("go-nexus-header,go-nexus-footer").forEach(el=>el.setAttribute("data-theme",theme));
  }

  function applyTheme(theme,save=true){
    const next=theme==="light"?"light":"dark";
    root.dataset.theme=next;
    root.style.colorScheme=next;
    updateThemeColor(next);
    syncShadowTheme(next);
    document.querySelectorAll("go-nexus-header").forEach(header=>{
      if(header.shadowRoot)syncToggle(header.shadowRoot.querySelector(".theme-toggle"));
    });
    if(save){try{localStorage.setItem(STORAGE_KEY,next)}catch(_){}}
  }

  function installHeaderThemeUI(header){
    if(!header||!header.shadowRoot)return;
    const shadow=header.shadowRoot;
    if(!shadow.getElementById("nx-theme-shadow-style")){
      const style=document.createElement("style");
      style.id="nx-theme-shadow-style";
      style.textContent="\n.theme-toggle{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:8px 11px;border:1px solid #2d3b55;border-radius:12px;background:transparent;color:#cbd5e1;font:800 .84rem/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;white-space:nowrap;cursor:pointer;transition:.18s}\n.theme-toggle:hover{background:#111b30;border-color:#415374;color:#fff}.theme-toggle:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}.theme-icon{font-size:1rem;line-height:1}\n:host([data-theme=\"dark\"]) header{background:rgba(7,17,31,.97)!important;border-bottom-color:#334863!important;box-shadow:0 8px 30px rgba(0,0,0,.18)!important}\n:host([data-theme=\"dark\"]) .subtitle{color:#a9b8ca!important}\n:host([data-theme=\"dark\"]) .navlink,:host([data-theme=\"dark\"]) summary,:host([data-theme=\"dark\"]) .theme-toggle{border-color:#334863!important;color:#d5dfeb!important}\n:host([data-theme=\"dark\"]) .menu{background:#091629!important;border-color:#3a506d!important;box-shadow:0 20px 50px rgba(0,0,0,.42)!important}\n:host([data-theme=\"dark\"]) .menu::before{background:#091629!important;border-color:#3a506d!important}\n:host([data-theme=\"dark\"]) .menu a{color:#d5dfeb!important}:host([data-theme=\"dark\"]) .tool-copy small{color:#9fb1c7!important}\n:host([data-theme=\"light\"]) header{background:rgba(255,255,255,.97)!important;border-bottom-color:#c7d3e2!important;box-shadow:0 8px 24px rgba(42,61,86,.08)!important}\n:host([data-theme=\"light\"]) .brand{color:#172033!important}:host([data-theme=\"light\"]) .subtitle{color:#52657c!important}\n:host([data-theme=\"light\"]) .navlink,:host([data-theme=\"light\"]) summary,:host([data-theme=\"light\"]) .theme-toggle{background:#fff!important;color:#334155!important;border-color:#c7d3e2!important}\n:host([data-theme=\"light\"]) .navlink:hover,:host([data-theme=\"light\"]) summary:hover,:host([data-theme=\"light\"]) .theme-toggle:hover{background:#f1f6fb!important;border-color:#aebfd1!important;color:#172033!important}\n:host([data-theme=\"light\"]) .navlink.active,:host([data-theme=\"light\"]) details.toolmenu.active>summary{background:#eef5fb!important;border-color:#9fb5cd!important;color:#172033!important;box-shadow:0 0 0 1px rgba(14,165,233,.04)!important}\n:host([data-theme=\"light\"]) .menu{background:#fff!important;border-color:#c7d3e2!important;box-shadow:0 18px 44px rgba(42,61,86,.16)!important}\n:host([data-theme=\"light\"]) .menu::before{background:#fff!important;border-left-color:#c7d3e2!important;border-top-color:#c7d3e2!important}\n:host([data-theme=\"light\"]) .menu a{color:#334155!important}:host([data-theme=\"light\"]) .menu a:hover{background:#f1f6fb!important;border-color:#d1dde8!important;color:#172033!important}\n:host([data-theme=\"light\"]) .menu a.active{background:linear-gradient(135deg,rgba(37,99,235,.10),rgba(124,58,237,.08))!important;border-color:#b4c5d7!important;color:#172033!important}\n:host([data-theme=\"light\"]) .tool-copy small{color:#60748b!important}\n@media(max-width:420px){.theme-text{display:none}.theme-toggle{width:42px;padding:8px}}\n";
      shadow.appendChild(style);
    }
    const nav=shadow.querySelector("nav");
    if(nav&&!shadow.querySelector(".theme-toggle")){
      const button=document.createElement("button");
      button.type="button";
      button.className="theme-toggle";
      button.innerHTML='<span class="theme-icon" aria-hidden="true"></span><span class="theme-text"></span>';
      button.addEventListener("click",()=>applyTheme(getTheme()==="light"?"dark":"light"));
      nav.appendChild(button);
      syncToggle(button);
    }
  }

  function installFooterThemeUI(footer){
    if(!footer||!footer.shadowRoot)return;
    const shadow=footer.shadowRoot;
    if(shadow.getElementById("nx-footer-theme-style"))return;
    const style=document.createElement("style");
    style.id="nx-footer-theme-style";
    style.textContent="\n:host([data-theme=\"dark\"]) footer{border-top-color:#273a53!important;color:#8fa2ba!important}\n:host([data-theme=\"dark\"]) strong{color:#b1c0d2!important}\n:host([data-theme=\"light\"]) footer{border-top-color:#d4dee9!important;color:#60748b!important}\n:host([data-theme=\"light\"]) strong{color:#334155!important}\n";
    shadow.appendChild(style);
  }

  function install(){
    const theme=getTheme();
    updateThemeColor(theme);
    document.querySelectorAll("go-nexus-header").forEach(header=>{
      header.setAttribute("data-theme",theme);
      installHeaderThemeUI(header);
    });
    document.querySelectorAll("go-nexus-footer").forEach(footer=>{
      footer.setAttribute("data-theme",theme);
      installFooterThemeUI(footer);
    });
  }

  install();
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",install,{once:true});
  }else{
    requestAnimationFrame(install);
  }

  const observer=new MutationObserver(()=>install());
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();