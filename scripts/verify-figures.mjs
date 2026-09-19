/**
 * Re-derives every figure quoted in docs/ALGORITHMS.md straight from the seed rows and
 * asserts it. Run it after changing seed data, an assumption or a selector: a failure
 * means the spec and the code have drifted apart, and one of them needs updating.
 *
 *   npm run verify:figures
 *
 * It parses seed.ts as text rather than importing it, so it stays runnable without a
 * TypeScript loader and cannot be fooled by a selector bug — it is an independent
 * recomputation, not a call into the app's own code.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, '../src/data/seed.ts'), 'utf8')
const block = src.split('const ROWS: Row[] = [')[1].split('\n]')[0]
const T=[]
for (const line of block.split('\n')) {
  const m=line.match(/^\s*\[(.+)\],\s*$/); if(!m) continue
  const p=m[1].match(/(?:'[^']*'|[^,])+/g).map(s=>s.trim())
  const cat = p[5]==='null'?null:p[5].slice(1,-1)
  T.push({day:+p[0],vendor:p[2].slice(1,-1),amount:+p[4],bucket:cat==='income'?null:cat,income:cat==='income',social:+p[6],planned:+p[7]})
}
// Mirrors of src/lib/calendar.ts and src/data/assumptions.ts. Deliberately restated
// here so the check is independent of the values the app happens to be using.
const TODAY=17, DAYS=30, OPENING=15000, SMALL=400
const out=T.filter(t=>!t.income)
const sum=l=>-l.reduce((a,t)=>a+t.amount,0)
const income=T.filter(t=>t.income).reduce((a,t)=>a+t.amount,0), spent=sum(out)
const by={}; out.forEach(t=>{const k=t.bucket||'__none'; by[k]=(by[k]||0)-t.amount})
const social=out.filter(t=>t.social)
const isWe=d=>[0,6].includes(new Date(2026,8,d).getDay())
const avg=l=>l.length?Math.round(sum(l)/l.length):0
const wkd=social.filter(t=>!isWe(t.day)), wke=social.filter(t=>isWe(t.day))
const small=out.filter(t=>-t.amount<=SMALL&&t.social)
const eatOutlet=(vs)=>sum(out.filter(t=>t.bucket==='eat'&&vs.includes(t.vendor)))
const win=(a,b)=>sum(out.filter(t=>t.day>=a&&t.day<=b))
const fri=[4,11]

let fails=0
const check=(label,actual,expected)=>{
  const ok = actual===expected
  if(!ok) fails++
  console.log((ok?'ok   ':'FAIL ')+label.padEnd(38)+String(actual).padStart(10)+(ok?'':'   expected '+expected))
}
check('transaction rows', T.length, 38)
check('income', income, 18000)
check('spent', spent, 10057)
check('free', income-spent, 7943)
check('balance', OPENING+income-spent, 22943)
check('spentBy Eating', by.eat, 3860)
check('spentBy Shopping', by.shop, 2130)
check('spentBy Travel', by.travel, 1400)
check('spentBy Unlabelled', by.__none, 1000)
check('spentBy Essentials', by.ess, 749)
check('spentBy Gokhaana', by.goka, 340)
check('spentBy Subscriptions', by.subs, 318)
check('spentBy 7-Eleven', by.store, 260)
check('sum(spentBy) === spent', Object.values(by).reduce((a,b)=>a+b,0), spent)
check('Other fold', by.__none+by.ess+by.goka+by.subs+by.store, 2667)
check('Eating / Delivery apps', eatOutlet(['Swiggy','Zomato']), 2550)
check('Eating / Cafes', eatOutlet(['Third Wave Coffee','Café Goodluck','Starbucks']), 890)
check('Eating / Tapri & canteen', eatOutlet(['Chai tapri','College canteen']), 420)
const P=(s,e,today=TODAY)=>Math.round((s+e+((s+e)/today)*(DAYS-today))/10)*10
check('projection', P(spent,0), 17750)
check('projection (+700)', P(spent,700), 18980)
check('projection at TODAY=18', P(spent,0,18), 16760)
check('share Eating %', Math.round(by.eat/spent*100), 38)
check('share Shopping %', Math.round(by.shop/spent*100), 21)
check('share Travel %', Math.round(by.travel/spent*100), 14)
check('share Other %', Math.round(2667/spent*100), 27)
check('free after 700', income-spent-700, 7243)
check('Eating after 700', by.eat+700, 4560)
check('Eating share after 700', Math.round((by.eat+700)/(spent+700)*100), 42)
check('social total', sum(social), 3165)
check('social count', social.length, 12)
check('spontaneous count', social.filter(t=>!t.planned).length, 11)
check('weekday outings', wkd.length, 11)
check('weekend outings', wke.length, 1)
check('weekday average', avg(wkd), 259)
check('weekend average', avg(wke), 318)
check('small outings count', small.length, 11)
check('small outings total', sum(small), 2647)
check('week 11-17', win(11,17), 4952)
check('week 4-10', win(4,10), 4077)
check('weekly diff %', Math.round((win(11,17)-win(4,10))/win(4,10)*100), 21)
check('month window 1-7', win(1,7), 3965)
check('month window 8-14', win(8,14), 4354)
check('month window 15-21', win(15,21), 1738)
check('monthly diff vs Aug %', Math.round((10057-7650)/7650*100), 31)
check('Friday 4 total', sum(out.filter(t=>t.day===4)), 1579)
check('Friday 11 total', sum(out.filter(t=>t.day===11)), 430)
check('cue average', Math.round(sum(out.filter(t=>fri.includes(t.day)))/2), 1005)
// nested geometry for Eating at H=280
const its=[2550,890,420], tot=3860
const g=[]; let cum=1
its.forEach((a,i)=>{
  const c=cum; cum-=a/tot; const s=Math.sqrt(c)
  g.push({
    h: i ? Math.max(64, Math.min(280*s, g[i-1].h-66)) : 280,
    w: i ? Math.max(36, Math.min(100*s, g[i-1].w-20)) : 100,
  })
})
check('nest height Cafes', Math.round(g[1].h), 163)
check('nest width Cafes %', Math.round(g[1].w), 58)
check('nest height Tapri', Math.round(g[2].h), 92)
check('nest width Tapri %', Math.round(g[2].w), 36)

console.log('\n' + (fails
  ? fails + ' figure(s) FAILED — docs/ALGORITHMS.md and the code have drifted'
  : 'all figures in docs/ALGORITHMS.md verified'))
process.exit(fails?1:0)
