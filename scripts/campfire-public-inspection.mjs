import { chromium } from 'playwright';
import fs from 'node:fs';
const urls=[
 'https://campfire.scopely.com/discover/collection/7744fa1d-1e1b-4fe0-8de2-37051e8213da',
 'https://campfire.scopely.com/discover/collection/5222de4a-f24f-44f8-a299-0988998754fa',
 'https://campfire.scopely.com/discover/collection/f25d4113-d292-4b4b-aea0-b74efbda47fb',
 'https://campfire.scopely.com/discover/collection/27acc9bc-340e-49d3-a26c-0d4304d56a28',
 'https://campfire.scopely.com/discover/collection/cc10c851-4fde-4478-bc8b-7b3c389b9310'
];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const context=await browser.newContext({
 viewport:{width:1280,height:900},
 locale:'pt-BR',timezoneId:'America/Fortaleza',
 geolocation:{latitude:-5.840907,longitude:-35.197178},
 permissions:['geolocation']
});
const reports=[];
for(const url of urls){
 const page=await context.newPage();
 let result={url};
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(7000);
  result.title=await page.title();
  result.currentUrl=page.url();
  result.text=(await page.locator('body').innerText({timeout:12000})).slice(0,12500);
  result.links=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>({text:(x.innerText||'').slice(0,120),href:x.href})).filter(x=>/meetup|event|campfire|maps|google/i.test(x.href)).slice(0,25));
  console.log('COLLECTION '+JSON.stringify(result).slice(0,16000));
 }catch(e){result.error=String(e);console.log('COLLECTION_ERROR '+JSON.stringify(result));}
 reports.push(result);
 await page.close();
}
await browser.close();
fs.mkdirSync('audit-results',{recursive:true});
fs.writeFileSync('audit-results/campfire-public-inspection.json',JSON.stringify(reports,null,2));
