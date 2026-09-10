import { chromium } from 'playwright';
const SP='C:/Users/User/AppData/Local/Temp/claude/c--Users-user-Desktop-Portfolio-2/64637faf-a3df-4d43-9d66-b5bcf2ea600c/scratchpad/w_';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:5200/work',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
console.log('rail order:', await p.evaluate(()=>[...document.querySelectorAll('.work-rail h3')].map(h=>h.textContent.trim()).join(' | ')));
await p.screenshot({path:SP+'work.png'});
for (const [w,h] of [[1440,900],[1280,720]]) {
  const q=await b.newPage({viewport:{width:w,height:h}}); const out=[];
  for (const r of ['/','/work','/experience','/research','/about','/contact']) {
    await q.goto('http://localhost:5200'+r,{waitUntil:'networkidle'}); await q.waitForTimeout(1200);
    const m=await q.evaluate(()=>document.documentElement.scrollHeight-window.innerHeight);
    out.push(`${r}${m>8?' +'+m:''}`);
  } console.log(`${w}x${h}`.padEnd(10), out.join('  ')); await q.close();
}
console.log('ERRORS', JSON.stringify(errs.slice(0,4)));
await b.close();
