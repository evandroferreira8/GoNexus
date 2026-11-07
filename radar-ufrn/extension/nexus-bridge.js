// Permite ao botão da página do GO Nexus iniciar uma varredura local.
window.addEventListener("message",event=>{
 if(event.source!==window||event.origin!==location.origin||event.data?.source!=="go-nexus-radar-web")return;
 let msg;
 if(event.data.type==="status")msg={kind:"RADAR_GET_STATUS"};
 else if(event.data.type==="scan")msg={kind:"RADAR_SCAN"};
 else return;
 chrome.runtime.sendMessage(msg).then(response=>{
  window.postMessage({
   source:"go-nexus-radar-extension",
   type:event.data.type==="scan"?"scan-result":"status",
   payload:response
  },location.origin);
 }).catch(error=>{
  window.postMessage({source:"go-nexus-radar-extension",type:"error",payload:{error:String(error)}},location.origin)
 });
});
