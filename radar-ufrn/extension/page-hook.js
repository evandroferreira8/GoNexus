// Registra SOMENTE respostas das requisicoes originais do mapa.
// Nao faz refresh, geolocalizacao, login nem requisicoes adicionais ao PoGo Coordinates.
(()=>{
"use strict";
if(window.__goNexusRadarHook)return;
window.__goNexusRadarHook=true;
const ORIGINAL=window.fetch;
window.fetch=function(...args){
 const pending=ORIGINAL.apply(this,args);
 pending.then(response=>{
  try{
   const url=new URL(response.url||String(args[0]),location.href);
   if(!url.hostname.endsWith("pogocoordinates.com")||!response.ok)return;
   const type=response.headers.get("content-type")||"";
   if(!/application\/json/i.test(type))return;
   response.clone().text().then(body=>{
    if(body.length>1500000)return;
    try{window.postMessage({source:"go-nexus-page-hook",data:JSON.parse(body)},location.origin)}catch(_){}
   }).catch(()=>{});
  }catch(_){}
 }).catch(()=>{});
 return pending;
};
const XHR=window.XMLHttpRequest;
const open=XHR.prototype.open;
XHR.prototype.open=function(method,url,...args){
 this.__goNexusUrl=String(url||"");
 return open.call(this,method,url,...args);
};
const send=XHR.prototype.send;
XHR.prototype.send=function(...args){
 this.addEventListener("load",()=>{
  try{
   const url=new URL(this.__goNexusUrl,location.href);
   if(!url.hostname.endsWith("pogocoordinates.com"))return;
   if((this.responseText||"").length>1500000)return;
   if(!/application\/json/i.test(this.getResponseHeader("Content-Type")||""))return;
   window.postMessage({source:"go-nexus-page-hook",data:JSON.parse(this.responseText)},location.origin);
  }catch(_){}
 });
 return send.apply(this,args);
};
})();
