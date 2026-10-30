/* ===== UI part 3: player, finish, sheets, drawer, onboarding ===== */
const numFirst=s=>{const m=String(s).match(/\d+/);return m?+m[0]:10};
function repDefault(s){const m=String(s).match(/(\d+)\s*-\s*(\d+)/);if(m)return Math.round((+m[1]+ +m[2])/2);return numFirst(s)}
const isTimed=(b)=>!!b.hold||b.timed||/sec/.test(String(b.reps));
function stepsOf(w){const st=[];w.blocks.forEach((b,bi)=>{for(let s=0;s<b.sets;s++)b.ex.forEach((id,ei)=>st.push({bi,s,ei,id,grp:b.ex.length}))});return st}
function startPlay(w){
  const steps=stepsOf(w);
  UI.play={w,steps,i:0,rec:{},start:NOW(),rest:null,cur:null,quit:false,grip:{},log:[]};
  initCur();UI.screen='player';wakeLock();render();
}
function initCur(){
  const P=UI.play,st=P.steps[P.i];if(!st)return;const b=P.w.blocks[st.bi];const ex=EXB[st.id];
  const key=st.bi+':'+st.id;const mine=P.rec[key];
  let w=0;if(mine&&mine.length)w=mine[mine.length-1].w;else{const l=lastPerf(st.id);if(l)w=l.w}
  let r=isTimed(b)?(b.hold||numFirst(b.reps)):repDefault(b.reps);
  if(mine&&mine.length&&!isTimed(b))r=mine[mine.length-1].r;
  P.cur={w,r};
}
function stepW(dir){const P=UI.play;const lbm=S.set.units==='lb';const step=lbm?5/KG:2.5;let v=P.cur.w+dir*step;v=Math.max(0,Math.round(v*4)/4);P.cur.w=v}
function playView(){
  const P=UI.play;const st=P.steps[P.i];if(!st)return '';
  const b=P.w.blocks[st.bi],ex=EXB[st.id];const key=st.bi+':'+st.id;const done=(P.rec[key]||[]).length;
  const lp=lastPerf(st.id);const timed=isTimed(b);const lbm=S.set.units==='lb';
  const wv=lbm?lb(P.cur.w):kgr(P.cur.w);
  const lastSet=st.s===b.sets-1;
  const segs=P.w.blocks.map((x,i)=>`<i class="${i<st.bi?'on':i===st.bi?'cur':''}"></i>`).join('');
  const gripSel=P.grip[st.id]||(ex.g&&ex.g[0]);
  const rest=P.rest&&P.rest.end>NOW();
  const nextSt=P.steps[P.i+1];
  return `<div class="top"><button class="btn ghost" style="width:auto;padding:0 6px;height:40px" data-a="quit">${P.quit?'Tap again to quit':'Quit'}</button><div class="sp1" style="text-align:center" class="sub"><div class="sub">${esc(P.w.title)}</div></div><div style="font-weight:700;font-size:13px">${st.bi+1} of ${P.w.blocks.length}</div></div>
  <div class="stack"><div class="prog">${segs}</div>
  <div class="big2">${esc(ex.n)}</div>
  ${st.grp>1?`<div class="note g">${st.grp===2?'Superset':'Giant set'}: ${b.ex.map((id,k)=>k===st.ei?`<b>${esc(exName(id))}</b>`:esc(exName(id))).join(' then ')}</div>`:''}
  <div class="pl2"><div class="plL">${visual(ex)}
  ${ex.g&&ex.g.length?`<div class="row" style="flex-wrap:wrap"><span class="sub">Grip</span>${ex.g.map(g=>chip(esc(g),g===gripSel,'grip',g)).join('')}</div>`:''}
  <div class="card row" style="gap:12px"><div>${exFig(ex,96)}</div><div class="sp1"><div class="sec" style="padding:0">Targets</div><div style="font-weight:700;font-size:16px;line-height:1.2">${esc(ex.reg)}</div><div class="sub">Main: ${ex.p.map(m=>MUSCLE_LABEL[m]).join(', ')}.${ex.s.length?' Helpers: '+ex.s.slice(0,3).map(m=>MUSCLE_LABEL[m].toLowerCase()).join(', ')+'.':''}</div></div></div>
  <div class="gdet"><button class="gsum" data-a="gtog">How to grip and position ${ico(UI.gopen?'chevu':'chev',14)}</button>${UI.gopen?`<div style="margin-top:10px">${gripCard(ex).replace('class="card stack"','class="stack"').replace('<div style="font-weight:700;font-size:16px">How to grip and position</div>','')}</div>`:''}</div>
  ${ex.how&&ex.how[0]?`<div class="sub">${esc(ex.how[0].split('. ')[0])}.</div>`:''}
  ${b.note?`<div class="note g">${esc(b.note)}</div>`:''}
  ${b.tech&&lastSet&&P.w.techNote?`<div class="note">Last set: ${esc(P.w.techNote)}</div>`:''}
  </div><div class="plR">${rest?`<div class="restp"><div class="row"><div class="sp1"><div style="font-size:12px;color:#9AA6B2">REST</div><div class="t" id="rt">${fmtT(P.rest.end-NOW())}</div></div><button class="chip" style="background:#1D2126;color:#fff;border-color:#2C3036" data-a="restadj" data-v="-15">-15s</button><button class="chip" style="background:#1D2126;color:#fff;border-color:#2C3036" data-a="restadj" data-v="15">+15s</button><button class="chip on" data-a="restskip">Skip</button></div>${P.rest.next?(/next/i.test(P.rest.next)?`<button class="chip on nxtb" style="margin-top:8px" data-a="pl-skip">${esc(P.rest.next)} ${ico('chev',12)}</button>`:`<div style="font-size:13px;color:#C8F169;margin-top:6px">${esc(P.rest.next)}</div>`):''}${P.rest.burst?`<div style="font-size:13px;color:#fff;margin-top:6px">Burst: 30 seconds of ${esc(P.rest.burst)} before the next set.</div>`:''}<div class="bar" style="margin-top:8px;background:#2C3036"><i id="rbar" style="width:0%;background:#C8F169"></i></div></div>`:''}
  <div class="card stack">
   <div class="row"><b class="sp1">Set ${st.s+1} of ${b.sets}</b><span class="sub">${lp?'Last time: '+fmtW(lp.w,true)+' x '+lp.r:'First time, set your starting weight'}</span></div>
   <div class="g2">
    ${ex.eq==='bw'&&!lp?`<div><div class="sub">Added weight</div><div class="stepper"><button data-a="wd" data-v="-1" aria-label="Less weight">-</button><input id="winp" inputmode="decimal" value="${wv}" data-in="w"><button data-a="wd" data-v="1" aria-label="More weight">+</button></div><div class="sub" id="wsub">${lbm?kgr(P.cur.w)+' kg':lb(P.cur.w)+' lb'} ${P.cur.w===0?'(bodyweight)':''}</div></div>`:`<div><div class="sub">Weight (${lbm?'lb':'kg'})</div><div class="stepper"><button data-a="wd" data-v="-1" aria-label="Less weight">-</button><input id="winp" inputmode="decimal" value="${wv}" data-in="w"><button data-a="wd" data-v="1" aria-label="More weight">+</button></div><div class="sub" id="wsub">${lbm?kgr(P.cur.w)+' kg':lb(P.cur.w)+' lb'}</div></div>`}
    <div><div class="sub">${timed?'Seconds':'Reps'}</div><div class="stepper"><button data-a="rd" data-v="-1" aria-label="Fewer">-</button><input id="rinp" inputmode="numeric" value="${P.cur.r}" data-in="r"><button data-a="rd" data-v="1" aria-label="More">+</button></div><div class="sub">target ${esc(b.reps)}</div></div>
   </div>
   ${timed?`<div class="row"><div class="big2 sp1" id="tmr">${P.tm&&P.tm.end?fmtT(P.tm.end-NOW()):fmtT(P.cur.r*1000)}</div><button class="btn out sm" style="width:auto;padding:0 18px" data-a="timer">${P.tm&&P.tm.end?'Reset':'Start timer'}</button></div>`:''}
   <button class="btn" data-a="logset">Log set</button></div>
  <div class="row"><button class="btn out sm" style="flex:1" data-a="pl-swap">${ico('swap',16)} Swap</button><button class="btn out sm" style="flex:1" data-a="pl-skip">Skip move</button><button class="btn out sm" style="flex:1" data-a="pl-undo" ${P.log.length?'':'disabled'}>Undo set</button></div>
  <div class="row"><button class="btn out sm" style="flex:1" data-a="water+" data-v="250">${ico('glass',16,'#3D6FA0')} +250 ml</button>${(()=>{const nx=P.steps.find((x,i)=>i>P.i&&x.bi>st.bi);return nx?`<button class="btn out sm nxtb" style="flex:1.4" data-a="pl-skip">Next: ${esc(exName(nx.id))} ${ico('chev',14)}</button>`:'<div class="sub sp1" style="text-align:right">Last exercise</div>'})()}</div></div></div></div>`;
}
const fmtT=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
function logSet(){
  const P=UI.play,st=P.steps[P.i],b=P.w.blocks[st.bi];const key=st.bi+':'+st.id;
  const lastSet=st.s===b.sets-1;
  const rec={w:P.cur.w,r:P.cur.r};if(b.tech&&lastSet)rec.tech=true;if(P.grip[st.id])rec.g=P.grip[st.id];
  (P.rec[key]=P.rec[key]||[]).push(rec);P.log.push(key);
  hap([45,30,45]);
  P.i++;P.tm=null;
  if(P.i>=P.steps.length){finishPlay();return}
  const nx=P.steps[P.i];
  // rest rules
  let secs=0,next='',burst='';
  if(st.ei<st.grp-1){secs=10;next='Switch to '+exName(nx.id)}
  else{secs=b.rest||60;if(nx&&nx.bi!==st.bi)next='Up next: '+exName(nx.id);if(b.burst)burst=b.burst}
  P.rest={end:NOW()+secs*1000,total:secs*1000,next,burst};
  initCur();render();
}
function finishPlay(){
  const P=UI.play;const exs=[];
  P.w.blocks.forEach((b,bi)=>b.ex.forEach(id=>{const sets=P.rec[bi+':'+id];if(sets&&sets.length)exs.push({id,sets})}));
  const dur=Math.max(1,Math.round((NOW()-P.start)/60000));
  const prs=[];
  exs.forEach(e=>{let best=0;e.sets.forEach(s=>{if(s.w>0)best=Math.max(best,e1rm(s.w,s.r))});if(best>0){const prev=S.prs[e.id];if(prev&&best>prev*1.0001&&!prs.includes(e.id))prs.push(e.id);if(!prev||best>prev)S.prs[e.id]=best}});
  const log={t:NOW(),title:P.w.title,parts:P.w.parts,kind:P.w.kind,mode:effMode(),goal:S.goal,dur,ex:exs,pr:prs,prog:!!P.w.prog};
  S.logs.push(log);
  if(P.w.prog&&S.program)S.program.pos++;
  if(S.custom)S.custom=null;
  const nb=checkBadges();
  save();
  UI.fin={log,prs,nb,vol:exs.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+s.w*s.r,0),0),sets:exs.reduce((a,e)=>a+e.sets.length,0)};
  UI.play=null;UI.screen='finish';releaseLock();hap([60,40,60]);render();
}
function confetti(){const cols=['#C8F169','#0E0F11','#3D6FA0','#F0B84A','#86AE2B'];let h='<div class="conf" aria-hidden="true">';for(let i=0;i<46;i++){h+=`<i style="left:${Math.random()*100}%;background:${cols[i%5]};animation-delay:${(Math.random()*0.8).toFixed(2)}s;animation-duration:${(2+Math.random()*1.6).toFixed(2)}s"></i>`}return h+'</div>'}
/* ===== Haptics, wake lock, sound ===== */
let _wl=null;
function hap(p){if(S.set.haptics&&navigator.vibrate){try{navigator.vibrate(p)}catch(e){}}}
async function wakeLock(){try{if(navigator.wakeLock)_wl=await navigator.wakeLock.request('screen')}catch(e){}}
function releaseLock(){try{if(_wl)_wl.release();_wl=null}catch(e){}}
let _ac=null;function beep(){if(!S.set.sound)return;try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();const o=_ac.createOscillator(),g=_ac.createGain();o.connect(g);g.connect(_ac.destination);o.frequency.value=880;g.gain.value=.15;o.start();o.stop(_ac.currentTime+.25)}catch(e){}}
/* ===== Water ===== */
function waterStats(){
  const days=[];for(let i=6;i>=0;i--){const t=NOW()-i*DAY;days.push({t,ml:waterOn(t)})}
  const avg=Math.round(days.reduce((a,d)=>a+d.ml,0)/7);
  let streak=0;for(let i=waterToday()>=S.waterGoal?0:1;i<400;i++){if(waterOn(NOW()-i*DAY)>=S.waterGoal)streak++;else break}
  const byDay={};S.water.forEach(w=>{const k=dkey(w.t);byDay[k]=(byDay[k]||0)+w.ml});
  const best=Object.values(byDay).reduce((a,b)=>Math.max(a,b),0);
  return {days,avg,streak,best};
}
function waterSheet(){
  const wd=UI.wd||0,dayT=NOW()-wd*DAY;const wt=waterOn(dayT),pct=Math.min(100,Math.round(wt/S.waterGoal*100));const st=waterStats();
  const mx=Math.max(S.waterGoal*1.4,...st.days.map(d=>d.ml));
  const bars=st.days.map((d,i)=>{const h=Math.round(d.ml/mx*80);const x=14+i*40;const isT=i===6;
    return `<rect x="${x}" y="${96-h}" width="24" height="${Math.max(h,2)}" rx="6" fill="${d.ml>=S.waterGoal?'#6E9BC7':'#3D6FA0'}" opacity="${isT?1:.75}"/><text x="${x+12}" y="110" text-anchor="middle" font-size="10" fill="#9AA6B2">${DOW[wkIdx(d.t)][0]}</text>`}).join('');
  const gy=96-Math.round(S.waterGoal/mx*80);
  const todayLog=S.water.filter(w=>dkey(w.t)===dkey(dayT)).slice().reverse();
  const dayChips=[0,1,2].map(i=>`<button class="chip wchip ${i===wd?'on':''}" data-a="wday" data-v="${i}">${i===0?'Today':i===1?'Yesterday':fmtDate(NOW()-i*DAY).slice(0,6)}</button>`).join('');
  return `<div class="wave" aria-hidden="true"><svg viewBox="0 0 800 40" preserveAspectRatio="none"><path d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 T500 20 T600 20 T700 20 T800 20 V40 H0Z" fill="rgba(110,175,235,.28)"/></svg><svg class="w2" viewBox="0 0 800 40" preserveAspectRatio="none"><path d="M0 24 Q50 8 100 24 T200 24 T300 24 T400 24 T500 24 T600 24 T700 24 T800 24 V40 H0Z" fill="rgba(70,140,220,.35)"/></svg></div><div class="grab"></div><div class="stack">
  <div class="row"><div class="sp1"><div style="font-size:12px;letter-spacing:1.5px;color:#9AC3EA;font-weight:700">${wd===0?'WATER TODAY':wd===1?'WATER YESTERDAY':'WATER, '+esc(fmtDate(dayT).toUpperCase())}</div><div style="font-size:34px;font-weight:700;line-height:1.1">${wt} ml</div><div class="sub">${(wt/29.5735).toFixed(1)} oz of ${S.waterGoal} ml goal (${Math.round(S.waterGoal/29.5735)} oz)</div></div><button class="ibtn" class="wglass" data-a="sheetclose" aria-label="Close">${ico('close',20,'#F2F4F5')}</button></div>
  <div class="chips">${dayChips}</div>
  <div class="bar b" style="height:10px"><i style="width:${pct}%"></i></div>
  ${wt>=S.waterGoal*2.5?`<div style="font-size:13px;color:#9AA6B2">That is plenty for today. No need to keep going.</div>`:wt>=S.waterGoal?`<div style="font-size:13px;color:#8FB4D9">Goal reached. Sip as you need from here.</div>`:''}
  <div class="wq">${S.bottles.map(v=>`<button data-a="water+" data-v="${v}">+${v}<small>${(v/29.5735).toFixed(1)} oz</small></button>`).join('')}</div>
  <div class="row"><input id="wcust" inputmode="numeric" placeholder="Custom ml" style="flex:1;height:46px;border-radius:12px;border:1px solid rgba(150,200,255,.35);background:rgba(20,50,90,.55);color:#fff;padding:0 12px;min-width:0"><button class="btn" style="width:100px;height:46px;background:#3D6FA0;color:#fff" data-a="water-cust">Add</button></div>
  <div class="g2" style="grid-template-columns:repeat(3,1fr)"><div class="wtile"><div class="sub">7-day avg</div><b>${st.avg} ml</b></div><div class="wtile"><div class="sub">Goal streak</div><b>${st.streak} day${st.streak===1?'':'s'}</b></div><div class="wtile"><div class="sub">Best day</div><b>${st.best} ml</b></div></div>
  <div class="wtile" style="padding:10px 6px 4px"><svg viewBox="0 0 300 116" width="100%" role="img" aria-label="Water over the last 7 days"><line x1="6" x2="294" y1="${gy}" y2="${gy}" stroke="#8FB4D9" stroke-dasharray="4 4" stroke-width="1"/><text x="294" y="${gy-4}" text-anchor="end" font-size="10" fill="#8FB4D9">${S.waterGoal>=1000?(S.waterGoal/1000)+' L':S.waterGoal+' ml'}</text>${bars}</svg></div>
  <div><div style="font-weight:700;margin-bottom:6px">${wd===0?"Today's":wd===1?"Yesterday's":'That day\'s'} log</div>${todayLog.length?todayLog.slice(0,6).map(w=>`<div class="row" style="font-size:13px;padding:3px 0"><span class="sp1">${new Date(w.t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</span><span>${w.ml} ml</span><span class="sub" style="width:56px;text-align:right">${(w.ml/29.5735).toFixed(1)} oz</span></div>`).join(''):'<div class="sub">Nothing logged yet.</div>'}
  ${todayLog.length?`<button class="chip wchip" style="margin-top:8px" data-a="water-undo">Undo last</button>`:''}</div>
  <button class="chip wchip" style="align-self:flex-start" data-a="waterall">${ico('chart',14,'#fff')} See older days in Progress</button></div>`;
}
/* ===== Recovery / streak sheets ===== */
function recoverySheet(){
  const ms=muscleState();const c=colorsBy(m=>{const rec=m.some(x=>ms[x].st==='rec');return rec?'#E8B04A':'#B5D95F'});
  return `<div class="grab"></div><div class="stack"><div class="row"><div class="h1 sp1">Recovery</div><button class="ibtn" data-a="sheetclose" aria-label="Close">${ico('close')}</button></div>
  <div class="card"><div class="row" style="align-items:flex-start"><div class="sp1" style="text-align:center">${figSvg(c,false)}</div><div class="sp1" style="text-align:center">${figSvg(c,true)}</div></div><div class="legend" style="justify-content:center;margin-top:6px"><span><i style="background:#B5D95F"></i> Ready</span><span><i style="background:#E8B04A"></i> Resting</span></div></div>
  <div class="card">${Object.keys(MUSCLE_LABEL).map(k=>{const s=ms[k];const tot=(SMALL.has(k)?36:48);const pct=s.st==='rec'?Math.max(6,100-Math.round(s.hrs/(tot*1.5)*100)):100;
    return `<div class="row" style="padding:4px 0;font-size:13px"><span style="width:92px">${MUSCLE_LABEL[k]}</span><div class="bar sp1 ${s.st==='rec'?'am':''}"><i style="width:${pct}%;${s.st==='rec'?'':'background:#86AE2B'}"></i></div><span style="width:72px;text-align:right;color:var(--mut)">${s.st==='rec'?s.hrs+'h left':'Ready'}</span><button class="chip sm ${S.soreness[k]>NOW()?'on':''}" data-a="sore" data-v="${k}">Sore</button></div>`}).join('')}
  <div class="sub" style="margin-top:6px">Tap Sore to hold a muscle back for another day. The guard swaps moves that would hit resting muscles.</div></div>
  <div class="lrow"><div class="sp1"><b>Recovery guard</b><small>Swaps or trims moves for muscles still resting</small></div>${toggle(S.set.guard,'tog','guard')}</div>
  <div><div class="sub" style="margin-bottom:6px">Sensitivity</div><div class="seg">${[['relaxed','Relaxed'],['normal','Normal'],['strict','Strict']].map(([k,l])=>`<button class="${S.set.sens===k?'on':''}" data-a="sens" data-v="${k}">${l}</button>`).join('')}</div></div></div>`;
}
function streakSheet(){
  const sw=streakWeeks();
  return `<div class="grab"></div><div class="stack"><div class="row"><div class="h1 sp1">Streak and milestones</div><button class="ibtn" data-a="sheetclose" aria-label="Close">${ico('close')}</button></div>
  <div class="hero"><div class="k">CURRENT STREAK</div><div class="big">${sw} week${sw===1?'':'s'}</div><div class="m">A week counts when you hit your sessions target. Away modes never break it.</div></div>
  <div class="g2"><div class="mini" style="min-height:0"><div class="s">Total workouts</div><div class="v">${S.logs.length}</div></div><div class="mini" style="min-height:0"><div class="s">Total lifted</div><div class="v">${Math.round(totalVolume()*KG).toLocaleString()} lb</div><div class="s">${Math.round(totalVolume()).toLocaleString()} kg</div></div></div>
  <div class="g2" style="grid-template-columns:repeat(3,1fr)">${BADGES.map(b=>`<div class="badge ${S.badges.includes(b[0])?'on':''}">${ico('trophy',22,S.badges.includes(b[0])?'#2C3A10':'#9AA9B4')}${b[1]}</div>`).join('')}</div></div>`;
}
/* ===== Drawer ===== */
function drawerView(){
  const pi=S.program&&PROGRAMS.find(p=>p.id===S.program.id);
  const R=(ic,t,s,a,v='')=>`<button class="lrow" data-a="${a}" data-v="${v}"><span class="ic">${ico(ic,18,'#4E7A12')}</span><div class="sp1"><b>${t}</b><small>${s}</small></div>${ico('chev',16,'#9AA9B4')}</button>`;
  return `<div class="drawerbg" data-a="drawerclose"></div><aside class="drawer" aria-label="Menu"><div class="row"><div class="sp1"><div style="font-family:'Barlow Condensed';font-weight:700;font-size:34px;line-height:1">Gymmy</div><div class="sub">Private, on your device</div></div><button class="ibtn" data-a="drawerclose" aria-label="Close menu">${ico('close')}</button></div>
  <button class="lrow" data-a="sheet" data-v="users">${avatar(curUser(),userIdx(curUser()),34)}<div class="sp1"><b>${esc(curUser().name)}</b><small>Switch, edit or add profiles</small></div>${ico('chev',16,'#9AA9B4')}</button>
  <div class="sec">Goal</div><div class="seg">${[['bulk','Bulk'],['shred','Shred'],['maintain','Maintain']].map(([k,l])=>`<button class="${S.goal===k?'on':''}" data-a="goal" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="sec">Where today</div><div class="seg">${[['gym','Gym'],['home','Home']].map(([k,l])=>`<button class="${effMode()===k?'on':''}" data-a="mode" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="sec">Setup</div>
  ${R('chart','Progress and history','Strength, consistency, volume, past workouts','screen','progress')}
  ${R('gear','Equipment',`${(S.profiles.gym.items.length)} gym items, ${S.profiles.home.items.length} home`,'screen','equip')}
  ${R('week','Weekly schedule',S.sched?`${S.sched.days.filter(x=>x==='gym').length} gym, ${S.sched.days.filter(x=>x==='home').length} home, ${S.sched.days.filter(x=>x!=='gym'&&x!=='home').length} rest`:'Choose gym days, home days and rest days','schedopen')}
  ${R('moon','Away modes',(activeAway()?AWAY_LABEL[activeAway().type]+' is on':'Vacation, sick, travel, gym closed'),'sheet','away')}
  ${R('bell','Reminders',S.set.remWorkout?'Workout at '+S.set.remTime+', water '+S.set.remCount+' a day':'Off','sheet','remind')}
  ${R('user','Preferences','Units, tone, water goal, celebrations','sheet','prefs')}
  ${R('bolt','Band strength test','Find the right band for the rep range','sheet','band')}
  ${R('save','Backup and data','Copy your data out, paste it back in','sheet','backup')}
  ${R('trash','Reset','Clear a week, a month or everything','sheet','reset')}
  ${R('info','Show tips again','Replay the first-time walkthroughs','tipsreset')}
  <div class="sub" style="text-align:center;padding:8px">Everything stays on this device. No accounts, no tracking.</div><div class="sub" style="text-align:center;opacity:.7">Gymmy build 66</div></aside>`;
}
/* ===== Onboarding / equipment ===== */
function equipView(onb){
  const E=UI.eqprof||'gym';const have=new Set(S.profiles[E].items);
  return `<div class="top">${onb?'':`<button class="ibtn" data-a="back" aria-label="Back">${ico('back')}</button>`}<div class="sp1"><div class="h1">${onb?'What do you have?':'Equipment'}</div><div class="sub">${onb?'Tap what you can use. Change this any time in the menu.':'Tap to switch items on or off.'}</div></div></div>
  <div class="stack"><div class="tabs">${[['gym','Gym'],['home','Home']].map(([k,l])=>`<button class="${E===k?'on':''}" data-a="eqprof" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="row"><button class="chip sm" data-a="eqall" data-v="1">Select all</button><button class="chip sm" data-a="eqall" data-v="0">Clear</button><span class="sub sp1" style="text-align:right">${have.size} of ${EQUIP.length}</span></div>
  <div class="eqg">${EQUIP.map(([k,n,d])=>`<button class="eq ${have.has(k)?'on':''}" data-a="eqtog" data-v="${k}" aria-pressed="${have.has(k)}"><span class="ck">${ico('check',14,'#C8F169',3)}</span><div class="pic">${eqIcon(k,48)}</div><b>${n}</b><small>${d}</small><small style="font-weight:700;color:${have.has(k)?'var(--grn)':'var(--mut)'}">${have.has(k)?'Have it':'Do not have'}</small></button>`).join('')}</div>
  <button class="btn" data-a="${onb?'obnext':'back'}">${onb?'Next: your week':'Done'}</button></div>`;
}
function onboardView(){
  if(UI.ob.step===0)return `<div class="stack" style="padding-top:36px">
   <div style="font-family:'Barlow Condensed';font-weight:700;font-size:64px;line-height:.9">GYMMY</div><div style="font-size:16px;color:var(--mut)">A private workout guide that lives on your device. No accounts, no tracking.</div>
   <div class="sec" style="padding-top:16px">What is your goal right now?</div>
   ${[['bulk','Bulk','Build size. Heavier sets, longer rest.'],['shred','Shred','Lean out. Shorter rest, cardio bursts between sets.'],['maintain','Maintain','Hold what you built. Balanced volume.']].map(([k,t,d])=>`<button class="lrow" style="${S.goal===k?'outline:3px solid var(--ink)':''}" data-a="goal" data-v="${k}"><div class="sp1"><b style="font-size:17px">${t}</b><small>${d}</small></div>${S.goal===k?ico('check',20):''}</button>`).join('')}
   <div class="sub">You can switch any time from the menu.</div><button class="btn" data-a="obnext">Next: your equipment</button></div>`;
  if(UI.ob.step===2)return `<div class="top"><div class="sp1"><div class="h1">Your week</div><div class="sub">Gym days, home days and rest days</div></div></div><div class="stack">${schedBody(true)}</div>`;
  return equipView(true);
}
/* ===== Settings sheets ===== */
const SH=(t,body)=>`<div class="grab"></div><div class="stack"><div class="row"><div class="h1 sp1">${t}</div><button class="ibtn" data-a="sheetclose" aria-label="Close">${ico('close')}</button></div>${body}</div>`;
function awaySheet(){
  const a=activeAway();const td=new Date().toISOString().slice(0,10);
  return SH('Away modes',`<div class="sub">Pauses nudges and keeps your program position and streak safe.</div>${a?`<div class="note">${AWAY_LABEL[a.type]} is on until ${fmtDate(a.end)}.</div><button class="btn out" data-a="away-end">I am back, end it now</button>`:''}
  <div class="chips">${Object.keys(AWAY_LABEL).map(k=>chip(AWAY_LABEL[k],(UI.awayType||'vacation')===k,'awaytype',k)).join('')}</div>
  <div class="g2"><div class="field"><label for="astart">From</label><input id="astart" type="date" value="${td}"></div><div class="field"><label for="aend">Until</label><input id="aend" type="date" value="${new Date(NOW()+3*DAY).toISOString().slice(0,10)}"></div></div>
  <div class="sub">${(UI.awayType||'vacation')==='sick'?'Sick or injured mode swaps training for easy mobility only.':(UI.awayType)==='travel'?'Travel mode shortens workouts to 4 moves.':(UI.awayType)==='closed'?'Gym closed mode switches you to the home profile.':'Vacation pauses everything.'}</div>
  <button class="btn" data-a="away-add">Turn on</button>`);
}
function remindSheet(){
  const s=S.set;
  return SH('Reminders',`<div class="note g">In this web version reminders appear while Gymmy is open. The Android app version sends real notifications.</div>
  <div class="lrow"><div class="sp1"><b>Workout reminder</b><small>Skipped on rest days and away modes</small></div>${toggle(s.remWorkout,'tog','remWorkout')}</div>
  <div class="field"><label for="remt">Time</label><input id="remt" type="time" value="${s.remTime}" data-in="remTime"></div>
  <div class="lrow"><div class="sp1"><b>Water reminders</b><small>Spaced through your day, quieter once you are on pace</small></div>${toggle(s.remWater,'tog','remWater')}</div>
  <div class="g2"><div class="field"><label for="wake">Wake</label><input id="wake" type="time" value="${s.wake}" data-in="wake"></div><div class="field"><label for="slp">Sleep</label><input id="slp" type="time" value="${s.sleep}" data-in="sleep"></div></div>
  <div class="field"><label>Water reminders per day: ${s.remCount}</label><input type="range" min="2" max="8" value="${s.remCount}" data-in="remCount" style="height:30px"></div>`);
}
function prefsSheet(){
  const s=S.set;
  return SH('Preferences',`<div class="sec">Appearance</div><div class="seg">${[['auto','Auto'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${(s.theme||'auto')===k?'on':''}" data-a="theme" data-v="${k}">${l}</button>`).join('')}</div><div class="sub">Auto follows your phone's light or dark setting.</div><div class="sec">Units</div><div class="seg">${[['lb','lb first'],['kg','kg first']].map(([k,l])=>`<button class="${s.units===k?'on':''}" data-a="units" data-v="${k}">${l}</button>`).join('')}</div><div class="sub">Both units show side by side in the app. This sets which one you type in.</div>
  <div class="sec">Nudges</div><div class="seg">${[['funny','Funny'],['plain','Plain'],['off','Off']].map(([k,l])=>`<button class="${(s.nudges?s.tone:'off')===k?'on':''}" data-a="tone" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="lrow"><div class="sp1"><b>Roast mode</b><small>Spicier jokes after 3 or more missed days</small></div>${toggle(s.roast,'tog','roast')}</div>
  <div class="lrow"><div class="sp1"><b>Celebrations</b><small>Confetti and badges</small></div>${toggle(s.celebrate,'tog','celebrate')}</div>
  <div class="lrow"><div class="sp1"><b>Haptics</b><small>Vibrates on every tap and keypress, stronger for key actions</small></div>${toggle(s.haptics,'tog','haptics')}</div>
  <div class="lrow"><div class="sp1"><b>Rest sound</b><small>Short beep when rest ends</small></div>${toggle(s.sound,'tog','sound')}</div>
  <div class="sec">Water goal</div><div class="stepper"><button data-a="wgoal" data-v="-250" aria-label="Lower">-</button><input value="${S.waterGoal} ml" readonly aria-label="Daily water goal"><button data-a="wgoal" data-v="250" aria-label="Raise">+</button></div><div class="sub">Minimum 1 L a day. About ${Math.round(S.waterGoal/29.5735)} oz.</div>`);
}
const AVC=['#C8F169','#BFE3F5','#F7D6B5','#E3D3F5','#F5C9CF','#CFEFD9','#F3E7A6','#D5DCE3','#FAD7A0','#B9E4DC','#D9E6A8','#C9D5F5'];
const PRES=['lib','bolt','flame','shield','trophy','run','moon','bell','chart','glass','home','gear'];
const userIdx=x=>Math.max(0,U.list.findIndex(y=>y.id===x.id));
function avatarOf(name,pic,i,sz=40){
  const base=`width:${sz}px;height:${sz}px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;overflow:hidden;`;
  if(pic&&pic.indexOf('data:')===0)return `<span style="${base}background:#DDE5EA"><img src="${pic}" alt="" style="width:100%;height:100%;object-fit:cover"></span>`;
  if(pic&&pic.indexOf('i:')===0){const k=+pic.slice(2);return `<span style="${base}background:${AVC[k%AVC.length]}">${faceSvg(k%12,sz)}</span>`}
  return `<span style="${base}background:${AVC[i%AVC.length]};color:#12202B;font-weight:800;font-size:${sz*.42}px">${esc((name||'?').slice(0,1).toUpperCase())}</span>`;
}
const avatar=(x,i,sz=40)=>avatarOf(x.name,x.pic,i,sz);
/* Names may repeat: a duplicate is saved as "Name 2" instead of blocking the Create button. */
function uniqName(n,exceptId){n=n.trim();const used=x=>U.list.some(y=>y.id!==exceptId&&y.name.toLowerCase()===x.toLowerCase());if(!used(n))return n;let k=2;while(used(n+' '+k))k++;return n+' '+k}
function nameErr(n,exceptId){n=(n||'').trim();if(!n)return '';const u=uniqName(n,exceptId);return u!==n?'Another profile has this name. It will be saved as "'+u+'".':''}
function uCanSave(){const x=U.list.find(y=>y.id===UI.uview);const n=(UI.uname!==undefined?UI.uname:(x?x.name:'')).trim();if(!n)return false;if(!x)return true;return n!==x.name||(UI.upic!==undefined&&UI.upic!==(x.pic||null))}
function picPicker(name,cur,idx){
  return `<div style="display:flex;justify-content:center">${avatarOf(name||'?',cur,idx,84)}</div>
  <label class="btn out" style="cursor:pointer">${ico('plus',16)} Upload your photo<input type="file" id="upf" accept="image/*" style="display:none"></label>
  <div><div class="sec" style="text-align:center">Or pick a character</div><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:6px">${PRES.map((k,n)=>`<button data-a="upick" data-v="i:${n}" aria-label="Character ${n+1}" style="width:52px;height:52px;margin:0 auto;border-radius:50%;padding:0;display:flex;align-items:center;justify-content:center;${cur==='i:'+n?'box-shadow:0 0 0 3px var(--ink);':''}">${avatarOf('',`i:${n}`,0,44)}</button>`).join('')}</div></div>
  ${cur?`<button class="btn ghost" data-a="upick" data-v="">Use my initial instead</button>`:''}`;
}
function usersSheet(){
  const v=UI.uview;
  if(v==='add'){const nm=UI.uname||'';const pic=UI.upic||null;return SH('New profile',`${picPicker(nm,pic,U.list.length)}
   <div class="field"><label for="un">Name</label><input id="un" data-in="uname" value="${esc(nm)}" placeholder="e.g. Asha" maxlength="16" autocomplete="off"><small id="uerr" style="color:var(--mut);min-height:16px">${nameErr(nm)}</small></div>
   <button class="btn" id="usave" data-a="usave" ${uCanSave()?'':'disabled'}>Create profile</button><button class="btn ghost" data-a="uback">Cancel</button>`)}
  const i=U.list.findIndex(x=>x.id===v);
  if(i>=0){const x=U.list[i];const nm=UI.uname!==undefined?UI.uname:x.name;const pic=UI.upic!==undefined?UI.upic:(x.pic||null);
   return SH('Edit profile',`${picPicker(nm,pic,i)}
   <div class="field"><label for="un">Name</label><input id="un" data-in="uname" value="${esc(nm)}" maxlength="16" autocomplete="off"><small id="uerr" style="color:var(--red);min-height:16px">${nameErr(nm,x.id)}</small></div>
   <button class="btn" id="usave" data-a="usave" ${uCanSave()?'':'disabled'}>Save changes</button>
   <button class="btn ghost" data-a="uback">Back</button>
   <hr class="hr"><div class="lrow"><div class="sp1"><b>PIN lock</b><small>${x.pin?'On. Others need the PIN to open or edit this profile.':'Keep others out of this profile.'}</small></div></div>
   <div class="row"><button class="btn out sm" style="flex:1" data-a="pinset" data-v="${x.id}">${x.pin?'Change PIN':'Set a PIN'}</button>${x.pin?`<button class="btn out sm" style="flex:1" data-a="pinrm" data-v="${x.id}">Remove PIN</button>`:''}</div>
   ${U.list.length>1?`<hr class="hr"><button class="btn out" style="color:var(--red)" data-a="deluser" data-v="${x.id}">${UI.delAsk===x.id?'Tap again to delete '+esc(x.name)+' and all their data':'Delete profile'}</button>`:''}`)}
  const rows=U.list.map((x,k)=>{const on=x.id===U.cur;return `<div class="row" style="gap:8px"><button class="lrow sp1" data-a="switchuser" data-v="${x.id}" style="${on?'box-shadow:inset 0 0 0 2px var(--ink)':''}">${avatar(x,k)}<div class="sp1"><b>${esc(x.name)}</b><small>${on?'Active':'Tap to switch'}${x.pin?' - PIN locked':''}</small></div>${on?ico('check',18,'#4E7A12',3):''}</button><button class="ibtn" data-a="uedit" data-v="${x.id}" aria-label="Edit ${esc(x.name)}">${ico('pencil',18)}</button></div>`}).join('');
  return SH('Profiles',`<div class="sub" style="margin-top:-8px">Each profile keeps its own plan, history and settings.</div>
   <div class="stack" style="gap:8px">${rows}</div>
   ${U.list.length<MAXU?`<button class="btn out" data-a="uadd">${ico('plus',16)} Add profile</button>`:`<div class="sub" style="text-align:center">Profile limit reached. Delete one to add another.</div>`}
   ${curUser().pin?`<button class="btn out" data-a="lockcur">Lock this profile now</button>`:''}
   <div class="sub" id="syncst" style="text-align:center">${esc(syncLabel())}</div>`);
}
function backupSheet(){
  const data=JSON.stringify(S);
  return SH('Backup and data',`<div class="note">Browser storage can be cleared. Copy your data now and then and keep it somewhere safe.</div>
  <div class="field"><label for="exp">Your data</label><textarea id="exp" readonly>${esc(data)}</textarea></div><button class="btn out" data-a="copy">Copy to clipboard</button>
  <div class="field"><label for="imp">Paste a backup to restore</label><textarea id="imp" placeholder="Paste here"></textarea></div><button class="btn out" data-a="import">${UI.impAsk?'Tap again to replace everything':'Restore from pasted backup'}</button>
  <hr class="hr"><button class="btn out" data-a="sample">Load sample data to explore</button><button class="btn out" style="color:var(--red)" data-a="reset">${UI.resetAsk?'Tap again to erase everything':'Erase all data'}</button>`);
}
function rsRange(k){const n=NOW();if(k==='day'){const a=startOfDay(n);return [a,a+DAY]}if(k==='week'){const a=mondayOf(n);return [a,a+7*DAY]}const d=new Date(n);return [new Date(d.getFullYear(),d.getMonth(),1).getTime(),new Date(d.getFullYear(),d.getMonth()+1,1).getTime()]}
function rsCount(k){const [a,b]=rsRange(k),inn=x=>x.t>=a&&x.t<b;return {w:S.logs.filter(inn).length,h:S.water.filter(inn).length,m:(S.morn||[]).filter(inn).length+(S.wst||[]).filter(inn).length}}
function rsLine(c){return c.w+' workout'+(c.w===1?'':'s')+', '+c.h+' water entr'+(c.h===1?'y':'ies')+', '+c.m+' stretch session'+(c.m===1?'':'s')}
function resetSheet(){
  const ask=UI.rsAsk;const dy=rsCount('day'),wk=rsCount('week'),mo=rsCount('month');
  const B=(k,t,sub,c)=>`<div class="card stack" style="gap:8px"><div><b>${t}</b><div class="sub">${sub}</div></div><button class="btn out" ${c?'':'disabled'} style="${ask===k?'color:var(--red)':''}" data-a="rs" data-v="${k}">${ask===k?'Tap again to confirm':'Reset '+t.toLowerCase()}</button></div>`;
  return SH('Reset',`<div class="note">Resetting cannot be undone. Copy a backup first in Backup and data if you might want this data again.</div>
  ${B('day','Today','Clears '+rsLine(dy)+' from today.',dy.w+dy.h+dy.m)}
  ${B('week','This week','Mon to Sun. Clears '+rsLine(wk)+' and this week\'s plan.',wk.w+wk.h+wk.m+(S.plan?1:0))}
  ${B('month','This month','Clears '+rsLine(mo)+'.',mo.w+mo.h+mo.m)}
  <div class="card stack" style="gap:8px"><div><b>Whole app</b><div class="sub">Erases everything on this profile: history, records, badges, equipment, schedule and settings. You start again from the welcome page.</div></div><button class="btn out" style="color:var(--red)" data-a="reset">${UI.resetAsk?'Tap again to erase everything':'Erase everything'}</button></div>`);
}
function bandSheet(){
  const last=S.bandTests.slice(-3).reverse();
  return SH('Band strength test',`<div class="sub">Do one set of a move with a band to near failure, then enter your reps. Gymmy tells you how to use that band.</div>
  <div class="field"><label for="bname">Band (color or name)</label><input id="bname" placeholder="Red, medium"></div>
  <div class="field"><label for="bex">Move</label><select id="bex">${['Curl','Row','Chest press','Shoulder press','Squat'].map(x=>`<option>${x}</option>`).join('')}</select></div>
  <div class="field"><label for="breps">Reps to near failure</label><input id="breps" inputmode="numeric" placeholder="e.g. 14"></div>
  <button class="btn" data-a="band-add">Rate this band</button>
  ${last.map(b=>`<div class="card"><b>${esc(b.name)}</b> <span class="sub">${esc(b.ex)}, ${b.reps} reps</span><div style="font-size:13px;margin-top:4px">${esc(b.verdict)}</div></div>`).join('')}`);
}
function bandVerdict(r){if(r>=25)return 'Too light for strength. Good for warm-ups, rear delts, or use it doubled.';if(r>=16)return 'Light. Great for endurance sets of 15 to 25, or for small muscles.';if(r>=10)return 'Right zone for muscle growth. Use for sets of 10 to 15.';if(r>=6)return 'Heavy. Good for sets of 6 to 10 on this move.';return 'Very heavy for this move. Use it for bigger muscles or choose a lighter band.'}
const CARDIO_TYPES=['Run','Walk','Bike','Row','Jump rope','HIIT','Swim','Other'];
function cardioSheet(){
  return SH('Log cardio',`<div class="chips">${CARDIO_TYPES.map(c=>chip(c,(UI.cardioT||'Run')===c,'cardiot',c)).join('')}</div>
  <div class="g2"><div class="field"><label for="cmin">Minutes</label><input id="cmin" inputmode="numeric" placeholder="30"></div><div class="field"><label for="cdist">Distance in km (optional)</label><input id="cdist" inputmode="decimal" placeholder="5"></div></div>
  <button class="btn" data-a="cardio-save">Save cardio</button>`);
}
function editWeekSheet(){
  const plan=basePlan();const ps=['chest','back','shoulders','biceps','triceps','legs','calves','abs','traps'];
  return SH('Edit week',`<div class="sub">Pick body parts for each day. Leave a day empty for rest.</div>${DOW.map((d,i)=>`<div class="card stack" style="gap:6px"><b>${d}</b><div class="chips">${ps.map(p=>chip(PART_LABEL[p],plan[i].includes(p),'wkpart',i+':'+p)).join('')}</div></div>`).join('')}
  <button class="btn out" data-a="wkreset">Reset to ${S.goal==='shred'?'shred':'bulk'} default</button>`);
}
function jumpSheet(){
  const P=PROGRAMS.find(p=>p.id===UI.jumpId);if(!P)return '';
  return SH('Jump to workout',`<div class="field"><label for="jsel">Workout</label><select id="jsel">${Array.from({length:P.total},(_,i)=>`<option value="${i}" ${S.program&&S.program.pos%P.total===i?'selected':''}>${i+1}. ${esc(P.get(i).label||P.get(i).title)}, ${esc(P.get(i).title)}</option>`).join('')}</select></div><button class="btn" data-a="jump-go">Go here</button>`);
}
function swapSheet(){
  const parts=suggestParts();
  return SH('Swap today',`<div class="stack"><button class="lrow" data-a="swap-guide"><div class="sp1"><b>Guide: pick body parts</b><small>Generated from your goal and equipment</small></div>${ico('chev',16,'#9AA9B4')}</button>
  <button class="lrow" data-a="swap-ses"><div class="sp1"><b>A specialty workout</b><small>Pick from the Specialty list</small></div>${ico('chev',16,'#9AA9B4')}</button>
  <button class="lrow" data-a="swap-foc"><div class="sp1"><b>Focus on muscles</b><small>One or several, strict toggle</small></div>${ico('chev',16,'#9AA9B4')}</button>
  <button class="lrow" data-a="build"><div class="sp1"><b>Build my own</b><small>Start empty and add moves</small></div>${ico('chev',16,'#9AA9B4')}</button>
  <div class="sec">Quick guide</div><div class="chips">${['chest','back','shoulders','biceps','triceps','legs','abs'].map(p=>chip(PART_LABEL[p],(UI.swapParts||[]).includes(p),'swappart',p)).join('')}</div>
  <button class="btn" data-a="swap-go" ${(UI.swapParts||[]).length?'':'disabled'}>Build workout</button></div>`);
}
function sheetHtml(){
  const k=UI.sheet;if(!k)return '';
  if(k==='poststr')return postStrSheet();if(k==='water')return waterSheet();if(k==='recovery')return recoverySheet();if(k==='streak')return streakSheet();
  if(k==='users')return usersSheet();if(k==='morning')return mornSheet();if(k==='away')return awaySheet();if(k==='remind')return remindSheet();if(k==='prefs')return prefsSheet();if(k==='backup')return backupSheet();if(k==='reset')return resetSheet();
  if(k==='sched')return schedSheet();if(k==='planadd')return planAddSheet();if(k==='band')return bandSheet();if(k==='cardio')return cardioSheet();if(k==='editweek')return editWeekSheet();if(k==='jump')return jumpSheet();if(k==='swap')return swapSheet();
  if(k==='detail')return exDetail(UI.detail);if(k==='picker')return pickerView();
  return '';
}


function planAddSheet(){
  const t=UI.padd||{};const dw=S.dayW||{};
  const title=t.kind==='ex'?(EXB[t.id]?EXB[t.id].n:'Exercise'):(UI.prev&&UI.prev.w?UI.prev.w.title:'Workout');
  const today=wkIdx(NOW());
  return SH('Add to plan',`<div class="sub" style="margin-top:-8px">${esc(title)}. Pick the day. ${t.kind==='ex'?'It is added to that day\'s pinned workout, or starts one.':'It replaces the auto workout for that day.'}</div>
  <div class="stack" style="gap:8px">${DAYFULL.map((n,i)=>{const d=dw[i];const tt=NOW()-(today-i)*DAY;const pl=plannedParts(tt).length;
   return `<div class="srow ${d?'gym':''}"><div class="row"><div class="sp1"><b>${n}${i===today?' (today)':''}</b><div class="sub">${d?'Pinned: '+esc(d.title):(pl?'Auto workout':'Rest day')}</div></div>${d?`<button class="ibtn" style="width:38px;height:38px;border-radius:12px" data-a="planclear" data-v="${i}" aria-label="Clear">${ico('trash',16)}</button>`:''}<button class="btn sm" style="width:auto;padding:0 16px" data-a="planput" data-v="${i}">${d?'Replace':'Add here'}</button></div>
   ${!d&&!pl?`<div class="swarn">${ico('info',14)} This is a rest day. Adding a workout removes your rest that day.</div>`:''}</div>`}).join('')}</div>`);
}
const PLANACT={
 planadd(v){UI.padd=v&&v.indexOf('ex:')===0?{kind:'ex',id:v.slice(3)}:{kind:'w'};UI.sheet='planadd';render()},
 planput(v){const i=+v,t=UI.padd||{};S.dayW=S.dayW||{};
  if(t.kind==='ex'){const e=EXB[t.id];if(!e)return;let d=S.dayW[i];if(!d)d={id:'dw'+NOW(),title:'My workout',parts:[],blocks:[]};const w={blocks:d.blocks};addBlock(w,t.id);d.blocks=w.blocks;const pt=MUSCLE_PART[e.p[0]];if(pt&&!d.parts.includes(pt))d.parts.push(pt);S.dayW[i]=d}
  else{const w=UI.prev&&UI.prev.w;if(!w)return;S.dayW[i]={id:'dw'+NOW(),title:w.title,parts:(w.parts||[]).slice(),blocks:cloneBlocks(w.blocks),by:w.by||''}}
  save();UI.sheet=null;render();toast('Added to '+DAYFULL[i])},
 planclear(v){if(S.dayW)delete S.dayW[+v];save();render()},
 startex(v){const e=EXB[v];if(!e)return;const w={id:'custom-'+NOW(),title:e.n,parts:[MUSCLE_PART[e.p[0]]].filter(Boolean),blocks:[],notes:[],kind:'custom'};addBlock(w,v);adaptW(w);setCustom(w);UI.sheet=null;UI.picker=null;startPlay(w)}
};

function postStrSheet(){
  const b=buildWS('post');UI._wsparts=(UI.fin&&UI.fin.log&&UI.fin.log.parts)||UI._wsparts;const bb=buildWS('post');
  return SH('Cool down?',`<div class="sub" style="margin-top:-8px">${bb.items.length} slow stretches, about ${Math.round(mornTotal(bb.items)/60)} min. ${esc(bb.sub)} It helps you recover and stay loose.</div>
  <button class="btn" data-a="wstart" data-v="post">${ico('play',18)} Start cool-down</button><button class="btn out" data-a="wskip">Not now</button>`);
}

/* ===== PIN lock for profiles ===== */
function pinHash(id,p){let h1=0xdeadbeef^id.length,h2=0x41c6ce57;const s=id+':gymmy:'+p;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36)}
const uById=id=>U.list.find(x=>x.id===id);
function padView(){
  const P=UI.pad,x=uById(P.id)||curUser(),k=Math.max(0,U.list.indexOf(x));
  const title=P.mode==='enter'?'Enter PIN':P.mode==='new'?'Choose a 4 digit PIN':'Enter it again';
  const sub=P.mode==='enter'?(P.then==='boot'?'Unlock '+esc(x.name):'PIN for '+esc(x.name)):esc(x.name);
  const wait=UI.pinlock&&UI.pinlock>NOW()&&P.mode==='enter'?Math.ceil((UI.pinlock-NOW())/1000):0;
  const dots=[0,1,2,3].map(i=>`<i class="pdot ${i<P.buf.length?'on':''}"></i>`).join('');
  const keys=['1','2','3','4','5','6','7','8','9','','0','b'].map(c=>c===''?'<span></span>':`<button class="pkey" data-a="pk" data-v="${c}" ${wait?'disabled':''} aria-label="${c==='b'?'Delete':c}">${c==='b'?'&#9003;':c}</button>`).join('');
  const others=P.then==='boot'&&U.list.length>1?`<div class="sub" style="text-align:center">Not you? Switch profile</div><div class="pothers">${U.list.filter(u=>u.id!==x.id).map(u=>`<button class="pother" data-a="padswitch" data-v="${u.id}">${avatar(u,U.list.indexOf(u),40)}<small>${esc(u.name)}${u.pin?' (PIN)':''}</small></button>`).join('')}</div>`:'';
  return `<div class="padwrap"><div class="padbox">${avatar(x,k,72)}<div class="padt">${title}</div><div class="sub">${sub}</div><div class="pdots">${dots}</div><div class="perr" role="alert">${wait?'Too many tries. Wait '+wait+' seconds.':esc(P.err||'')}</div><div class="pkeys">${keys}</div>${others}${P.then!=='boot'?'<button class="btn ghost" data-a="padcancel">Cancel</button>':''}</div></div>`}
function padDone(){
  const P=UI.pad;if(!P||P.buf.length<4)return;const x=uById(P.id);if(!x){UI.pad=null;render();return}
  UI.unl=UI.unl||{};
  if(P.mode==='enter'){
    if(pinHash(x.id,P.buf)===x.pin){UI.unl[x.id]=1;UI.pinfail=0;const t=P.then;UI.pad=null;
      if(t==='switch'){ACT.switchuser(x.id);return}
      if(t==='edit'){UI.uview=x.id;UI.uname=undefined;UI.upic=undefined;UI.delAsk=null;UI.sheet='users'}
      render();return}
    UI.pinfail=(UI.pinfail||0)+1;P.buf='';P.err='Wrong PIN';hap([60,40,60]);
    if(UI.pinfail>=5){UI.pinlock=NOW()+30000;UI.pinfail=0;setTimeout(()=>{if(UI.pad)render()},30500)}
    render();return}
  if(P.mode==='new'){P.first=P.buf;P.buf='';P.mode='new2';render();return}
  if(P.buf===P.first){x.pin=pinHash(x.id,P.buf);x.t=Date.now();UI.unl[x.id]=1;saveUsers();UI.pad=null;toast('PIN set');render()}
  else{P.buf='';P.first='';P.mode='new';P.err='PINs did not match. Try again.';hap([60,40,60]);render()}
}
