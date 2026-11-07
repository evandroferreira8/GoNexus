// Leitura pontual das respostas que a página requisita normalmente,
// ativada exclusivamente após "Pesquisar agora" no GO Nexus.
(()=>{
"use strict";
let armed=false,complete=false;
const CENTER_LAT=-5.8411921,CENTER_LON=-35.204105,RADIUS_KM=1.8;
function inside(lat,lon){const r=Math.PI/180,dl=(lat-CENTER_LAT)*r,dn=(lon-CENTER_LON)*r;
 const a=Math.sin(dl/2)**2+Math.cos(lat*r)*Math.cos(CENTER_LAT*r)*Math.sin(dn/2)**2;
 return 12742.0176*Math.asin(Math.min(1,Math.sqrt(a)))<=RADIUS_KM;
}
function extract(data){
 const stack=[data],seen=new WeakSet(),rows=[];
 let candidates=0,knownIV=0,walked=0;
 while(stack.length&&walked++<30000){
  const o=stack.pop();
  if(!o||typeof o!=="object"||seen.has(o))continue;
  seen.add(o);
  if(Array.isArray(o)){for(const x of o)stack.push(x);continue}
  const id=o.pokemon_id??o.pokemonId??o.pokemon?.id;
  const lat=Number(o.lat??o.latitude??o.apx_lat??o.location?.lat);
  const lon=Number(o.lon??o.lng??o.longitude??o.apx_long??o.location?.lon);
  if(id!=null && Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180&&inside(lat,lon)){
   candidates++;
   const atk=o.attack_iv??o.atk_iv??o.individual_attack,
         def=o.defense_iv??o.def_iv??o.individual_defense,
         sta=o.stamina_iv??o.hp_iv??o.individual_stamina,
         iv=o.percent_iv??o.iv_percent??o.iv;
   const triple=[atk,def,sta].every(v=>v!==undefined&&v!==null);
   const validIV=triple || (iv!=null && Number.isFinite(Number(iv)));
   if(validIV)knownIV++;
   const perfect=triple?[atk,def,sta].every(v=>Number(v)===15):iv!=null&&Number(iv)===100;
   if(perfect){
    rows.push({
     pokemon_id:id,lat,lon,cp:o.cp??null,level:o.level??null,
     name:o.pokemon_name??o.name??"",
     key:String(o.id??o.encounter_id??""),
     expires_at:o.expires_at??o.despawn_at??o.despawn_at_ms??null
    });
   }
  }
  for(const v of Object.values(o))if(v&&typeof v==="object")stack.push(v);
 }
 return {rows:rows.slice(0,300),observed:candidates,knownIV};
}
window.addEventListener("message",event=>{
 if(!armed||complete||event.source!==window||event.origin!==location.origin||event.data?.source!=="go-nexus-page-hook")return;
 const d=extract(event.data.data);
 if(d.observed)chrome.runtime.sendMessage({kind:"RADAR_SCAN_DATA",...d}).catch(()=>{});
});
async function centerSearch(lat,lon){
 const target=lat+","+lon;
 const start=Date.now();
 while(Date.now()-start<18000){
  const input=document.querySelector('input[aria-label="Search for a place"]')||
              document.querySelector('input[placeholder*="Search"]');
  const go=[...document.querySelectorAll("button")].find(b=>b.textContent.trim()==="Go");
  if(input&&go){
   const proto=Object.getPrototypeOf(input);
   const setter=Object.getOwnPropertyDescriptor(proto,"value")?.set;
   if(setter)setter.call(input,target);else input.value=target;
   input.dispatchEvent(new Event("input",{bubbles:true}));
   input.dispatchEvent(new Event("change",{bubbles:true}));
   await chrome.runtime.sendMessage({kind:"RADAR_SEARCH_STARTED"});
   armed=true;
   go.click();
   setTimeout(()=>{
    if(complete)return;
    complete=true;
    armed=false;
    chrome.runtime.sendMessage({kind:"RADAR_SCAN_FINISH"}).catch(()=>{});
   },18000);
   return;
  }
  await new Promise(r=>setTimeout(r,250));
 }
 await chrome.runtime.sendMessage({kind:"RADAR_SEARCH_STARTED"});
 await chrome.runtime.sendMessage({kind:"RADAR_SCAN_FINISH"});
}
async function init(){
 try{
  for(let attempt=0;attempt<15;attempt++){
   const answer=await chrome.runtime.sendMessage({kind:"RADAR_MAP_READY"});
   if(answer?.shouldSearch){await centerSearch(answer.lat,answer.lon);return;}
   await new Promise(r=>setTimeout(r,400));
  }
 }catch(e){console.debug("Radar UFRN:",e)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();
