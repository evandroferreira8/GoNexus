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
const page=await context.newPage();
// Primeiro estabelecer a localização da consulta no Campfire; uma abertura simultânea
// de várias coleções pode reutilizar a região padrão (Califórnia) em vez de Natal.
await page.goto('https://campfire.scopely.com/discover',{waitUntil:'domcontentloaded',timeout:40000});
await page.waitForTimeout(8000);
console.log('LOCATION_PRIMED '+JSON.stringify({url:page.url(),title:await page.title()}));
async function one(t){
 const res={date:t.dates,subject:t.subjects,url:t.url};
 try{
  await page.goto(t.url,{waitUntil:'domcontentloaded',timeout:40000});
  await page.locator('body').waitFor();
  await page.waitForTimeout(5200);
  res.collectionTitle=await page.title();
  res.meetups=await page.locator('a[href*="/discover/meetup/"]').evaluateAll(nodes=>nodes.map(n=>({
    text:n.innerText.trim(),url:n.href
  })));
  res.body=(await page.locator('body').innerText()).slice(0,3800);
  res.locationWarning=res.meetups.some(m=>/Berkeley|San Francisco|Springer Gateway|Market Street|Pier 14/i.test(m.text));
  console.log('MEETUPS '+JSON.stringify(res).slice(0,7000));
 }catch(e){res.error=String(e);console.log('AUDIT_ERROR '+JSON.stringify(res));}
 report.push(res);
}
for(const item of values)await one(item);
await page.close();
const inspect=report.filter(r=>!r.locationWarning).flatMap(r=>r.meetups||[]).slice(0,5);
for(const m of inspect){
 const page=await context.newPage();try{
  await page.goto(m.url,{waitUntil:'domcontentloaded',timeout:40000});
  await page.waitForTimeout(3500);
  console.log('MEETUP_DETAIL '+JSON.stringify({url:m.url,text:(await page.locator('body').innerText()).slice(0,3200)}));
 }catch(e){console.log('MEETUP_DETAIL_ERROR '+String(e));}finally{await page.close();}
}
await browser.close();
fs.mkdirSync('audit-results',{recursive:true});
fs.writeFileSync('audit-results/campfire-public-inspection.json',JSON.stringify(report,null,2));
console.log('AUDIT_DONE '+JSON.stringify({collections:values.length,read:report.length,meetups:report.reduce((n,r)=>n+(r.meetups?.length||0),0)}));
