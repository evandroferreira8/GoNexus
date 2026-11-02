import { chromium } from 'playwright';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('agenda-eventos.json','utf8'));
const targets=new Map();
const add=(date,url,subject)=>{
 if(!url||!url.includes('/discover/collection/'))return;
 const v=targets.get(url)||{url,dates:[],subjects:[]};
 if(date&&!v.dates.includes(date))v.dates.push(date);
 if(subject&&!v.subjects.includes(subject))v.subjects.push(subject);
 targets.set(url,v);
};
for(const e of data.events){
 add(e.start,e.campfire,e.title);
 for(const [date,url] of Object.entries(e.campfire_dates||{}))add(date,url,e.title);
}
for(const r of data.weekly_routines)
 for(const [date,t] of Object.entries(r.topics||{}))if(t.meetup_status==='publicado')add(date,t.source,r.title);
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const context=await browser.newContext({
 viewport:{width:1240,height:850},locale:'pt-BR',timezoneId:'America/Fortaleza',
 geolocation:{latitude:-5.840907,longitude:-35.197178},permissions:['geolocation']
});
const values=[...targets.values()],report=[];
const target=values.find(v=>v.dates.includes('2026-11-05'));
const page=await context.newPage();
const logs=[];
page.on('request',request=>{
 if(!request.url().includes('niantic-social-api.nianticlabs.com/graphql'))return;
 try{
  const data=request.postDataJSON(),operation=data.query?.match(/query\s+([A-Za-z0-9_]+)/)?.[1]||'unknown';
  if(/DiscoveryMapObjects|CollectionDetailsWrapper|DiscoveryRealityChannelRenderer|DiscoveryLiveEventsProvider/.test(operation))
    logs.push({operation,variables:data.variables||null});
 }catch(e){}
});
page.on('response',async response=>{
 if(!response.url().includes('niantic-social-api.nianticlabs.com/graphql'))return;
 try{
  const data=response.request().postDataJSON(),operation=data.query?.match(/query\s+([A-Za-z0-9_]+)/)?.[1]||'unknown';
  if(!/DiscoveryMapObjects|CollectionDetailsWrapper|DiscoveryRealityChannelRenderer/.test(operation))return;
  const body=await response.json();
  logs.push({response:operation,status:response.status(),keys:Object.keys(body.data||{}),errors:body.errors?.slice(0,2),
    mapCount:body.data?.meetupMapObjectsByLiveEventIdInLatLngBounds?.mapObjects?.length,
    preview:JSON.stringify(body.data||{}).slice(0,450)});
 }catch(e){}
});
await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:40000});
await page.waitForTimeout(8500);
console.log('BROWSER_GEO '+JSON.stringify(await page.evaluate(async()=>{
 const g=await new Promise(resolve=>navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude}),e=>resolve({error:e.message}),{timeout:3000}));
 return {geo:g,links:[...document.querySelectorAll('a[href*="maps.google.com/maps?ll"]')].map(x=>x.href.slice(0,280))};
})));
console.log('API_REQUESTS '+JSON.stringify(logs).slice(0,20000));
console.log('COLLECTION '+JSON.stringify({url:target.url,text:(await page.locator('body').innerText()).slice(0,2300)}));
await page.close();
await browser.close();
fs.mkdirSync('audit-results',{recursive:true});
fs.writeFileSync('audit-results/campfire-public-inspection.json',JSON.stringify(report,null,2));
console.log('AUDIT_DONE '+JSON.stringify({collections:values.length,read:report.length,meetups:report.reduce((n,r)=>n+(r.meetups?.length||0),0)}));
