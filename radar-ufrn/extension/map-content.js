// Processamento local: guarda somente registros de Pokémon com IV explicitamente conhecido.
(()=>{
"use strict";
const LIMIT=18000;
function collect(data){
 const found=[],stack=[data],seen=new WeakSet();
 let scanned=0;
 while(stack.length&&scanned++<LIMIT&&found.length<300){
  const item=stack.pop();
  if(!item||typeof item!=="object"||seen.has(item))continue;
  seen.add(item);
  if(Array.isArray(item)){for(const el of item)stack.push(el);continue;}
  const id=item.pokemon_id??item.pokemonId??item.pokemon?.id;
  const lat=Number(item.lat??item.latitude??item.apx_lat??item.location?.lat);
  const lon=Number(item.lon??item.lng??item.longitude??item.apx_long??item.location?.lon);
  if(id!==undefined&&Number.isFinite(lat)&&Number.isFinite(lon)){
   const attack=item.attack_iv??item.atk_iv??item.individual_attack;
   const defense=item.defense_iv??item.def_iv??item.individual_defense;
   const stamina=item.stamina_iv??item.hp_iv??item.individual_stamina;
   const iv=item.percent_iv??item.iv_percent??item.iv;
   const hasTriple=[attack,defense,stamina].every(v=>v!==undefined&&v!==null);
   const perfect=hasTriple? [attack,defense,stamina].every(v=>Number(v)===15):iv!==undefined&&iv!==null&&Number(iv)===100;
   if(perfect) found.push({
    pokemon_id:id,lat,lon,name:String(item.pokemon_name??item.name??""),
    cp:item.cp??null,level:item.level??null,
    expires_at:item.expires_at??item.despawn_at??item.despawn_at_ms??null,
    key:String(item.id??item.encounter_id??"")
   });
  }
  for(const value of Object.values(item))if(value&&typeof value==="object")stack.push(value);
 }
 return found;
}
window.addEventListener("message",event=>{
 if(event.source!==window||event.origin!==location.origin||event.data?.source!=="go-nexus-page-hook")return;
 const matched=collect(event.data.data);
 if(matched.length)chrome.runtime.sendMessage({kind:"RADAR_SPawns",spawns:matched}).catch(()=>{});
});
})();
