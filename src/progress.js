/* ===== Summaries after finishing, and Progress analytics ===== */
const CLR='#86AE2B',CLR2='#B2E04A';
function logVol(l){return (l.ex||[]).reduce((a,e)=>a+e.sets.reduce((b,s)=>b+(s.w||0)*(s.r||0),0),0)}
function logSets(l){return (l.ex||[]).reduce((a,e)=>a+e.sets.length,0)}
function logReps(l){return (l.ex||[]).reduce((a,e)=>a+e.sets.reduce((b,s)=>b+(s.r||0),0),0)}
function bestE1(sets){let b=0;(sets||[]).forEach(s=>{if(s.w>0&&s.r>0)b=Math.max(b,e1rm(s.w,s.r))});return b}
function topSet(sets){let t=null;(sets||[]).forEach(s=>{if(s.w>0&&(!t||e1rm(s.w,s.r)>e1rm(t.w,t.r)))t=s});return t}
const sgn=n=>n>0?'+':'';
function pctTxt(p){return p==null?'':`${sgn(p)}${Math.round(p*10)/10}%`}
function deltaChip(p){if(p==null)return '';const c=p>0.4?'#4E7A12':p<-0.4?'#B3412F':'#5B6B78';return `<span style="color:${c};font-weight:700;font-size:12px">${p>0.4?'▲':p<-0.4?'▼':'•'} ${pctTxt(p)}</span>`}
/* --- charts --- */
function barsSvg(vals,labels,opt={}){
  const H=opt.h||90,W=300,n=vals.length,gap=6,bw=(W-gap*(n-1))/n,mx=Math.max(1,...vals);
  const bars=vals.map((v,i)=>{const h=Math.max(v?3:1.5,v/mx*H);const x=i*(bw+gap);const hi=opt.hi!=null&&i===opt.hi;
    return `<rect x="${x.toFixed(1)}" y="${(H-h+14).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(5,bw/2).toFixed(1)}" fill="${v?(hi?CLR:CLR2):'#E3E8EE'}"/>${v?`<text x="${(x+bw/2).toFixed(1)}" y="${(H-h+10).toFixed(1)}" text-anchor="middle" font-size="9" fill="#5B6B78" font-weight="700">${opt.fmt?opt.fmt(v):v}</text>`:''}<text x="${(x+bw/2).toFixed(1)}" y="${H+28}" text-anchor="middle" font-size="9" fill="#8A97A2">${labels[i]||''}</text>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H+34}" width="100%" role="img" aria-label="${esc(opt.label||'Chart')}">${bars}</svg>`;
}
function sparkSvg(vals,w=84,h=28){
  if(vals.length<2)return '';
  const mn=Math.min(...vals),mx=Math.max(...vals),r=(mx-mn)||1;
  const pts=vals.map((v,i)=>[2+i*(w-4)/(vals.length-1),h-3-(v-mn)/r*(h-8)]);
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
  const last=pts[pts.length-1];
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${d}" fill="none" stroke="${CLR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="#4E7A12"/></svg>`;
}
function lineSvg(vals,labels,fmt){
  const W=300,H=96,n=vals.length;if(n<2)return '';
  const mn=Math.min(...vals,0),mx=Math.max(...vals,0),r=(mx-mn)||1;
  const X=i=>6+i*(W-12)/(n-1),Y=v=>20+(mx-v)/r*(H-34);
  const d=vals.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join('');
  const area=d+`L${X(n-1).toFixed(1)} ${Y(0).toFixed(1)}L${X(0).toFixed(1)} ${Y(0).toFixed(1)}Z`;
  return `<svg viewBox="0 0 ${W} ${H+16}" width="100%" role="img" aria-label="Strength trend"><line x1="6" x2="${W-6}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="#D3DBE1" stroke-dasharray="3 3"/><path d="${area}" fill="${CLR2}" opacity=".28"/><path d="${d}" fill="none" stroke="${CLR}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${vals.map((v,i)=>i===n-1?`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4" fill="#4E7A12"/><text x="${(X(i)-4).toFixed(1)}" y="${(Y(v)-8).toFixed(1)}" text-anchor="end" font-size="10" font-weight="700" fill="#4E7A12">${fmt(v)}</text>`:'').join('')}<text x="6" y="${H+12}" font-size="9" fill="#8A97A2">${labels[0]}</text><text x="${W-6}" y="${H+12}" text-anchor="end" font-size="9" fill="#8A97A2">${labels[labels.length-1]}</text></svg>`;
}
/* --- history helpers --- */
function prevBest(id,before){let b=0;S.logs.forEach(l=>{if(l.t>=before)return;(l.ex||[]).forEach(e=>{if(e.id===id)b=Math.max(b,bestE1(e.sets))})});return b}
function prevSame(l){for(let i=S.logs.length-1;i>=0;i--){const x=S.logs[i];if(x.t<l.t&&x.title===l.title&&x.kind!=='cardio')return x}return null}
function weekLogs(t){const m=mondayOf(t);return S.logs.filter(l=>l.t>=m&&l.t<m+7*DAY)}
/* --- workout finish summary --- */
function finishView(){
  const F=UI.fin;const l=F.log;
  const praise=pick(PRAISE,Math.floor(NOW()/1000));
  const vol=logVol(l),sets=logSets(l),reps=logReps(l);
  const ps=prevSame(l);
  const vd=ps&&logVol(ps)>0?(vol-logVol(ps))/logVol(ps)*100:null;
  const dd=ps?l.dur-ps.dur:null;
  const wk=weekLogs(l.t).length,planned=basePlanCount();
  const sw=streakWeeks();
  const rows=(l.ex||[]).map(e=>{
    const t=topSet(e.sets),b=bestE1(e.sets),pb=prevBest(e.id,l.t);
    const d=pb>0&&b>0?(b-pb)/pb*100:null;
    const isPr=(l.pr||[]).includes(e.id);
    return `<div class="row" style="padding:8px 0;border-top:1px solid var(--line);gap:8px"><div class="sp1"><div style="font-weight:600;font-size:14px">${esc(exName(e.id))}${isPr?` <span class="st now" style="margin-left:4px">PR</span>`:''}</div><div class="sub">${e.sets.length} sets${t?`, top ${fmtW(t.w,true)} x ${t.r}`:''}</div></div>${d!=null?`<div style="text-align:right">${deltaChip(d)}<div class="sub" style="font-size:10px">vs last best</div></div>`:(b>0?'<span class="sub" style="font-size:11px">first log</span>':'')}</div>`}).join('');
  const parts=(l.parts||[]).map(p=>PART_LABEL[p]||p);
  const insight=vd!=null?(vd>2?`Volume is up ${Math.round(vd)}% on your last ${esc(l.title)}. That is the kind of progress that adds up.`:vd<-8?`Volume is ${Math.abs(Math.round(vd))}% below your last ${esc(l.title)}. Fine on a lighter day, just keep an eye on the trend.`:`Steady with your last ${esc(l.title)}. Consistency beats spikes.`):(l.ex&&l.ex.length?'First time logging this workout. Next time you will see how it compares.':'');
  return `<div class="stack" style="padding-top:20px">
  <div class="hero"><div class="k">${F.hist?'WORKOUT, '+esc(fmtDate(l.t).toUpperCase()):'WORKOUT COMPLETE'}</div><div class="big sm">${esc(l.title)}</div><div class="m">${F.hist?'From your history.':praise}</div></div>
  <div class="card"><div class="trfig"><div class="wfs" aria-hidden="true">${wFig({parts:l.parts||[]},118,CLR,'#E3E8EE')}</div><div class="sp1"><div class="sec" style="padding:0 0 6px">Worked today</div><div class="chips">${parts.map(p=>`<span class="chip sm l">${esc(p)}</span>`).join('')||'<span class="sub">No muscles logged</span>'}</div>${insight?`<div class="sub" style="margin-top:10px">${insight}</div>`:''}</div></div></div>
  <div class="g2"><div class="mini" style="min-height:0"><div class="s">Time</div><div class="v">${l.dur} min</div>${dd!=null&&dd!==0?`<div class="s">${sgn(dd)}${dd} min vs last</div>`:''}</div><div class="mini" style="min-height:0"><div class="s">Sets and reps</div><div class="v">${sets}</div><div class="s">${reps} reps</div></div><div class="mini" style="min-height:0;grid-column:span 2"><div class="s">Volume lifted</div><div class="v">${Math.round(vol*KG).toLocaleString()} lb</div><div class="s">${Math.round(vol).toLocaleString()} kg ${vd!=null?deltaChip(vd):''}</div></div></div>
  <div class="card"><div class="row"><div class="sp1"><div class="sec" style="padding:0">This week</div><div style="font-weight:700;font-size:16px;margin-top:2px">${wk} of ${planned} workouts</div></div><div style="text-align:right"><div style="font-weight:700;font-size:16px">${sw} week${sw===1?'':'s'}</div><div class="sub">streak</div></div></div><div class="bar" style="margin-top:8px"><i style="width:${Math.min(100,wk/Math.max(1,planned)*100)}%"></i></div></div>
  ${rows?`<div class="card"><div class="sec" style="padding:0 0 4px">Exercise by exercise</div>${rows}</div>`:''}
  ${F.prs.length?`<div class="card"><div style="font-weight:700;margin-bottom:6px">${ico('trophy',18,'#C77700')} New personal records</div>${F.prs.map(id=>`<div style="font-size:14px;padding:2px 0">${esc(exName(id))}, est. max ${fmtW(S.prs[id])}</div>`).join('')}</div>`:''}
  ${F.nb.length?`<div class="card"><div style="font-weight:700;margin-bottom:6px">${ico('trophy',18,'#4E7A12')} Milestones unlocked</div>${F.nb.map(b=>`<div style="padding:2px 0"><b>${b[1]}</b> <span class="sub">${b[2]}</span></div>`).join('')}</div>`:''}
  ${F.hist?'':`<div class="card row"><span style="font-size:13px" class="sp1">Replenish: ${waterToday()} of ${S.waterGoal} ml today</span><button class="btn out sm" style="width:auto;padding:0 14px" data-a="water+" data-v="250">+250 ml</button></div>
  <button class="btn out" data-a="progfin">${ico('chart',18)} See my progress</button>`}
  <button class="btn" data-a="${F.hist?'histback':'finishdone'}">${F.hist?'Back to progress':'Done'}</button></div>${S.set.celebrate&&!F.hist?confetti():''}`;
}
/* --- cardio finish summary --- */
function cfinishView(){
  const F=UI.fin;const l=F.log,c=l.cardio||{min:l.dur,km:0,type:'Cardio'};
  const m=mondayOf(l.t);
  const cm=(a,b)=>S.logs.filter(x=>x.kind==='cardio'&&x.t>=a&&x.t<b).reduce((s,x)=>s+(x.dur||0),0);
  const wkMin=cm(m,m+7*DAY),lastMin=cm(m-7*DAY,m);
  const pace=c.km>0?c.min/c.km:0;const pm=c.km>0?c.min/(c.km*0.621371):0;
  const fmtP=p=>`${Math.floor(p)}:${String(Math.round((p%1)*60)).padStart(2,'0')}`;
  const d=lastMin>0?(wkMin-lastMin)/lastMin*100:null;
  return `<div class="stack" style="padding-top:20px"><div class="hero"><div class="k">CARDIO COMPLETE</div><div class="big sm">${esc(c.type)}</div><div class="m">Heart worked, legs earned a rest. Nice.</div></div>
  <div class="g2"><div class="mini" style="min-height:0"><div class="s">Time</div><div class="v">${c.min} min</div></div><div class="mini" style="min-height:0"><div class="s">Distance</div><div class="v">${c.km?`${(c.km*0.621371).toFixed(1)} mi`:'-'}</div>${c.km?`<div class="s">${c.km} km</div>`:''}</div>
  ${pace?`<div class="mini" style="min-height:0;grid-column:span 2"><div class="s">Pace</div><div class="v">${fmtP(pm)} /mi</div><div class="s">${fmtP(pace)} /km</div></div>`:''}</div>
  <div class="card"><div class="sec" style="padding:0">Cardio this week</div><div style="font-weight:700;font-size:18px;margin:2px 0">${wkMin} min ${d!=null?deltaChip(d):''}</div><div class="sub">${lastMin?`Last week: ${lastMin} min.`:'First cardio week on record.'}</div></div>
  ${F.nb&&F.nb.length?`<div class="card"><div style="font-weight:700;margin-bottom:6px">${ico('trophy',18,'#4E7A12')} Milestones unlocked</div>${F.nb.map(b=>`<div style="padding:2px 0"><b>${b[1]}</b> <span class="sub">${b[2]}</span></div>`).join('')}</div>`:''}
  <button class="btn" data-a="${F.hist?'histback':'finishdone'}">${F.hist?'Back to progress':'Done'}</button></div>${S.set.celebrate&&!F.hist?confetti():''}`;
}
/* --- Progress and analytics --- */
function progressView(){
  const R=UI.prg||(UI.prg={r:12});const weeks=R.r;
  const m0=mondayOf(NOW());const start=m0-(weeks-1)*7*DAY;
  const logs=S.logs.filter(l=>l.t>=start&&l.kind!=='cardio');
  const all=S.logs.filter(l=>l.kind!=='cardio');
  const wkc=[],wkv=[],lab=[];
  for(let i=0;i<weeks;i++){const a=start+i*7*DAY,b=a+7*DAY;const w=S.logs.filter(l=>l.t>=a&&l.t<b);wkc.push(w.length);wkv.push(Math.round(w.reduce((s,l)=>s+logVol(l),0)*KG/100)/10);lab.push(weeks<=4||i%3===(weeks-1)%3?fmtDate(a).slice(0,6):'')}
  const planned=basePlanCount();
  const full=wkc.slice(0,-1);const hit=full.filter(n=>n>=planned).length;
  const sw=streakWeeks();
  const avg=Math.round(wkc.reduce((a,b)=>a+b,0)/weeks*10)/10;
  const mins=logs.reduce((a,l)=>a+(l.dur||0),0);
  // heat calendar
  const heat=[];for(let i=0;i<Math.min(weeks,12);i++){const a=m0-(Math.min(weeks,12)-1-i)*7*DAY;heat.push(Array.from({length:7},(_,d)=>{const t=a+d*DAY;return S.logs.filter(l=>l.t>=t&&l.t<t+DAY).length}))}
  const heatSvg=`<svg viewBox="0 0 ${heat.length*22} 160" width="100%" role="img" aria-label="Workout calendar">${['M','T','W','T','F','S','S'].map((d,i)=>`<text x="${heat.length*22/2}" y="0" fill="none"></text>`).join('')}${heat.map((col,x)=>col.map((n,y)=>`<rect x="${x*22+2}" y="${y*22+2}" width="18" height="18" rx="6" fill="${n>1?'#6F9A1E':n===1?CLR2:'#E3E8EE'}"/>`).join('')).join('')}</svg>`;
  // strength
  const lifts={};
  all.forEach(l=>(l.ex||[]).forEach(e=>{const b=bestE1(e.sets);if(b>0)(lifts[e.id]=lifts[e.id]||[]).push({t:l.t,v:b})}));
  const inR=Object.entries(lifts).map(([id,a])=>({id,all:a,pts:a.filter(p=>p.t>=start)})).filter(x=>x.pts.length>=2);
  inR.sort((a,b)=>b.pts.length-a.pts.length);
  const rowsL=inR.slice(0,6).map(x=>{const f=x.pts[0].v,l=x.pts[x.pts.length-1].v;const p=(l-f)/f*100;return {id:x.id,l,p,v:x.pts.map(q=>q.v),n:x.pts.length}});
  const avgGain=rowsL.length?rowsL.reduce((a,x)=>a+x.p,0)/rowsL.length:null;
  // strength index by week (mean % over each lift's first value)
  const idx=[];if(inR.length){for(let i=0;i<weeks;i++){const b=start+(i+1)*7*DAY;const vals=inR.map(x=>{const f=x.pts[0].v;const up=x.pts.filter(q=>q.t<b);return up.length?(up[up.length-1].v-f)/f*100:null}).filter(v=>v!=null);idx.push(vals.length?vals.reduce((a,c)=>a+c,0)/vals.length:null)}}
  const idxV=idx.map((v,i)=>v==null?(i?idx[i-1]||0:0):v);
  // muscle balance 30d
  const cut=NOW()-30*DAY;const mp={};
  S.logs.filter(l=>l.t>=cut).forEach(l=>(l.ex||[]).forEach(e=>{const x=EXB[e.id];if(!x)return;const p=MUSCLE_PART[x.p[0]]||'other';mp[p]=(mp[p]||0)+e.sets.length}));
  const mpk=Object.keys(mp).sort((a,b)=>mp[b]-mp[a]);const mpx=Math.max(1,...Object.values(mp));
  const prl=[];S.logs.slice().reverse().forEach(l=>(l.pr||[]).forEach(id=>{if(prl.length<6)prl.push({id,t:l.t})}));
  const empty=!S.logs.length;
  return `<div class="top"><button class="ibtn" data-a="back" aria-label="Back">${ico('back')}</button><div class="sp1"><div class="h1">Progress</div><div class="sub">Strength, consistency and volume</div></div></div>
  <div class="stack">
  <div class="seg">${[[4,'4 weeks'],[12,'12 weeks'],[26,'6 months']].map(([n,l])=>`<button class="${weeks===n?'on':''}" data-a="prgr" data-v="${n}">${l}</button>`).join('')}</div>
  ${empty?`<div class="card" style="text-align:center;padding:28px 18px"><div style="font-weight:700;font-size:16px">Nothing to chart yet</div><div class="sub" style="margin-top:6px">Finish a workout and log your weights. Strength trends, consistency and volume show up here.</div></div>`:''}
  <div class="g2"><div class="mini" style="min-height:0"><div class="s">Workouts</div><div class="v">${logs.length}</div><div class="s">${avg} per week</div></div><div class="mini" style="min-height:0"><div class="s">Strength change</div><div class="v">${avgGain!=null?pctTxt(avgGain):'-'}</div><div class="s">${rowsL.length?`across ${rowsL.length} lifts`:'log weights twice'}</div></div><div class="mini" style="min-height:0"><div class="s">Streak</div><div class="v">${sw} wk</div><div class="s">${hit} of ${full.length} weeks on plan</div></div><div class="mini" style="min-height:0"><div class="s">Time trained</div><div class="v">${mins>=120?(mins/60).toFixed(1)+' h':mins+' min'}</div><div class="s">${logs.length?Math.round(mins/logs.length)+' min avg':''}</div></div></div>
  <div class="card"><div class="sec" style="padding:0 0 4px">Consistency</div><div class="sub" style="margin-bottom:4px">Workouts per week${planned?`, plan is ${planned}`:''}</div>${barsSvg(wkc,lab,{hi:weeks-1,label:'Workouts per week'})}</div>
  <div class="card"><div class="sec" style="padding:0 0 6px">Calendar, last ${Math.min(weeks,12)} weeks</div><div style="display:flex;gap:8px"><div style="display:flex;flex-direction:column;justify-content:space-around;font-size:9px;color:#8A97A2;padding:2px 0">${['M','T','W','T','F','S','S'].map(d=>`<span>${d}</span>`).join('')}</div><div class="sp1">${heatSvg}</div></div></div>
  ${idxV.length>1&&inR.length?`<div class="card"><div class="sec" style="padding:0 0 4px">Strength trend</div><div class="sub" style="margin-bottom:4px">Average change in estimated max across your tracked lifts</div>${lineSvg(idxV,[fmtDate(start),'Now'],v=>pctTxt(Math.round(v*10)/10))}</div>`:''}
  ${rowsL.length?`${R.lift?liftCard(R.lift):''}<div class="card"><div class="sec" style="padding:0 0 4px">Lift by lift</div><div class="sub" style="margin-bottom:2px">Tap a lift for its full history</div>${rowsL.map(x=>`<button class="row" data-a="plift" data-v="${esc(x.id)}" style="padding:8px 0;border-top:1px solid var(--line);gap:8px;width:100%;text-align:left"><div class="sp1"><div style="font-weight:600;font-size:14px">${esc(exName(x.id))}</div><div class="sub">Est. max ${fmtW(x.l)}, ${x.n} sessions</div></div>${sparkSvg(x.v)}<div style="width:58px;text-align:right">${deltaChip(x.p)}</div></button>`).join('')}</div>`:(empty?'':`<div class="note">Log weights on the same exercise in two or more workouts to see strength trends here.</div>`)}
  <div class="card"><div class="sec" style="padding:0 0 4px">Weekly volume</div><div class="sub" style="margin-bottom:4px">Total weight lifted, in thousands of lb</div>${barsSvg(wkv,lab,{hi:weeks-1,label:'Weekly volume',fmt:v=>v})}</div>
  ${mpk.length?`<div class="card"><div class="sec" style="padding:0 0 6px">Muscle balance, last 30 days</div>${mpk.map(k=>`<div class="row" style="font-size:13px;padding:3px 0"><span style="width:84px">${esc(PART_LABEL[k]||k)}</span><div class="bar sp1"><i style="width:${Math.round(mp[k]/mpx*100)}%"></i></div><span style="width:46px;text-align:right;color:var(--mut)">${mp[k]} sets</span></div>`).join('')}</div>`:''}
  ${waterCard(weeks)}
  ${S.logs.length?`<div class="card"><div class="sec" style="padding:0 0 4px">History</div>${S.logs.map((l,i)=>[l,i]).slice(-10).reverse().map(([l,i])=>`<button class="row" data-a="hist" data-v="${i}" style="padding:8px 0;border-top:1px solid var(--line);gap:8px;width:100%;text-align:left"><div class="sp1"><div style="font-weight:600;font-size:14px">${esc(l.title)}</div><div class="sub">${esc(fmtDate(l.t))}, ${l.dur||0} min${l.kind==='cardio'?'':`, ${logSets(l)} sets`}</div></div>${(l.pr||[]).length?`<span class="st now">PR</span>`:''}${ico('chev',16,'#9AA9B4')}</button>`).join('')}</div>`:''}
  ${prl.length?`<div class="card"><div class="sec" style="padding:0 0 4px">Recent personal records</div>${prl.map(p=>`<div class="row" style="font-size:13px;padding:4px 0;border-top:1px solid var(--line)"><span class="sp1">${esc(exName(p.id))}</span><span class="sub">${fmtW(S.prs[p.id],true)}, ${fmtDate(p.t)}</span></div>`).join('')}</div>`:''}
  </div>`;
}
/* --- water history --- */
function waterCard(weeks){
  if(!(S.water||[]).length)return '';
  const t0=startOfDay(NOW()),n=weeks*7;
  const days=Array.from({length:n},(_,i)=>{const t=t0-(n-1-i)*DAY;return {t,ml:waterOn(t)}});
  const logged=days.filter(d=>d.ml>0),hit=days.filter(d=>d.ml>=S.waterGoal).length;
  const avg=logged.length?Math.round(logged.reduce((a,d)=>a+d.ml,0)/logged.length):0;
  const best=Math.max(0,...days.map(d=>d.ml));
  const wv=[],wl=[];for(let w=0;w<weeks;w++){const sl=days.slice(w*7,w*7+7).filter(d=>d.ml>0);wv.push(sl.length?Math.round(sl.reduce((a,d)=>a+d.ml,0)/sl.length/100)/10:0);wl.push(weeks<=4||w%3===(weeks-1)%3?fmtDate(days[w*7].t).slice(0,6):'')}
  const list=days.slice().reverse().filter(d=>d.ml>0).slice(0,UI.prg&&UI.prg.wall?60:14);
  return `<div class="card" id="waterc"><div class="sec" style="padding:0 0 4px">Water</div>
  <div class="g2" style="grid-template-columns:repeat(3,1fr);margin-bottom:6px"><div><div class="sub">Daily avg</div><b>${avg.toLocaleString()} ml</b></div><div><div class="sub">Goal days</div><b>${hit} of ${logged.length}</b></div><div><div class="sub">Best day</div><b>${best.toLocaleString()} ml</b></div></div>
  <div class="sub" style="margin-bottom:2px">Average per logged day, litres, by week</div>${barsSvg(wv,wl,{hi:weeks-1,label:'Water by week',fmt:v=>v})}
  <div class="sec" style="padding:8px 0 2px">Day by day</div>${list.length?list.map(d=>`<div class="row" style="font-size:13px;padding:4px 0;border-top:1px solid var(--line);gap:8px"><span style="width:62px">${esc(fmtDate(d.t).slice(0,6))}</span><div class="bar sp1"><i style="width:${Math.min(100,Math.round(d.ml/Math.max(S.waterGoal,1)*100))}%;${d.ml>=S.waterGoal?'':'background:#9BB6D3'}"></i></div><span style="width:66px;text-align:right;color:var(--mut)">${d.ml} ml</span></div>`).join(''):'<div class="sub">No water logged in this range.</div>'}
  ${(UI.prg&&UI.prg.wall)||list.length<14?'':`<button class="chip" style="margin-top:8px" data-a="wall">Show more days</button>`}</div>`;
}
/* --- single lift detail --- */
function liftCard(id){
  const pts=[];S.logs.forEach(l=>(l.ex||[]).forEach(e=>{if(e.id!==id)return;const b=bestE1(e.sets);if(b>0)pts.push({t:l.t,v:b,top:topSet(e.sets),n:e.sets.length})}));
  if(!pts.length)return '';
  const f=pts[0].v,la=pts[pts.length-1].v,best=Math.max(...pts.map(p=>p.v));
  const vals=pts.map(p=>lb(p.v));
  return `<div class="card" id="liftc"><div class="row"><div class="sp1"><div class="sec" style="padding:0">${esc(exName(id))}</div><div style="font-weight:700;font-size:18px">Est. max ${fmtW(la)}</div></div>${deltaChip(pts.length>1?(la-f)/f*100:null)}<button class="chip sm" data-a="plift" data-v="">Close</button></div>
  <div class="sub" style="margin:4px 0">Best ever ${fmtW(best)}. Estimated from your logged weight and reps.</div>
  ${pts.length>1?lineSvg(vals,[fmtDate(pts[0].t),fmtDate(pts[pts.length-1].t)],v=>v):'<div class="sub">Log this lift again to see a trend.</div>'}
  <div class="sec" style="padding:8px 0 2px">Last sessions</div>${pts.slice(-5).reverse().map(p=>`<div class="row" style="font-size:13px;padding:3px 0;border-top:1px solid var(--line)"><span class="sp1">${esc(fmtDate(p.t))}</span><span>${p.top?fmtW(p.top.w,true)+' x '+p.top.r:''}</span><span class="sub" style="width:56px;text-align:right">${p.n} sets</span></div>`).join('')}</div>`;
}
function progHomeLine(){
  const m0=mondayOf(NOW()),a=m0-7*7*DAY,lifts={};
  S.logs.filter(l=>l.kind!=='cardio').forEach(l=>(l.ex||[]).forEach(e=>{const b=bestE1(e.sets);if(b>0)(lifts[e.id]=lifts[e.id]||[]).push({t:l.t,v:b})}));
  const g=Object.values(lifts).map(x=>x.filter(p=>p.t>=a)).filter(x=>x.length>=2).map(x=>(x[x.length-1].v-x[0].v)/x[0].v*100);
  if(g.length)return `Strength ${pctTxt(Math.round(g.reduce((s,v)=>s+v,0)/g.length*10)/10)}`;
  return S.logs.length?`${S.logs.length} workout${S.logs.length===1?'':'s'} logged`:'Starts after your first workout';
}
function progHomeSpark(w=84,h=32){
  const m0=mondayOf(NOW()),v=[];for(let i=7;i>=0;i--){const a=m0-i*7*DAY;v.push(S.logs.filter(l=>l.t>=a&&l.t<a+7*DAY).length)}
  return v.some(x=>x>0)?sparkSvg(v,w,h):'';
}
const PRGACT={
 prgr(v){UI.prg=Object.assign(UI.prg||{},{r:+v});render()},
 plift(v){UI.prg=UI.prg||{r:12};UI.prg.lift=v||null;render();if(v)setTimeout(()=>{const e=document.getElementById('liftc');if(e)e.scrollIntoView({behavior:'smooth',block:'center'})},60)},
 hist(v){const l=S.logs[+v];if(!l)return;UI.fin={log:l,prs:l.pr||[],nb:[],hist:true};UI.screen=l.kind==='cardio'?'cfinish':'finish';render()},
 wall(){UI.prg=Object.assign(UI.prg||{r:12},{wall:true});render()},
 histback(){UI.fin=null;UI.screen='progress';render()},
 progfin(){UI.fin=null;UI.screen='progress';render()}
};
