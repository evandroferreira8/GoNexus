"use strict";
// Scanner manual. Só abre o site quando há um clique no painel.
// Não consulta diretamente endpoints do PoGo Coordinates nem executa tarefas periódicas.
const LAT=-5.8411921, LON=-35.204105, RADIUS=1.8;
function distance(lat,lon){
 const t=Math.PI/180,dlat=(lat-LAT)*t,dlon=(lon-LON)*t;
 const a=Math.sin(dlat/2)**2+Math.cos(LAT*t)*Math.cos(lat*t)*Math.sin(dlon/2)**2;
 return 12742.0176*Math.asin(Math.min(1,Math.sqrt(a)));
}
function toEpoch(value){
 if(value===null||value===undefined||value==="")return null;
 if(typeof value==="number")return value<1e11?value*1000:value;
 const v=Date.parse(String(value));
 return Number.isFinite(v)?v:null;
}
function emptyScan(){
 return {phase:"opening",startedAt:Date.now(),finishedAt:null,observed:0,knownIV:0,inside:0,results:[],reason:""};
}
async function scanStatus(){
 const {scan=null,topic="",notify=false}=await chrome.storage.local.get(["scan","topic","notify"]);
 return {scan,configured:!!topic,notify};
}
async function update(scan){await chrome.storage.local.set({scan});}
async function sendToNtfy(topic,spawn){
 const coords=spawn.lat.toFixed(6)+","+spawn.lon.toFixed(6);
 const message="Pokémon #"+spawn.pokemon_id+" com IV 100% na UFRN\nCoordenadas: "+coords+
 (spawn.cp!=null?"\nPC: "+spawn.cp:"")+
 (spawn.expires_at?"\nDesaparece: "+new Date(spawn.expires_at).toLocaleString("pt-BR",{timeZone:"America/Fortaleza"}):"");
 const response=await fetch("https://ntfy.sh/"+encodeURIComponent(topic),{
  method:"POST",headers:{"Content-Type":"text/plain; charset=utf-8","Title":"Pokémon 100% - UFRN","Priority":"high",
  "Click":"https://maps.google.com/?q="+coords},body:message
 });
 if(!response.ok)throw new Error("ntfy HTTP "+response.status);
}
async function handleMessage(msg,sender){
 const kind=msg?.kind;
 if(kind==="RADAR_GET_STATUS")return scanStatus();
 if(kind==="RADAR_SAVE_TOPIC"){
  const topic=String(msg.topic||"").trim(),notify=msg.notify===true;
  if(!/^[A-Za-z0-9_-]{8,128}$/.test(topic))return {ok:false,error:"Tópico ntfy inválido"};
  await chrome.storage.local.set({topic,notify});
  return {ok:true};
 }
 if(kind==="RADAR_SCAN"){
  // Apenas páginas do GO Nexus, com clique iniciado pelo usuário.
  const origin=sender.url?new URL(sender.url).origin:"";
  if(!["https://evandroferreira8.github.io","https://evandroferreira8.github.io"].includes(origin))return {ok:false,error:"Origem não autorizada"};
  const {scan:old}=await chrome.storage.local.get("scan");
  if(old?.phase==="opening"||old?.phase==="searching")return {ok:false,error:"Uma consulta já está em andamento"};
  const scan=emptyScan();
  await update(scan);
  try{
   const tab=await chrome.tabs.create({url:"https://pogocoordinates.com/map",active:true});
   scan.tabId=tab.id;
   await update(scan);
   return {ok:true,tabId:tab.id};
  }catch(e){scan.phase="error";scan.reason=String(e);await update(scan);return {ok:false,error:String(e)}}
 }
 if(kind==="RADAR_MAP_READY"){
  const {scan}=await chrome.storage.local.get("scan");
  if(!scan||scan.phase!=="opening"||scan.tabId!==sender.tab?.id)return {shouldSearch:false};
  return {shouldSearch:true,lat:LAT,lon:LON};
 }
 if(kind==="RADAR_SEARCH_STARTED"){
  const {scan}=await chrome.storage.local.get("scan");
  if(!scan||scan.tabId!==sender.tab?.id||scan.phase!=="opening")return {ok:false};
  scan.phase="searching";
  scan.startedAt=Date.now();
  await update(scan);
  return {ok:true};
 }
 if(kind==="RADAR_SCAN_DATA"){
  const {scan}=await chrome.storage.local.get("scan");
  if(!scan||scan.tabId!==sender.tab?.id||scan.phase!=="searching")return {ok:false};
  const rows=Array.isArray(msg.rows)?msg.rows.slice(0,300):[];
  scan.observed+=Math.max(0,Math.min(2000,Number(msg.observed)||0));
  scan.knownIV+=Math.max(0,Math.min(2000,Number(msg.knownIV)||0));
  const ids=new Set(scan.results.map(x=>x.key));
  for(const x of rows){
   const lat=Number(x.lat),lon=Number(x.lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||distance(lat,lon)>RADIUS)continue;
   const until=toEpoch(x.expires_at);
   if(until && until<=Date.now())continue;
   const key=String(x.key||[x.pokemon_id,lat.toFixed(5),lon.toFixed(5),until||""].join(":"));
   if(ids.has(key))continue;
   ids.add(key);
   scan.results.push({
    key,pokemon_id:x.pokemon_id,lat,lon,
    cp:x.cp??null,level:x.level??null,expires_at:until,
    name:String(x.name||"")
   });
  }
  scan.results=scan.results.slice(0,100);
  await update(scan);
  return {ok:true};
 }
 if(kind==="RADAR_SCAN_FINISH"){
  const {scan,topic="",notify=false,sentKeys=[]}=await chrome.storage.local.get(["scan","topic","notify","sentKeys"]);
  if(!scan||scan.tabId!==sender.tab?.id||scan.phase!=="searching")return {ok:false};
  scan.finishedAt=Date.now();
  scan.phase=scan.observed===0?"unverified":scan.knownIV===0?"missing-iv":"complete";
  scan.reason=scan.phase==="unverified"?"Não foi possível ler registros do mapa; não é possível afirmar que não há Pokémon 100%.":scan.phase==="missing-iv"?"O mapa retornou registros, mas não expôs seus IVs para verificação.":"";
  const memo=new Set(sentKeys),next=[...memo];
  let sent=0;
  if(notify&&topic&&scan.phase==="complete"){
   for(const p of scan.results){
    if(memo.has(p.key))continue;
    try{await sendToNtfy(topic,p);memo.add(p.key);next.push(p.key);sent++}
    catch(e){scan.reason="Falha ao enviar uma notificação: "+String(e);}
   }
  }
  scan.sent=sent;
  await chrome.storage.local.set({scan,sentKeys:next.slice(-1000)});
  return {ok:true,phase:scan.phase,found:scan.results.length};
 }
 return {ok:false,error:"Mensagem não reconhecida"};
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
 handleMessage(message,sender).then(sendResponse).catch(e=>sendResponse({ok:false,error:String(e)}));
 return true;
});
