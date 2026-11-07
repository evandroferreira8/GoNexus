const topic=document.getElementById("topic"),status=document.getElementById("status");
async function refresh(){
 const {topic:saved}=await chrome.storage.local.get("topic");
 topic.value=saved||"";
 const {state,configured}=await chrome.runtime.sendMessage({kind:"RADAR_GET_STATUS"});
 status.textContent=!configured?"Configure o canal ntfy para enviar notificações.":
   !state?.lastChecked?"Canal configurado. Aguardando registros do mapa aberto.":
   "Último registro analisado: "+new Date(state.lastChecked).toLocaleString("pt-BR")+
   " · 100% na área: "+(state.lastMatches||0)+" · alertas enviados: "+(state.lastSent||0);
}
document.getElementById("save").onclick=async()=>{
 const res=await chrome.runtime.sendMessage({kind:"RADAR_SAVE_TOPIC",topic:topic.value});
 status.textContent=res.ok?"Canal salvo neste navegador.":"Erro: "+(res.error||"Falha");
};
document.getElementById("map").onclick=()=>chrome.tabs.create({url:"https://pogocoordinates.com/map"});
refresh().catch(e=>status.textContent=String(e));
