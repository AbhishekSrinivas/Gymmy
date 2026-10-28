/* ===== Core: state, storage, helpers, engines ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const EXB={}; EX.forEach(e=>EXB[e.id]=e);
const exByName=n=>EXB[slug(n)];
const DAY=864e5, HR=36e5;
let KEY='gymmy.v1';
const UKEY='gymmy.users',MAXU=10;
let U={list:[{id:'u1',name:'Me'}],cur:'u1'};
const keyFor=id=>id==='u1'?'gymmy.v1':'gymmy.u.'+id;
function loadUsers(){try{const r=localStorage.getItem(UKEY);if(r){const o=JSON.parse(r);if(o&&Array.isArray(o.list)&&o.list.length)U=o}}catch(e){}if(!U.list.find(u=>u.id===U.cur))U.cur=U.list[0].id;KEY=keyFor(U.cur)}
function saveUsers(){U.t=Date.now();try{localStorage.setItem(UKEY,JSON.stringify(U))}catch(e){}try{if(typeof syncPushUsers==='function')syncPushUsers()}catch(e){}}
const curUser=()=>U.list.find(u=>u.id===U.cur)||U.list[0];
const DEFAULT_STATE=()=>({v:1,onboarded:false,goal:'bulk',mode:'gym',profile:'gym',
 profiles:{gym:{name:'Gym',items:GYM_DEFAULT.slice()},home:{name:'Home',items:HOME_DEFAULT.slice()}},
 program:null,custom:null,plan:null,logs:[],water:[],waterGoal:1000,bottles:[150,250,500,750],
 away:[],morn:[],mornPick:null,favs:[],tour:{},dayW:{},sched:null,schedAsked:false,modeDay:'',pausedUntil:0,prs:{},badges:[],soreness:{},bandTests:[],customSessions:[],
 set:{theme:'auto',mornMin:10,units:'lb',tone:'funny',roast:true,guard:true,sens:'normal',celebrate:true,haptics:true,sound:false,remWorkout:true,remTime:'18:30',remWater:true,remCount:4,wake:'07:00',sleep:'22:30',nudges:true,recHrs:{}}});
let S;
function migrate(){if(S&&!S.eqv&&S.profiles&&S.profiles.home&&Array.isArray(S.profiles.home.items)){['boardcord','abroller'].forEach(k=>{if(!S.profiles.home.items.includes(k))S.profiles.home.items.push(k)});S.eqv=1}}
const GKEY=()=>'gymmy.goal.'+U.cur;
function rememberGoal(){try{localStorage.setItem(GKEY(),S.goal)}catch(e){}const u=curUser();if(u&&u.goal!==S.goal){u.goal=S.goal;u.t=Date.now();saveUsers();if(typeof syncPushUsers==='function')syncPushUsers(true)}}
function restoreGoal(){/* the goal you picked is a profile setting: it always wins over a stale or default state */
  const u=curUser();let g=(u&&u.goal)||'';if(!g){try{g=localStorage.getItem(GKEY())||''}catch(e){}}
  if(g==='bulk'||g==='shred'||g==='maintain')S.goal=g}
