"use strict";
const topic=document.getElementById("topic"),notify=document.getElementById("notify"),status=document.getElementById("status");
async function refresh(){
 const pref=await chrome.storage.local.get(["topic","notify"]);
 topic.value=pref.topic||"";
 notify.checked=pref.notify===true;
 const {scan,configured}=await chrome.runtime.sendMessage({kind:"RADAR_GET_STATUS"});
 status.textContent=!scan?"Nenhuma pesquisa feita. Abra o GO Nexus e use o botão de pesquisa.":
   "Última consulta: "+(scan.finishedAt?new Date(scan.finishedAt).toLocaleString("pt-BR"):"em andamento")+
   " · Situação: "+scan.phase+
   " · Pokémon 100%: "+(scan.results||[]).length+
   (configured?" · ntfy configurado":" · ntfy não configurado");
}
document.getElementById("save").addEventListener("click",async()=>{
 const res=await chrome.runtime.sendMessage({kind:"RADAR_SAVE_TOPIC",topic:topic.value,notify:notify.checked});
 status.textContent=res.ok?"Preferências salvas. As notificações são opcionais e só ocorrem após pesquisa manual.":"Erro: "+(res.error||"Falha ao salvar");
});
document.getElementById("map").onclick=()=>chrome.tabs.create({url:"https://pogocoordinates.com/map"});
refresh().catch(e=>status.textContent=String(e));
