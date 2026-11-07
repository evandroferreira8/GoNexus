import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const content=fs.readFileSync("radar-ufrn/extension/background.js","utf8");
const data={};
const listeners=[];
const storage={
 async get(keys){
  const names=typeof keys==="string"?[keys]:Array.isArray(keys)?keys:Object.keys(keys);
  const out={};for(const k of names){if(k in data)out[k]=data[k];else if(!Array.isArray(keys)&&typeof keys==="object")out[k]=keys[k];}
  return out;
 },
 async set(next){Object.assign(data,next);}
};
let opened=0,posts=0;
const fakeChrome={
 storage:{local:storage},
 tabs:{async create({url}){assert.equal(url,"https://pogocoordinates.com/map");opened++;return {id:100};}},
 runtime:{onMessage:{addListener(fn){listeners.push(fn);}}}
};
const fakeFetch=async ()=>{posts++;return {ok:true,status:200}};
vm.runInNewContext(content,{chrome:fakeChrome,fetch:fakeFetch,Date,Math,URL,Number,String,console}, {filename:"background.js"});
assert.equal(listeners.length,1);
async function send(msg,url="https://evandroferreira8.github.io/GoNexus/radar-ufrn.html",tabId){
 return await new Promise((resolve,reject)=>{
  const sender={url,tab:tabId?{id:tabId}:undefined};
  const reply=listeners[0](msg,sender,resolve);
  if(reply!==true)reject(new Error("Listener did not keep response open"));
 });
}
let a=await send({kind:"RADAR_SCAN"});
assert.equal(a.ok,true);
assert.equal(opened,1);
let b=await send({kind:"RADAR_MAP_READY"},"https://pogocoordinates.com/map",100);
assert.equal(b.shouldSearch,true);
await send({kind:"RADAR_SEARCH_STARTED"},"https://pogocoordinates.com/map",100);
await send({kind:"RADAR_SCAN_DATA",observed:3,knownIV:3,rows:[
 {pokemon_id:149,lat:-5.8412,lon:-35.2041,cp:1000,expires_at:null},
 {pokemon_id:149,lat:-5.8412,lon:-35.2041,cp:1000,expires_at:null},
 {pokemon_id:25,lat:34,lon:-118,cp:500,expires_at:null}
]},"https://pogocoordinates.com/map",100);
await send({kind:"RADAR_SCAN_FINISH"},"https://pogocoordinates.com/map",100);
let s=(await send({kind:"RADAR_GET_STATUS"})).scan;
assert.equal(s.phase,"complete");assert.equal(s.results.length,1);
assert.equal(s.results[0].pokemon_id,149);assert.equal(posts,0);
assert.equal((await send({kind:"RADAR_SCAN"})).ok,true);
await send({kind:"RADAR_SEARCH_STARTED"},"https://pogocoordinates.com/map",100);
await send({kind:"RADAR_SCAN_FINISH"},"https://pogocoordinates.com/map",100);
s=(await send({kind:"RADAR_GET_STATUS"})).scan;
assert.equal(s.phase,"unverified");assert.equal(s.results.length,0);
console.log("PASS: scan manual, filtro geográfico, deduplicação, ausência de envio automático e resultado inconclusivo.");
