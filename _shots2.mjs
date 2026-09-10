import { chromium } from 'playwright';
const T = [
  { id:'medihub',     url:'https://ai-powered-hospital-management-syst.vercel.app/' },
  { id:'pierra',      url:'https://pierrafinal.vercel.app/' },
  { id:'resumeforge', url:'https://resumeforge-sam.netlify.app/' },
  { id:'sortnplay',   url:'https://sortnplay.netlify.app/' },
];
const b = await chromium.launch();
for (const t of T) {
  const p = await b.newPage({ viewport:{width:1400,height:875}, deviceScaleFactor:1.6 });
  await p.goto(t.url,{waitUntil:'networkidle',timeout:45000});
  await p.waitForTimeout(3500);
  await p.screenshot({ path:`public/shots/${t.id}.jpg`, type:'jpeg', quality:80 });
  console.log('saved', t.id);
  await p.close();
}
await b.close();
