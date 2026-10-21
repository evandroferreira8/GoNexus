/* AREA SELVAGEM GO — complementos MOBILE 2.1
   Melhorias progressivas: sem conexões, sem armazenar dados, sem alterar conteúdo. */
(() => {
 "use strict";
 const root = document.querySelector(".wa-wrap");
 if (!root) return;
 const isMobile = window.matchMedia("(max-width: 900px)");
 const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
 const bar = document.getElementById("waProgressBar");
 const topButton = document.getElementById("waTopButton");
 const perks = document.getElementById("waPerksToggle");
 const paid = document.querySelector(".wa-ticket-card.paid");
 const nav = document.querySelector(".wa-local-nav");
 const anchors = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
 const sections = anchors.map(a => ({
   anchor:a,
   section:document.getElementById(a.getAttribute("href").slice(1))
 })).filter(x=>x.section);
 let frame=0;
 function updateViewport() {
   frame=0;
   const mobile = isMobile.matches;
   const total = Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   if(bar) bar.style.transform = "scaleX("+Math.min(1,Math.max(0,window.scrollY/total))+")";
   if(topButton) topButton.hidden = !mobile || window.scrollY < Math.min(650, window.innerHeight*.75);
   if (!mobile) return;
   const marker = Math.min(window.innerHeight*.42,230);
   let current = null;
   for(const item of sections) {
     if(item.section.getBoundingClientRect().top <= marker)current=item.anchor;
   }
   anchors.forEach(a=>{
     if(a===current) a.setAttribute("aria-current","location");
     else a.removeAttribute("aria-current");
   });
 }
 function queueUpdate(){if(!frame)frame=window.requestAnimationFrame(updateViewport);}
 window.addEventListener("scroll",queueUpdate,{passive:true});
 window.addEventListener("resize",queueUpdate,{passive:true});
 if(typeof isMobile.addEventListener==="function")isMobile.addEventListener("change",queueUpdate);
 queueUpdate();
 if(topButton)topButton.addEventListener("click",()=>{
   window.scrollTo({top:0,behavior:reduceMotion.matches?"auto":"smooth"});
 });
 if(perks&&paid){
   perks.addEventListener("click",()=>{
     const expanded=perks.getAttribute("aria-expanded")!=="true";
     perks.setAttribute("aria-expanded",String(expanded));
     paid.classList.toggle("wa-expanded",expanded);
     perks.innerHTML=expanded?'Mostrar menos vantagens <span aria-hidden="true">↑</span>':'Ver todas as vantagens <span aria-hidden="true">↓</span>';
     if(!expanded && paid.getBoundingClientRect().top<0){
       paid.scrollIntoView({block:"start",behavior:reduceMotion.matches?"instant":"smooth"});
     }
     queueUpdate();
   });
 }
 // Gentle content change, triggered by actual user input, never by automatic polling.
 function animateSwap(node) {
   if (!isMobile.matches || reduceMotion.matches || !node) return;
   node.classList.remove("wa-content-swap");
   void node.offsetWidth;
   node.classList.add("wa-content-swap");
 }
 document.querySelectorAll("[data-day]").forEach(button=>{
   button.addEventListener("click",()=>{
     const day=button.dataset.day;
     animateSwap(document.getElementById(day==="sat"?"waSaturday":"waSunday"));
     animateSwap(document.getElementById("waMightyList"));
     queueUpdate();
   });
 });
 document.querySelectorAll("[data-biome]").forEach(button=>{
   button.addEventListener("click",()=>{
     animateSwap(document.getElementById("waSpawns"));
     queueUpdate();
   });
 });
 const more = document.getElementById("waShowAll");
 if(more)more.addEventListener("click",queueUpdate);
 // Reveal content only after the observer is ready. No-JS pages remain fully visible.
 if("IntersectionObserver" in window && !reduceMotion.matches) {
   const candidates=[...root.querySelectorAll(".wa-section,.wa-mission,.wa-finale")];
   const pending=candidates.filter(el=>el.getBoundingClientRect().top>window.innerHeight*.9);
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(!entry.isIntersecting)continue;
       entry.target.classList.add("wa-reveal-visible");
       observer.unobserve(entry.target);
     }
   },{rootMargin:"0px 0px -7% 0px",threshold:.06});
   for(const el of pending){el.classList.add("wa-reveal-pending");observer.observe(el);}
   root.classList.add("wa-motion-ready");
 }
 // Suspend decorative animation when the relevant city zone leaves the screen.
 if("IntersectionObserver" in window) {
   const atmospheric=[document.querySelector(".wa-hero"),document.querySelector(".wa-capture-intro")].filter(Boolean);
   const ambientObserver=new IntersectionObserver(entries=>{
     entries.forEach(entry=>entry.target.classList.toggle("wa-ambient-paused",!entry.isIntersecting));
   },{rootMargin:"100px 0px 100px 0px",threshold:0});
   atmospheric.forEach(node=>ambientObserver.observe(node));
 }
 // Pause infinite ambient effects when the tab is hidden or user saves data.
 if(navigator.connection?.saveData)document.body.classList.add("wa-low-power");
 document.addEventListener("visibilitychange",()=>{
   document.body.classList.toggle("wa-paused",document.hidden);
 });
})();