function load(){try{const r=localStorage.getItem(KEY);if(r){S=Object.assign(DEFAULT_STATE(),JSON.parse(r));S.set=Object.assign(DEFAULT_STATE().set,S.set||{});restoreGoal();migrate();return}}catch(e){}S=DEFAULT_STATE();restoreGoal();S.eqv=1}
function save(){S._t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}try{if(typeof syncPush==='function')syncPush()}catch(e){}}
const KG=2.20462;
const lb=kg=>Math.round(kg*KG*2)/2, kgr=kg=>Math.round(kg*2)/2;
function fmtW(kg,compact){if(kg==null||isNaN(kg))return '';return compact?`${lb(kg)} lb`:`${lb(kg)} lb / ${kgr(kg)} kg`}
const startOfDay=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
const dkey=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const mondayOf=t=>{const d=new Date(startOfDay(t));const w=(d.getDay()+6)%7;return d.getTime()-w*DAY};
const DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const wkIdx=t=>(new Date(t).getDay()+6)%7;
const fmtDate=t=>new Date(t).toLocaleDateString(undefined,{month:'short',day:'numeric'});
const NOW=()=>Date.now();
function greeting(){const h=new Date().getHours();return h<5?'Late night':h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function pick(a,seed){return a[Math.abs(seed)%a.length]}
/* equipment requirements */
function reqs(ex){
  const n=ex.n.toLowerCase(), r=new Set();
  const eq=ex.eq;
  if(eq==='bb')r.add('barbell'); else if(eq==='db')r.add('dumbbell'); else if(eq==='cable')r.add('cable'); else if(eq==='smith')r.add('smith'); else if(eq==='band')r.add('bands'); else if(eq==='kb')r.add('kettlebell'); else if(eq==='mach')r.add('machine');
  if(eq==='other'){ if(/ez-bar|landmine|trap bar|t-bar/.test(n))r.add('barbell'); if(/plate/.test(n))r.add('barbell'); if(/jump rope/.test(n))r.add('rope'); if(/medicine/.test(n))r.add('medball'); if(/roll-out/.test(n))r.add('abroller'); if(/suspended/.test(n))r.add('pullup'); }
  if(/pull-up|chin-up|hanging|dead hang|scap pull|knee raise on parallel|gorilla/.test(n)&&!/assisted/.test(n))r.add('pullup');
  if(/assisted pull/.test(n))r.add('machine');
  if(/\bdip\b/.test(n)&&!/bench/.test(n))r.add('dip');
  if(/leg press/.test(n)&&!/calf/.test(n))r.add('legpress');
  if(/calf raise/.test(n)) {r.delete('machine'); if(/leg press/.test(n))r.add('legpress'); else r.add('machine');}
  if(/pulldown/.test(n)&&/wide|behind|reverse|standing|close-grip v|seated under|underhand/.test(n)){r.delete('cable');r.add('pulldown')}
  if((eq==='bb'||eq==='db')&&/bench|incline|decline|static/.test(n)&&!/close-grip pushup|incline pushup/.test(n)&&!/curl|row|fly|incline cable/.test(n)&&/press/.test(n))r.add('bench');
  if(/incline dumbbell fly|dumbbell fly|preacher|incline curl|hip thrust|bench dip|chest-supported|45-degree/.test(n)&&!/cable|smith/.test(n))r.add('bench');
  if(/^squat$|front squat|box squat|rack pull|overhead press|seated barbell shoulder/.test(n))r.add('rack');
  if(/mountain|burpee|jump|sprint|running|lateral bound/.test(n)){}
  if(/pushup/.test(n)&&/board/.test(n))r.add('pushboard');
  if(/weighted hip thrust/.test(n)&&eq==='db')r.delete('bench');
  return [...r];
}
EX.forEach(e=>e.r=reqs(e));
const effMode=()=>{const a=activeAway();if(a&&a.type==='closed')return 'home';if(S.sched&&S.modeDay!==dkey(NOW())){const k=schedKind(NOW());if(k==='gym'||k==='home')return k}return S.mode};
const items=()=>new Set((S.profiles[effMode()==='home'?'home':'gym']||S.profiles.gym).items);
const canDo=(ex,set)=>{set=set||items();return ex.r.every(x=>set.has(x)||(x==='bands'&&set.has('boardcord'))||(x==='abroller'&&set.has('barbell')))};
/* Alternatives that keep the primary muscle */
function swapFor(ex,avoidMuscles=[],set,exclude=[],same=false){
  set=set||items();
  let c=EX.filter(e=>e.id!==ex.id&&!exclude.includes(e.id)&&e.p[0]===ex.p[0]&&canDo(e,set)&&![...e.p,...e.s.slice(0,1)].some(m=>avoidMuscles.includes(m)&&m!==ex.p[0]));
  if(same)c=c.filter(e=>e.pt===ex.pt&&e.m===ex.m&&!e.s.some(m=>avoidMuscles.includes(m)));
  c.sort((a,b)=>(b.pt===ex.pt)-(a.pt===ex.pt)||(b.m===ex.m)-(a.m===ex.m));
  return c[0]||null;
}
/* ===== Recovery guard ===== */
const SMALL=new Set(['biceps','triceps','forearms','calves','abs','obliques','traps','reardelt','sidedelt']);
function muscleState(){
  const out={};
  const sensMul={strict:1.25,normal:1,relaxed:0.75}[S.set.sens]||1;
  const per={};
  [...S.logs].sort((a,b)=>a.t-b.t).forEach(l=>{
    const sess={};
    l.ex.forEach(e=>{const ex=EXB[e.id];if(!ex)return;e.sets.forEach(s=>{
      const m=s.tech?1.3:1;
      ex.p.forEach(x=>sess[x]=(sess[x]||0)+1*m);ex.s.forEach(x=>sess[x]=(sess[x]||0)+0.5*m)})});
    Object.keys(sess).forEach(m=>{
      const base=(S.set.recHrs&&S.set.recHrs[m])||(SMALL.has(m)?36:48);
      const hrs=(sess[m]>=10?base*1.5:sess[m]>=5?base:base*0.7)*sensMul;
      per[m]={last:l.t,ready:l.t+hrs*HR,load:sess[m]};
    });
  });
  Object.keys(S.soreness||{}).forEach(m=>{const t=S.soreness[m];if(t>NOW()){per[m]=Object.assign(per[m]||{last:NOW(),load:0},{ready:Math.max(t,(per[m]||{}).ready||0),sore:true})}});
  Object.keys(MUSCLE_LABEL).forEach(m=>{const p=per[m];if(!p){out[m]={st:'ready',hrs:0,last:0};return}
    const left=(p.ready-NOW())/HR;out[m]={st:left>0?'rec':'ready',hrs:Math.max(0,Math.ceil(left)),last:p.last,sore:p.sore}});
  return out;
}
function partState(ms,part){ // resting hours for a body part: resting if at least half its muscles are recovering
  const ml=PART_MUSCLES[part]||[];const rec=ml.filter(m=>ms[m]&&ms[m].st==='rec');
  if(!ml.length||rec.length<Math.ceil(ml.length/2))return 0;return Math.max(...rec.map(m=>ms[m].hrs))}
/* ===== Away modes ===== */
function activeAway(t=NOW()){return (S.away||[]).find(a=>startOfDay(a.start)<=t&&t<startOfDay(a.end)+DAY)||null}
const AWAY_LABEL={vacation:'Vacation',sick:'Sick or injured',travel:'Travel or busy week',closed:'Gym closed'};
/* ===== Week plan ===== */
function basePlan(){if(S.plan)return S.plan;return (S.goal==='shred'?WEEK_SHRED:WEEK_BULK).map(a=>a.slice())}
function progDayIdx(){const P=PROGRAMS.find(p=>p.id===S.program.id);if(S.sched&&S.sched.days){const t=S.sched.days.map((v,i)=>v==='gym'||v==='home'?i:-1).filter(i=>i>=0);if(t.length)return t.slice(0,P.days)}return P.days<=3?[0,2,4]:P.days===4?[0,1,3,4]:P.days===5?[0,1,2,3,4]:[0,1,2,3,4,5]}
function progLogsThisWeek(){const m=mondayOf(NOW());return S.logs.filter(l=>l.prog&&l.t>=m&&l.t<m+7*DAY).length}
function progPosFor(t){const P=PROGRAMS.find(p=>p.id===S.program.id);const idx=progDayIdx();const j=idx.indexOf(wkIdx(t));if(j<0)return -1;
  const wd=Math.round((mondayOf(t)-mondayOf(NOW()))/(7*DAY));const pos=S.program.pos-progLogsThisWeek()+wd*idx.length+j;return ((pos%P.total)+P.total)%P.total}
function plannedParts(t){{const dw=S.dayW&&S.dayW[wkIdx(t)];if(dw)return dw.parts}if(S.program&&PROGRAMS.find(p=>p.id===S.program.id)){const pos=progPosFor(t);if(pos<0)return [];return PROGRAMS.find(p=>p.id===S.program.id).get(pos).parts}return basePlan()[wkIdx(t)]||[]}
function logsOn(t){const k=dkey(t);return S.logs.filter(l=>dkey(l.t)===k)}
/* Program position helpers */
function progInfo(){if(!S.program)return null;const P=PROGRAMS.find(p=>p.id===S.program.id);if(!P)return null;const pos=S.program.pos%P.total;return {P,pos,day:P.get(pos)}}
/* ===== Build workouts ===== */
const mkBlock=(names,sets,reps,o={})=>Object.assign({ex:names,sets,reps,rest:75},o);
function exName(id){return EXB[id]?EXB[id].n:id}
function genGuide(parts,goal,opts={}){
  const set=items(), ms=muscleState(), notes=[], blocks=[];
  const away=activeAway(); let cap=opts.cap||(away&&away.type==='travel'?4:99);
  if(S.set.guard&&!opts.noGuard){
    parts=parts.slice();
    const rec=ms;parts.forEach((part,i)=>{const h=partState(ms,part);if(h>0){
      const cand=suggestParts().find(p=>!parts.includes(p));
      if(cand){notes.push(`${PART_LABEL[part]} still resting (${h}h), so ${PART_LABEL[cand].toLowerCase()} replaces it today.`);parts[i]=cand}
      else notes.push(`${PART_LABEL[part]} still resting (${h}h). Go lighter today.`)}});
  }
  const per=parts.length===1?6:parts.length===2?4:3;
  const comp=goal==='shred'?['10-15',3,45]:['6-10',4,120], iso=goal==='shred'?['12-15',3,40]:['10-12',3,75];
  const used=[];
  parts.forEach(part=>{
    const pool=(TPL[part]||[]).map(exByName).filter(Boolean);
    let n=0;
    pool.forEach(ex=>{
      if(n>=per)return;
      let use=ex;
      if(!canDo(ex,set)){const alt=swapFor(ex,[],set,used);if(!alt||pool.some(p=>p.id===alt.id))return;use=alt}
      if(used.includes(use.id))return;
      if(S.set.guard&&!opts.noGuard){
        const badS=use.s.filter(m=>ms[m]&&ms[m].st==='rec');
        if(badS.length){const alt=swapFor(use,badS,set,used,true);if(alt&&!pool.some(p=>p.id===alt.id)){notes.push(`${use.n} swapped for ${alt.n} to spare ${MUSCLE_LABEL[badS[0]].toLowerCase()}.`);use=alt}}
      }
      used.push(use.id);
      const c=use.m==='comp'?comp:iso;
      const hold=/Plank|Dead Hang/.test(use.n);
      blocks.push(mkBlock([use.id],c[1],hold?'45 sec':c[0],{rest:c[2],hold:hold?45:0}));
      n++;
    });
  });
  const limited=blocks.slice(0,cap);
  if(cap<99&&blocks.length>cap)notes.push('Shortened for travel mode.');
  return {id:'guide-'+Date.now(),title:parts.map(p=>PART_LABEL[p]).join(', '),parts,blocks:limited,notes,kind:'guide',techNote:goal==='shred'?'Short cardio bursts between sets keep your heart rate up.':''};
}
function resolveBlocks(blocks){ // convert names to ids where needed
  return blocks.map(b=>Object.assign({},b,{ex:b.ex.map(n=>EXB[n]?n:(exByName(n)?exByName(n).id:null)).filter(Boolean)})).filter(b=>b.ex.length);
}
function sessionToWorkout(s){return {id:s.id+'-'+Date.now(),title:s.t,parts:s.parts,blocks:resolveBlocks(s.blocks),notes:s.trim?['Trimmed version: fewer sets than the original is fine.']:[],kind:'session',by:s.by,techNote:''}}
function programToWorkout(){const pi=progInfo();if(!pi)return null;const d=pi.day;return {id:d.id+'-'+Date.now(),title:d.title,parts:d.parts,blocks:resolveBlocks(d.blocks),notes:[],kind:'program',label:d.label,techNote:d.techNote,prog:true}}
function suggestParts(){const ms=muscleState();const cand=['chest','back','legs','shoulders','biceps','triceps','abs'];
  const sc=cand.map(p=>{const m=PART_MUSCLES[p];const rec=partState(ms,p);const last=Math.max(...m.map(x=>ms[x].last||0));return {p,rec,last}}).filter(x=>x.rec===0).sort((a,b)=>a.last-b.last);
  return (sc.length?sc:cand.map(p=>({p}))).slice(0,2).map(x=>x.p)}
function todayWorkout(force){
  if(S.custom&&S.custom.date===dkey(NOW()))return S.custom.w;
  const away=activeAway();
  if(away&&away.type==='sick'&&!force) return null;
  {const dw=S.dayW&&S.dayW[wkIdx(NOW())];if(dw&&!away)return {id:dw.id,title:dw.title,parts:dw.parts.slice(),blocks:JSON.parse(JSON.stringify(dw.blocks)),notes:[],kind:'session',by:dw.by,techNote:''}}
  const hasProg=S.program&&PROGRAMS.find(p=>p.id===S.program.id);
  if(hasProg&&(!away||force)&&(plannedParts(NOW()).length||force)){const w=programToWorkout();if(w){applyGuardToProgram(w);return w}}
  let parts=plannedParts(NOW());
  if(!parts.length){if(!force)return null;parts=suggestParts()}
  return genGuide(parts,S.goal);
}
function applyGuardToProgram(w){
  const set=items();const ms=muscleState();const used=w.blocks.flatMap(b=>b.ex);
  w.blocks.forEach(b=>{const ex=EXB[b.ex[0]];if(!ex)return;
    if(!canDo(ex,set)){const a=swapFor(ex,[],set,used);if(a){w.notes.push(`${ex.n} swapped for ${a.n} (equipment).`);used.push(a.id);b.ex=[a.id]}return}
    if(!S.set.guard)return;
    const badS=ex.s.filter(m=>ms[m]&&ms[m].st==='rec'&&!w.parts.includes(MUSCLE_PART[m]));
    if(badS.length&&ms[ex.p[0]].st!=='rec'){const a=swapFor(ex,badS,set,used,true);if(a){w.notes.push(`${ex.n} swapped for ${a.n} to spare ${MUSCLE_LABEL[badS[0]].toLowerCase()}.`);used.push(a.id);b.ex=[a.id]}}
  });
}
function adaptW(w){
  if(!w.base)w.base=JSON.parse(JSON.stringify(w.blocks));
  w.blocks=JSON.parse(JSON.stringify(w.base));w.notes=(w.notes||[]).filter(n=>!/^\[mode\]/.test(n));
  const set=items();const used=w.blocks.flatMap(b=>b.ex);let n=0,miss=0;
  w.blocks.forEach(b=>{b.ex=b.ex.map(id=>{const ex=EXB[id];if(!ex||canDo(ex,set))return id;const a=swapFor(ex,[],set,used);if(a){used.push(a.id);n++;return a.id}miss++;return id})});
  if(n)w.notes.unshift(`[mode]${n} exercise${n>1?'s':''} swapped for ${effMode()==='home'?'home':'gym'} equipment.`);
  if(miss)w.notes.unshift(`[mode]${miss} exercise${miss>1?'s have':' has'} no ${effMode()==='home'?'home':'gym'} alternative, skip or swap by hand.`);
  w.notes=w.notes.map(x=>x.replace(/^\[mode\]/,'[mode]'));
}
function setCustom(w){S.custom={date:dkey(NOW()),w};save()}
/* ===== Logs, volumes, PRs ===== */
const e1rm=(w,r)=>w*(1+r/30);
function lastPerf(id){for(let i=S.logs.length-1;i>=0;i--){const e=S.logs[i].ex.find(x=>x.id===id);if(e&&e.sets.length)return e.sets[e.sets.length-1]}return null}
function weekCounts(t){ // times each muscle trained in the week of t
  const m0=mondayOf(t), c={}; 
  S.logs.filter(l=>l.t>=m0&&l.t<m0+7*DAY).forEach(l=>{const seen=new Set();l.ex.forEach(e=>{const ex=EXB[e.id];if(!ex||!e.sets.length)return;seen.add(ex.p[0]);});
    const sec=new Set();l.ex.forEach(e=>{const ex=EXB[e.id];if(ex&&e.sets.length)ex.s.forEach(x=>{if(!seen.has(x))sec.add(x)})});
    // count a muscle if it was a primary target of at least 2 sets or any primary
    seen.forEach(x=>c[x]=(c[x]||0)+1)});
  return c;
}
function streakWeeks(){ // weeks (Mon-Sun) in a row with at least 2 workouts or all planned done
  let w=mondayOf(NOW()), n=0;
  const target=Math.max(2,Math.min(4,basePlan().filter(a=>a.length).length-1));
  const count=m=>S.logs.filter(l=>l.t>=m&&l.t<m+7*DAY).length;
  let cur=count(w); if(cur>=target)n++;
  w-=7*DAY;
  while(count(w)>=target){n++;w-=7*DAY;if(n>200)break}
  return n;
}
function totalVolume(){let v=0;S.logs.forEach(l=>l.ex.forEach(e=>e.sets.forEach(s=>v+=(s.w||0)*(s.r||0))));return v}
const BADGES=[
 ['first','First workout','Log your first workout',()=>S.logs.length>=1],['w5','5 workouts','Five sessions logged',()=>S.logs.length>=5],['w10','10 workouts','Ten sessions logged',()=>S.logs.length>=10],['w25','25 workouts','Twenty-five sessions',()=>S.logs.length>=25],['w50','50 workouts','Fifty sessions',()=>S.logs.length>=50],['w100','100 workouts','One hundred sessions',()=>S.logs.length>=100],
 ['pr1','First PR','Beat your best on a lift',()=>Object.keys(S.prs).length>=1&&S.logs.some(l=>l.pr&&l.pr.length)],['pr10','10 PRs','Ten personal records',()=>S.logs.reduce((a,l)=>a+(l.pr?l.pr.length:0),0)>=10],
 ['vol','10,000 lb moved','Total volume lifted',()=>totalVolume()*KG>=10000],['home','First home workout','Off-gym days count',()=>S.logs.some(l=>l.mode==='home')],
 ['all','Every muscle group','Trained every body part',()=>{const s=new Set();S.logs.forEach(l=>l.ex.forEach(e=>{const x=EXB[e.id];if(x)s.add(MUSCLE_PART[x.p[0]])}));return ['chest','back','shoulders','biceps','triceps','legs','abs'].every(p=>s.has(p))}],
 ['sess','Finished a special session','Completed a named session',()=>S.logs.some(l=>l.kind==='session')],['prog','Program started','Logged a program workout',()=>S.logs.some(l=>l.kind==='program')],
 ['wk','Strong week','Three or more workouts in a week',()=>{const c={};S.logs.forEach(l=>{const k=mondayOf(l.t);c[k]=(c[k]||0)+1});return Object.values(c).some(v=>v>=3)}],
 ['water','Water goal','Hit your water goal',()=>{const k=dkey(NOW());return waterToday()>=S.waterGoal||S.badges.includes('water')}],
 ['rest','Rest day taken','Took a planned rest day',()=>{const y=NOW()-DAY;return plannedParts(y).length===0&&logsOn(y).length===0&&S.logs.length>0}]];
function checkBadges(){const nb=[];BADGES.forEach(b=>{if(!S.badges.includes(b[0])&&b[3]()){S.badges.push(b[0]);nb.push(b)}});if(nb.length)save();return nb}
/* ===== Water ===== */
function waterToday(){const k=dkey(NOW());return S.water.filter(w=>dkey(w.t)===k).reduce((a,w)=>a+w.ml,0)}
function waterOn(t){const k=dkey(t);return S.water.filter(w=>dkey(w.t)===k).reduce((a,w)=>a+w.ml,0)}
function addWater(ml,off){S.water.push({t:off?startOfDay(NOW()-off*DAY)+12*3600000:NOW(),ml});save()}
/* ===== Nudges ===== */
function missedPlannedDays(){ // consecutive planned training days missed, most recent first, ignoring rest days and away
  let n=0;const last=S.logs.length?S.logs[S.logs.length-1].t:0;
  for(let i=1;i<=14;i++){const t=NOW()-i*DAY;if(t<startOfDay(last))break;if(activeAway(t))continue;if(plannedParts(t).length===0)continue;if(logsOn(t).length)break;n++}
  return n;
}
function homeStreak(){let n=0;for(let i=S.logs.length-1;i>=0;i--){if(S.logs[i].mode==='home')n++;else break}return n}
function currentNudge(){
  if(!S.set.nudges)return null;
  if(S.pausedUntil>NOW())return {k:'pause',t:'Nudges are paused. Enjoy the break.'};
  const away=activeAway();
  if(away)return {k:'away',t:`${AWAY_LABEL[away.type]} mode is on until ${fmtDate(away.end)}. Nudges are paused and your program position is kept.`};
  const seed=Math.floor(NOW()/DAY);
  const m=missedPlannedDays();
  if(S.logs.length===0)return {k:'hi',t:'Welcome. Start your first workout whenever you are ready, or browse Workouts.'};
  if(logsOn(NOW()).length)return {k:'done',t:pick(PRAISE,seed)};
  if(m>=3&&S.set.roast&&S.set.tone==='funny')return {k:'roast',t:pick(ROASTS,seed)};
  if(m>=1&&S.set.tone==='funny')return {k:'pun',t:pick(PUNS,seed)};
  if(m>=1)return {k:'gentle',t:S.set.tone==='plain'?`You have ${m} planned day${m>1?'s':''} to catch up on.`:'Ready when you are.'};
  if(homeStreak()>=2&&effMode()!=='home')return {k:'gym',t:pick(GYMNUDGE,seed)};
  return {k:'ok',t:pick(PRAISE,seed)};
}

/* ===== Regions: which part of a muscle an exercise targets ===== */
const REGLAB={ch_up:'Upper chest',ch_mid:'Mid chest',ch_low:'Lower chest',fd:'Front delts',sd:'Side delts',rd:'Rear delts',bi_long:'Biceps, long head',bi_short:'Biceps, short head',tri_long:'Triceps, long head',tri_lat:'Triceps, lateral head',ab_up:'Upper abs',ab_low:'Lower abs',ob:'Obliques',qu_out:'Outer quads',qu_mid:'Mid quads',qu_in:'Inner quads',la_up:'Upper lats',la_low:'Lower lats',tr_up:'Upper traps',tr_mid:'Mid back and traps',gl:'Glutes',ha:'Hamstrings',ca_gas:'Upper calf',ca_sol:'Soleus, lower calf'};
const REGGROUPS=[['Chest',['ch_up','ch_mid','ch_low']],['Shoulders',['fd','sd','rd']],['Biceps',['bi_long','bi_short']],['Triceps',['tri_long','tri_lat']],['Back',['la_up','la_low','tr_mid','tr_up']],['Abs',['ab_up','ab_low','ob']],['Quads',['qu_out','qu_mid','qu_in']],['Hamstrings and glutes',['ha','gl']],['Calves',['ca_gas','ca_sol']]];
function regOf(e){
  const n=e.n.toLowerCase(),p=e.p[0];const R=(label,ids)=>({label,ids});
  switch(p){
  case 'chest':
    if(/incline pushup|decline pushup/.test(n)&&/incline/.test(n))return R('Lower chest',['ch_low']);
    if(/decline|dip|high-to-low|lower chest/.test(n))return R('Lower chest',['ch_low']);
    if(/incline|feet-elevated|low-to-high|landmine|upper/.test(n))return R('Upper chest',['ch_up']);
    if(/crossover/.test(n))return R('Mid and lower chest, inner pec',['ch_mid','ch_low']);
    if(/fly|pec deck|squeeze|svend/.test(n))return R('Mid chest, inner pec',['ch_mid']);
    return R('Mid chest, whole pec',['ch_mid']);
  case 'lats':
    if(/straight-arm|pullover/.test(n))return R('Lower lats',['la_low']);
    if(/underhand|close-grip|reverse|chin-up|v-bar/.test(n))return R('Lower lats and biceps',['la_low']);
    if(/wide|behind|standing pulldown|pull-up/.test(n))return R('Upper lats, back width',['la_up']);
    if(/row/.test(n))return R('Mid lats, back thickness',['la_up','la_low']);
    return R('Lats',['la_up','la_low']);
  case 'midback':return R('Mid back, rhomboids',['tr_mid']);
  case 'lowback':return R('Lower back',[]);
  case 'traps':if(/shrug|upright/.test(n))return R('Upper traps',['tr_up']);return R('Mid traps',['tr_mid']);
  case 'frontdelt':if(/press|push/.test(n)&&!/raise/.test(n))return R('Front and side delts',['fd','sd']);return R('Front delts',['fd']);
  case 'sidedelt':return R('Side delts',['sd']);
  case 'reardelt':return R('Rear delts',['rd']);
  case 'biceps':
    if(/incline|drag|bayesian|behind/.test(n))return R('Long head, outer bicep',['bi_long']);
    if(/preacher|concentration|spider|high cable|one-arm high/.test(n))return R('Short head, inner bicep',['bi_short']);
    if(/hammer|reverse|rope/.test(n))return R('Brachialis and outer bicep',['bi_long']);
    return R('Both heads of the bicep',['bi_long','bi_short']);
  case 'triceps':
    if(/overhead|skullcrusher|lying|extension|french|three-angle/.test(n))return R('Long head, inner triceps',['tri_long']);
    if(/pushdown|pressdown|kickback|jackhammer/.test(n))return R('Lateral head, outer triceps',['tri_lat']);
    return R('All three heads, medial emphasis',['tri_long','tri_lat']);
  case 'abs':
    if(/leg raise|reverse crunch|knee raise|heels|hip thrust|lower|jackknife|flutter/.test(n))return R('Lower abs',['ab_low']);
    if(/plank|roll|hold|dead bug|hollow|mountain/.test(n))return R('Deep core, whole abs',['ab_up','ab_low']);
    if(/oblique|woodchop|side|twist|russian|roundhouse/.test(n))return R('Obliques',['ob']);
    return R('Upper abs',['ab_up']);
  case 'obliques':return R('Obliques',['ob']);
  case 'quads':
    if(/leg extension/.test(n))return R('Rectus and outer quad sweep',['qu_mid','qu_out']);
    if(/split|lunge|step-up|bulgarian/.test(n))return R('Quads, inner and outer',['qu_in','qu_out','qu_mid']);
    if(/front squat|goblet|hack|sissy/.test(n))return R('Front of the quads',['qu_mid','qu_in']);
    return R('All quads',['qu_out','qu_mid','qu_in']);
  case 'hams':return R('Hamstrings',['ha']);
  case 'glutes':return R('Glutes',['gl']);
  case 'calves':if(/seated/.test(n))return R('Soleus, lower calf',['ca_sol']);return R('Gastrocnemius, upper calf',['ca_gas']);
  case 'forearms':return R('Forearms',[]);
  }
  return R(MUSCLE_LABEL[p]||p,[]);
}
EX.forEach(e=>{const r=regOf(e);e.reg=r.label;e.rg=r.ids});
function weekRegions(t){const m0=mondayOf(t),c={};S.logs.filter(l=>l.t>=m0&&l.t<m0+7*DAY).forEach(l=>{const seen=new Set();(l.ex||[]).forEach(e=>{const ex=EXB[e.id];if(ex&&e.sets.length)(ex.rg||[]).forEach(r=>seen.add(r))});seen.forEach(r=>c[r]=(c[r]||0)+1)});return c}
function wTargets(w){ // [[partLabel,[region labels]]]
  const g={};(w.blocks||[]).forEach(b=>b.ex.forEach(id=>{const e=EXB[id];if(!e)return;const k=PART_LABEL[MUSCLE_PART[e.p[0]]]||MUSCLE_LABEL[e.p[0]];(g[k]=g[k]||[]);if(!g[k].includes(e.reg))g[k].push(e.reg)}));
  return Object.entries(g)}

/* ===== Theme: auto follows the system, or force light or dark ===== */
const _dq=window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){
  const t=(S&&S.set&&S.set.theme)||'auto';const dark=t==='dark'||(t==='auto'&&_dq.matches);
  document.documentElement.dataset.gm=dark?'dark':'light';
  const m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',dark?'#000000':'#F3F6F8');
}
try{_dq.addEventListener('change',applyTheme)}catch(e){}
