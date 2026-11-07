"use strict";
const LAT=-5.8411921,LON=-35.204105,RADIUS=1.8;
function distance(lat,lon){
 const toRad=Math.PI/180,dlat=(lat-LAT)*toRad,dlon=(lon-LON)*toRad;
 const a=Math.sin(dlat/2)**2+Math.cos(LAT*toRad)*Math.cos(lat*toRad)*Math.sin(dlon/2)**2;
 return 12742.0176*Math.asin(Math.min(1,Math.sqrt(a)));
}
function expiry(value){
 if(!value)return null;
 if(typeof value==="number")return value<1e11?value*1000:value;
 const stamp=Date.parse(value);return Number.isFinite(stamp)?stamp:null;
}
async function publish(topic,spawn){
 const coords=spawn.lat.toFixed(6)+","+spawn.lon.toFixed(6);
 const payload="Pokemon #"+spawn.pokemon_id+" - IV 100% (15/15/15)\n"+
   "UFRN e entorno - "+coords+
   (spawn.cp!==null?"\nPC: "+spawn.cp:"")+
   (spawn.expires_at?"\nExpira: "+new Date(expiry(spawn.expires_at)).toLocaleString("pt-BR",{timeZone:"America/Fortaleza"}):"");
 const response=await fetch("https://ntfy.sh/"+encodeURIComponent(topic),{
  method:"POST",headers:{"Content-Type":"text/plain; charset=utf-8","Title":"Pokemon 100% na UFRN","Priority":"high","Click":"https://maps.google.com/?q="+coords},
  body:payload
 });
 if(!response.ok)throw new Error("ntfy HTTP "+response.status);
}
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg?.kind==="RADAR_GET_STATUS"){
  chrome.storage.local.get(["state","topic"]).then(({state,topic})=>{
   sendResponse({state:state||null,configured:!!topic});
  });
  return true;
 }
 if(msg?.kind==="RADAR_SAVE_TOPIC"){
  const topic=String(msg.topic||"").trim();
  if(!/^[a-zA-Z0-9_-]{8,128}$/.test(topic)){sendResponse({ok:false,error:"Canal inválido"});return;}
  chrome.storage.local.set({topic}).then(()=>sendResponse({ok:true}));
  return true;
 }
 if(msg?.kind!=="RADAR_SPawns"||!sender.url?.startsWith("https://pogocoordinates.com/map"))return;
 (async()=>{
  const {state={},topic=""}=await chrome.storage.local.get(["state","topic"]);
  const notified=state.notified||{};
  const now=Date.now(),newHits=[];
  for(const spawn of (Array.isArray(msg.spawns)?msg.spawns:[])){
   const lat=Number(spawn.lat),lon=Number(spawn.lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||distance(lat,lon)>RADIUS)continue;
   const until=expiry(spawn.expires_at);
   if(until&&until<=now)continue;
   const key=spawn.key||[spawn.pokemon_id,lat.toFixed(5),lon.toFixed(5),until||""].join(":");
   if(notified[key]&&notified[key]>now-24*3600e3)continue;
   newHits.push({...spawn,key,expires_at:until});
  }
  let sent=0,failed=0;
  for(const spawn of newHits){
   if(!topic)break;
   try{await publish(topic,spawn);notified[spawn.key]=now;sent++}
   catch(err){failed++;console.error("ntfy:",err)}
  }
  const freshNotified=Object.fromEntries(Object.entries(notified).filter(([_,time])=>time>now-2*86400000));
  const latest=[...newHits.slice(0,20),...(state.latest||[])].slice(0,30);
  const next={lastChecked:now,lastScanCount:msg.spawns.length,lastMatches:newHits.length,lastSent:sent,lastErrors:failed,latest,notified:freshNotified};
  await chrome.storage.local.set({state:next});
  sendResponse({ok:true,sent,found:newHits.length,configured:!!topic});
 })().catch(error=>sendResponse({ok:false,error:String(error)}));
 return true;
});
