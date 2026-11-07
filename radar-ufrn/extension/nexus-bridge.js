// Ponte de leitura do painel GO Nexus para a extensão local.
window.addEventListener("message",event=>{
 if(event.source!==window||event.origin!==location.origin||event.data?.source!=="go-nexus-radar-web"||event.data.type!=="status")return;
 chrome.runtime.sendMessage({kind:"RADAR_GET_STATUS"}).then(data=>{
  window.postMessage({source:"go-nexus-radar-extension",type:"status",payload:data},location.origin);
 }).catch(()=>{});
});
