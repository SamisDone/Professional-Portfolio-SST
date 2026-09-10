import { chromium } from 'playwright';
const b=await chromium.launch();
async function probe(label, opts){
  const p=await b.newPage({viewport:{width:1440,height:900}, ...opts});
  await p.goto('http://localhost:5200/work',{waitUntil:'networkidle'});
  await p.waitForTimeout(2000);
  const t1=await p.evaluate(()=>getComputedStyle(document.querySelector('.work-rail > div')).transform);
  await p.waitForTimeout(1800);
  const t2=await p.evaluate(()=>getComputedStyle(document.querySelector('.work-rail > div')).transform);
  const canScroll=await p.evaluate(()=>{const r=document.querySelector('.work-rail');
    return {overflowX:getComputedStyle(r).overflowX, scrollable:r.scrollWidth>r.clientWidth+10};});
  console.log(label.padEnd(26), 'moving:', String(t1!==t2).padEnd(6), '| overflowX:', canScroll.overflowX, '| manually scrollable:', canScroll.scrollable);
  await p.close();
}
await probe('normal motion', {});
await probe('prefers-reduced-motion', {reducedMotion:'reduce'});
// hover teardown check
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:5200/work',{waitUntil:'networkidle'}); await p.waitForTimeout(3000);
const before=await p.evaluate(()=>getComputedStyle(document.querySelector('.work-rail > div')).transform);
await p.mouse.move(700,500); await p.waitForTimeout(500);
const during=await p.evaluate(()=>getComputedStyle(document.querySelector('.work-rail > div')).transform);
console.log('transform before hover:', before);
console.log('transform while hovered:', during, '| RESET TO ZERO:', during==='none'||during==='matrix(1, 0, 0, 1, 0, 0)');
await b.close();
