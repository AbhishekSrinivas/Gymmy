/* ===== Morning reset: mobility, stretch and primer routines ===== */
const MEXD=[
 ['catcow','Cat-Cow',['lowback'],['abs'],'Whole spine, back and belly','catcow',30,false,'mob',['back','core'],['Start on hands and knees, hands under shoulders, knees under hips.','Breathe in, drop the belly and lift your head (cow).','Breathe out, round your back toward the ceiling and tuck your chin (cat).']],
 ['childs','Child\'s Pose',['lats'],['lowback'],'Lats and lower back stretch','childs',30,false,'mob',['back'],['Kneel and sit your hips back toward your heels.','Walk your hands forward and rest your chest low.','Breathe slowly and let your back lengthen.']],
 ['thoracic','Thoracic Rotation',['midback'],['obliques'],'Upper back and rib rotation','thoracic',30,true,'mob',['back','shoulders'],['On hands and knees, place one hand behind your head.','Rotate that elbow down toward the other arm, then open up toward the ceiling.','Follow your elbow with your eyes. Keep your hips still.']],
 ['hipflex','Hip Flexor Stretch',['quads'],['glutes'],'Front of the hip and upper quad','hipflex',30,true,'mob',['legs'],['Kneel on one knee with the other foot in front.','Squeeze the glute of the back leg and tuck your pelvis.','Lean forward gently until you feel the front of the back hip stretch. Reach the same-side arm up.']],
 ['wgs','World\'s Greatest Stretch',['glutes'],['hams','midback'],'Hips, hamstrings and upper back','wgs',30,true,'mob',['legs','back'],['Step into a long lunge and place both hands inside the front foot.','Rotate your chest toward the front knee and reach that arm to the ceiling.','Hold, then return your hand to the floor and repeat.']],
 ['hamfold','Forward Fold',['hams'],['lowback','calves'],'Hamstrings and calves','hamfold',30,false,'mob',['legs','back'],['Stand tall with feet hip width and knees soft.','Hinge forward from the hips and let your head and arms hang.','Keep a small bend in the knees. Do not force your hands to the floor.']],
 ['squathold','Deep Squat Hold',['glutes'],['quads','calves'],'Hips, groin and ankles','squathold',30,false,'mob',['legs'],['Stand with feet a bit wider than shoulders and toes slightly out.','Sit down into the deepest squat you can with heels flat.','Press your elbows against your knees and keep your chest tall.']],
 ['ankle','Ankle Rocks',['calves'],[],'Ankle and calf mobility','ankle',30,false,'mob',['legs'],['Stand facing a wall with one foot back a little.','Drive your front knee forward over your toes while the heel stays down.','Rock back and forth slowly. Switch feet halfway.']],
 ['neck','Neck Tilts',['traps'],[],'Sides of the neck and upper traps','neck',30,false,'mob',['shoulders'],['Stand tall with shoulders relaxed.','Tilt one ear toward its shoulder, hold, then the other side.','Keep the opposite shoulder low. Do not pull on your head.']],
 ['armcirc','Arm Circles',['sidedelt'],['frontdelt','reardelt'],'Shoulder joint, all three heads','armcirc',30,false,'mob',['shoulders','chest'],['Stand tall with arms out to your sides.','Make slow, big circles. Go forward for half the time, then backward.','Keep your ribs down and shoulders away from your ears.']],
 ['doorway','Doorway Chest Stretch',['chest'],['frontdelt'],'Chest and front of the shoulder','doorway',30,true,'mob',['chest','shoulders'],['Stand in a doorway and rest your forearm on the frame, elbow at shoulder height.','Step through slightly until you feel a stretch across the chest.','Keep your ribs down. Switch sides halfway.']],
 ['chintuck','Chin Tucks',['traps'],[],'Deep neck and upper back posture','chintuck',30,false,'mob',['shoulders','back'],['Stand tall and look straight ahead.','Glide your head straight back, making a double chin, without tilting.','Hold two seconds and release. Repeat slowly.']],
 ['cobra','Cobra Stretch',['abs'],['lowback'],'Front of the abs and spine','cobra',30,false,'mob',['core','back'],['Lie face down with hands under your shoulders.','Press up gently, keeping your hips on the floor.','Look forward and relax your glutes. Stop where it feels comfortable.']],
 ['dog','Downward Dog',['hams'],['calves','lats'],'Hamstrings, calves and shoulders','dog',30,false,'mob',['legs','back','shoulders'],['Start in a push-up position and lift your hips up and back.','Press your chest toward your thighs and push the floor away.','Bend your knees if your hamstrings are tight.']],
 ['birddog','Bird Dog',['lowback'],['glutes','abs'],'Spine stability, glutes and deep core','birddog',30,true,'prime',['core','back','legs'],['On hands and knees, brace your belly lightly.','Reach one arm forward and the opposite leg back until they are in line with your spine.','Hold two seconds without letting the hips twist. Return and switch.']],
 ['deadbug','Dead Bug',['abs'],['obliques'],'Deep core and lower abs','deadbug',30,true,'prime',['core'],['Lie on your back, arms up and knees over hips.','Press your lower back into the floor.','Lower the opposite arm and leg slowly without arching your back. Switch.']],
 ['quadstr','Standing Quad Stretch',['quads'],[],'Front of the thigh','quadstr',30,true,'mob',['legs'],['Stand tall and hold something steady if needed.','Bend one knee and pull your heel toward your glute.','Keep your knees together and push your hip forward gently. Switch sides.']],
 ['inchworm','Inchworm',['hams'],['abs','frontdelt'],'Hamstrings, core and shoulders','inchworm',40,false,'prime',['legs','core','shoulders'],['Stand, fold forward and place your hands on the floor.','Walk your hands out to a plank, keeping your legs as straight as you can.','Walk your hands back to your feet and stand up.']],
 ['bwsquat','Bodyweight Squat',['quads'],['glutes'],'Quads and glutes','bwsquat',40,false,'prime',['legs'],['Feet shoulder width, toes slightly out.','Sit your hips back and down, keeping your chest tall and heels flat.','Stand up by pushing the floor away. Move smoothly.']],
 ['glutebr','Glute Bridge',['glutes'],['hams'],'Glutes and hamstrings','bridge',40,false,'prime',['legs','core'],['Lie on your back with knees bent and feet flat.','Squeeze your glutes and lift your hips until your body is straight from knees to shoulders.','Pause one second at the top, then lower slowly.']]
];
const MEX=MEXD.map(d=>({id:'mv-'+d[0],n:d[1],eq:'bw',p:d[2],s:d[3],reg:d[4],rg:[],tpl:d[5],pt:'mob',m:'iso',g:[],r:[],how:d[10],lvl:'beginner',mv:{secs:d[6],side:d[7],type:d[8],parts:d[9]}}));
MEX.forEach(e=>{EXB[e.id]=e});
/* existing exercises reused as morning moves */
const MEXS={'Dead Hang':{secs:30,side:false,type:'mob',parts:['back','shoulders']},'Scap Pull':{secs:30,side:false,type:'prime',parts:['back','shoulders']},'Plank':{secs:30,side:false,type:'prime',parts:['core']},'Banded External Rotation':{secs:30,side:false,type:'prime',parts:['shoulders']}};
function mvOf(ref){ // ref: 'mv-x' or exercise name
  if(EXB[ref]&&EXB[ref].mv)return {ex:EXB[ref],mv:EXB[ref].mv};
  const e=exByName(ref);if(!e)return null;const m=MEXS[ref]||{secs:30,side:false,type:'mob',parts:[]};return {ex:e,mv:m};
}
const ROUTINES=[
 {id:'wake',t:'Wake-up flow',sub:'Gently unlock the spine, hips and shoulders.',moves:['mv-neck','mv-armcirc','mv-catcow','mv-thoracic','mv-childs','mv-hipflex','mv-hamfold','mv-inchworm']},
 {id:'mobility',t:'Mobility flow',sub:'Open the hips, ankles and upper back.',moves:['mv-squathold','mv-wgs','mv-hipflex','mv-hamfold','mv-ankle','mv-thoracic','mv-cobra','mv-dog','Dead Hang']},
 {id:'primer',t:'Strength primer',sub:'Switch on glutes, core and shoulder blades.',moves:['mv-glutebr','mv-birddog','mv-deadbug','Scap Pull','mv-bwsquat','Plank','mv-inchworm']},
 {id:'pre',t:'Pre-workout warm-up',sub:'Dynamic moves for what you train today. About 5 min.',moves:[],ws:1},
 {id:'post',t:'Post-workout cool-down',sub:'Slow stretches for the muscles you just worked. About 6 min.',moves:[],ws:1},
 {id:'posture',t:'Desk and posture fix',sub:'Undo the slouch. Chest, neck and upper back.',moves:['mv-chintuck','mv-doorway','mv-thoracic','mv-catcow','Scap Pull','mv-cobra','mv-childs']}
];
const ROT=['mobility','wake','primer','mobility','posture','primer','wake'];
const REC_MOVES={legs:['mv-hipflex','mv-quadstr','mv-hamfold','mv-ankle','mv-squathold'],back:['mv-childs','mv-catcow','Dead Hang','mv-thoracic'],chest:['mv-doorway','mv-armcirc','mv-thoracic'],shoulders:['mv-armcirc','mv-doorway','mv-neck'],biceps:['mv-doorway','mv-armcirc'],triceps:['mv-armcirc','mv-doorway'],abs:['mv-cobra','mv-childs'],calves:['mv-ankle','mv-dog']};
const PRT={legs:'legs',back:'back',chest:'chest',shoulders:'shoulders',biceps:'arms',triceps:'arms',abs:'abs',calves:'calves'};
function recentParts(){const t0=NOW()-40*HR;return [...new Set(S.logs.filter(l=>l.t>t0).flatMap(l=>l.parts||[]))]}
function mornTotal(items){return items.reduce((a,x)=>a+x.secs+5,0)}
const PRE_MOVES={chest:['mv-armcirc','mv-thoracic','Banded External Rotation'],back:['mv-catcow','mv-thoracic','Scap Pull'],legs:['mv-bwsquat','mv-wgs','mv-glutebr','mv-ankle'],shoulders:['mv-armcirc','Banded External Rotation','Scap Pull'],biceps:['mv-armcirc'],triceps:['mv-armcirc'],abs:['mv-deadbug','mv-birddog'],calves:['mv-ankle']};
function wsParts(kind){
  if(kind==='post'){if(UI._wsparts&&UI._wsparts.length)return UI._wsparts;const l=S.logs.length?S.logs[S.logs.length-1]:null;return (l&&l.parts)||[]}
  if(UI._wspre&&UI._wspre.length)return UI._wspre;const w=typeof todayWorkout==='function'?todayWorkout():null;return (w&&w.parts)||[];
}
function buildWS(kind,mins){
  const parts=wsParts(kind),pre=kind==='pre';mins=pre?5:6;
  const src=pre?PRE_MOVES:REC_MOVES;const gen=pre?['mv-armcirc','mv-catcow','mv-inchworm','mv-bwsquat','mv-wgs','mv-thoracic']:['mv-childs','mv-hamfold','mv-cobra','mv-doorway','mv-quadstr','mv-neck'];
  const order=[];const add=m=>{if(m&&!order.includes(m))order.push(m)};
  parts.forEach(p=>(src[p]||[]).forEach(add));gen.forEach(add);
  const items=[],target=mins*60;
  for(const ref of order){const o=mvOf(ref);if(!o)continue;const secs=o.mv.side?o.mv.secs*2:(pre?Math.min(o.mv.secs,30):Math.max(o.mv.secs,30));
    if(items.length>=4&&mornTotal(items)+secs+5>target+10)continue;
    items.push({id:o.ex.id,secs,side:!!o.mv.side});if(mornTotal(items)>=target-10&&items.length>=4)break}
  const names=parts.map(p=>PRT[p]||p).filter((v,i,a)=>a.indexOf(v)===i);
  return {rid:kind,kind,title:pre?'Pre-workout warm-up':'Post-workout cool-down',sub:names.length?'For '+names.join(', ')+'.':'A general routine.',items,rp:parts,recParts:[],mins};
}
function buildMorning(rid,mins){
  if(rid==='pre'||rid==='post')return buildWS(rid,mins);
  const r=ROUTINES.find(x=>x.id===rid)||ROUTINES[0];mins=mins||S.set.mornMin||10;
  const rp=recentParts();const rec=[];rp.forEach(p=>(REC_MOVES[p]||[]).forEach(m=>{if(!rec.includes(m))rec.push(m)}));
  let order=[];const add=m=>{if(m&&!order.includes(m))order.push(m)};
  r.moves.slice(0,2).forEach(add);rec.slice(0,3).forEach(add);r.moves.slice(2).forEach(add);
  rec.slice(3).forEach(add);ROUTINES.forEach(o=>o.moves.forEach(add));
  const items=[];const target=mins*60;
  for(const ref of order){const o=mvOf(ref);if(!o)continue;const per=o.mv.secs;const secs=o.mv.side?per*2:per;
    if(items.length>=4&&mornTotal(items)+secs+5>target+10)continue;
    items.push({id:o.ex.id,secs,side:!!o.mv.side});if(mornTotal(items)>=target-10&&items.length>=4)break}
  return {rid:r.id,title:r.t,sub:r.sub,items,rp,recParts:rp.filter(p=>REC_MOVES[p]),mins};
}
function todayPick(){
  const dk=dkey(NOW());const pk=S.mornPick;
  if(pk&&pk.d===dk&&ROUTINES.find(x=>x.id===pk.id))return pk.id;
  return ROT[new Date(NOW()).getDay()];
}
function mornDoneToday(){const dk=dkey(NOW());return (S.morn||[]).filter(x=>dkey(x.t)===dk)}
function mornStreak(){const days=new Set((S.morn||[]).map(x=>dkey(x.t)));let n=0,t=startOfDay(NOW());if(!days.has(dkey(t)))t-=DAY;while(days.has(dkey(t))){n++;t-=DAY}return n}
const isMorning=()=>{const h=new Date().getHours();return h>=4&&h<12};
function mornPill(){
  if(mornDoneToday().length||isMorning()||UI.mornOpen)return '';
  return `<button class="spill" data-a="mornopen" aria-expanded="false" aria-label="Morning stretch">${ico('warrior',15)}Stretch</button>`;
}
function mornCard(){
  const done=mornDoneToday(),st=mornStreak();
  if(done.length){const l=done[done.length-1];return `<div class="morn done"><div class="row" style="gap:10px"><span class="ic" style="background:#EAF7C8;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center">${ico('check',20,'#4E7A12',3)}</span><div class="sp1"><b>Stretch done</b><div class="sub">${l.min} min today. ${st} day streak.</div></div><button class="chip sm" data-a="msheet">Again</button></div></div>`}
  if(!isMorning()&&!UI.mornOpen)return '';
  const b=buildMorning(todayPick());const why=b.recParts.length?'Added moves for '+b.recParts.map(p=>PRT[p]||p).filter((v,i,a)=>a.indexOf(v)===i).join(', ')+' you trained recently.':'Picked for you today.';
  return `<div class="morn"><div class="row" style="gap:10px;align-items:flex-start"><span class="ic" style="background:#FFF1D6;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center">${ico('warrior',20,'#8A5A00')}</span><div class="sp1"><div class="sec" data-dec="1" style="padding:0">STRETCH</div><b style="font-size:17px">${esc(b.title)}</b><div class="sub">${Math.round(mornTotal(b.items)/60)} min, ${b.items.length} moves. ${esc(why)}</div></div>${isMorning()?'':`<button class="ibtn" style="width:auto;height:30px;padding:0 12px;border-radius:15px;font-size:12px;font-weight:700;background:var(--bg);box-shadow:none" data-a="mornclose" aria-label="Minimize">Minimize</button>`}</div><div class="row" style="gap:8px;margin-top:10px"><button class="btn sm sp1" data-a="mstart">Start</button><button class="btn out sm" style="width:auto;padding:0 16px" data-a="msheet">Change</button></div></div>`;
}
function rord(){const o=S.set.rorder||[];return [...o.map(id=>ROUTINES.find(r=>r.id===id)).filter(Boolean),...ROUTINES.filter(r=>o.indexOf(r.id)<0)]}
function mornSheet(){
  const cur=todayPick(),len=S.set.mornMin||10;
  return SH('Stretch',`<div class="sub" style="margin-top:-8px">The app picks a routine each day and adds moves for muscles you trained recently. You can choose a different one. Press and hold a routine, then drag to reorder.</div>
  <div class="stack" style="gap:8px" data-drag="rt">${rord().map((r,i)=>`<button class="lrow dri" data-di="${i}" data-a="mpick" data-v="${r.id}" style="${cur===r.id?'box-shadow:inset 0 0 0 2px var(--ink)':''}"><div class="sp1"><b>${esc(r.t)}</b><small>${esc(r.sub)}</small></div>${cur===r.id?ico('check',18,'#4E7A12',3):''}</button>`).join('')}</div>
  <div><div class="sec" style="text-align:center">Length</div><div class="seg" style="margin-top:6px">${[5,10,15].map(n=>`<button class="${len===n?'on':''}" data-a="mlen" data-v="${n}">${n} min</button>`).join('')}</div></div>
  <button class="btn" data-a="mstart">Start now</button>`);
}
/* ---------- player ---------- */
let _mt=null;
function startMorning(rid){
  const b=buildMorning(rid||todayPick());if(!b.items.length){toast('Nothing to show yet');return}
  UI.sheet=null;UI.drawer=false;UI.mor={b,i:0,paused:false,sw:false,quit:false,t0:NOW()};mSetItem(0);UI.screen='morning';wakeLock();render();
  clearInterval(_mt);_mt=setInterval(mTick,250);
}
function mSetItem(i){const M=UI.mor;M.i=i;M.sw=false;M.dur=M.b.items[i].secs*1000;M.end=NOW()+M.dur;M.left=M.dur}
function mTick(){
  const M=UI.mor;if(!M||UI.screen!=='morning'||M.paused)return;
  const left=M.end-NOW();M.left=left;const it=M.b.items[M.i];
  if(it.side&&!M.sw&&left<=M.dur/2){M.sw=true;hap([120,60,120]);beep();const e=$('#mside');if(e)e.textContent='Switch sides. Now the second side.'}
  if(left<=0){mNext();return}
  const t=$('#mt');if(t)t.textContent=fmtT(left);const bar=$('#mbar');if(bar)bar.style.width=Math.round((1-left/M.dur)*100)+'%';
}
function mNext(){const M=UI.mor;hap(30);if(M.i+1>=M.b.items.length){mFinish();return}mSetItem(M.i+1);render()}
function mFinish(){
  const M=UI.mor;clearInterval(_mt);releaseLock();const min=Math.max(1,Math.round((NOW()-M.t0)/60000));
  const ids=M.b.items.map(x=>x.id);
  if(M.b.kind)(S.wst=S.wst||[]).push({t:NOW(),k:M.b.kind,min,n:ids.length});else (S.morn=S.morn||[]).push({t:NOW(),r:M.b.rid,min,n:ids.length,ids});save();
  UI._wsparts=null;UI._wspre=null;UI.fin={min,n:ids.length,st:M.b.kind?0:mornStreak(),ids,title:M.b.title,kind:M.b.kind||''};UI.mor=null;UI.screen='mfinish';hap([100,50,100,50,200]);render();
}
const MPUN=['Spine unlocked. Hips are thanking you.','Stretchy and smug. Good morning.','Rise, hinge and shine.','You are now officially bendier than yesterday.'];
function morningView(){
  const M=UI.mor;if(!M)return '';const it=M.b.items[M.i],ex=EXB[it.id];const left=Math.max(0,M.end-NOW());
  const segs=M.b.items.map((x,i)=>`<i class="${i<M.i?'on':i===M.i?'cur':''}"></i>`).join('');const nx=M.b.items[M.i+1];
  const half=it.side?(M.sw||(!M.paused&&left<=M.dur/2)?'Switch sides. Now the second side.':'First side. We will buzz when it is time to switch.'):'';
  return `<div class="top"><button class="btn ghost" style="width:auto;padding:0 6px;height:40px" data-a="mquit">${M.quit?'Tap again to quit':'Quit'}</button><div class="sp1" style="text-align:center"><div class="sub">${esc(M.b.title)}</div></div><div style="font-weight:700;font-size:13px">${M.i+1} of ${M.b.items.length}</div></div>
  <div class="stack"><div class="prog">${segs}</div><div class="big2">${esc(ex.n)}</div>
  <div class="pl2"><div class="plL">${visual(ex)}
   <div class="card row" style="gap:12px"><div>${exFig(ex,90)}</div><div class="sp1"><div class="sec" style="padding:0">Feel it in</div><div style="font-weight:700;font-size:16px;line-height:1.2">${esc(ex.reg)}</div></div></div></div>
  <div class="plR"><div class="card stack" style="gap:10px;text-align:center"><div class="sub" id="mside" style="min-height:18px">${esc(half)}</div><div class="big2" id="mt" style="font-size:54px;line-height:1">${fmtT(left)}</div><div class="rbar"><i id="mbar" style="width:${Math.round((1-left/M.dur)*100)}%"></i></div>
   <div class="row" style="gap:8px"><button class="btn out sm" style="flex:1" data-a="mprev" ${M.i?'':'disabled'}>Back</button><button class="btn sm" style="flex:2" data-a="mpause">${M.paused?'Resume':'Pause'}</button><button class="btn out sm" style="flex:1" data-a="mskip">Skip</button></div></div>
   <div class="card"><div class="sec" style="padding:0">How</div><ol class="how" style="margin-top:6px">${((ex.how&&ex.how.length)?ex.how.slice(0,4):['Move slowly and breathe.','Stop at a comfortable stretch, never pain.']).map(h=>`<li>${esc(h)}</li>`).join('')}</ol></div>
   <div class="sub" style="text-align:center">${nx?'Next: '+esc(EXB[nx.id].n):'Last move'}</div></div></div></div>`;
}
function mornWeekCard(F){
  const KIND=!!F.kind;
  const m0=mondayOf(NOW()),days=Array.from({length:7},(_,i)=>{const t=m0+i*DAY;return (S.morn||[]).some(x=>x.t>=t&&x.t<t+DAY)});
  const wk=(S.morn||[]).filter(x=>x.t>=m0&&x.t<m0+7*DAY),mins=wk.reduce((a,x)=>a+(x.min||0),0);
  const lm=(S.morn||[]).filter(x=>x.t>=m0-7*DAY&&x.t<m0).reduce((a,x)=>a+(x.min||0),0);
  const moves=(F.ids||[]).map(id=>EXB[id]).filter(Boolean);
  const regs=[...new Set(moves.map(e=>e.reg).filter(Boolean))].slice(0,6);
  return `${KIND?'':`<div class="card" style="text-align:left"><div class="sec" style="padding:0 0 6px">This week</div><div class="row" style="justify-content:space-between">${days.map((d,i)=>`<div style="text-align:center;font-size:10px;color:var(--mut)">${DOW[i][0]}<span class="dot ${d?'done':''}" style="margin-top:3px;${d?'':'background:#E3E8EE'}">${d?ico('check',14,'#27410A',3):''}</span></div>`).join('')}</div>
  <div class="sub" style="margin-top:8px">${wk.length} of 7 mornings, ${mins} min${lm?` (last week ${lm} min)`:''}.</div></div>`}
  ${moves.length?`<div class="card" style="text-align:left"><div class="sec" style="padding:0 0 4px">${esc(F.title||'Moves done')}</div>${moves.map(e=>`<div class="row" style="font-size:13px;padding:4px 0;border-top:1px solid var(--line)"><span class="sp1">${esc(e.n)}</span><span class="sub">${esc(e.reg||'')}</span></div>`).join('')}${regs.length?`<div class="chips" style="margin-top:8px">${regs.map(r=>`<span class="chip sm l">${esc(r)}</span>`).join('')}</div>`:''}</div>`:''}`;
}
function mfinishView(){
  const F=UI.fin||{min:0,n:0,st:1};
  return `<div class="stack" style="padding-top:40px;text-align:center"><div style="font-family:'Barlow Condensed';font-weight:700;font-size:56px;line-height:.95">${F.kind==='pre'?'WARM-UP<br>DONE':F.kind==='post'?'COOL-DOWN<br>DONE':'MORNING<br>DONE'}</div><div class="sub" style="font-size:15px">${F.kind==='pre'?'Warm and loose. Go lift something.':F.kind==='post'?'Muscles thank you. Recovery starts now.':esc(MPUN[(F.n+F.min)%MPUN.length])}</div>
  <div class="g2"><div class="card"><div class="sub">Time</div><div class="big2">${F.min} min</div></div><div class="card"><div class="sub">${F.kind?'Moves':'Day streak'}</div><div class="big2">${F.kind?F.n:F.st}</div></div></div>
  ${mornWeekCard(F)}
  <button class="btn" data-a="mdone">Back to home</button></div>${S.set.celebrate?confetti():''}`;
}
const MACT={
 msheet(){UI.sheet='morning';render()},
 mpick(v){S.mornPick={d:dkey(NOW()),id:v};save();render()},
 mlen(v){S.set.mornMin=+v;save();render()},
 mstart(){startMorning()},
 wstart(v){if(v==='post'&&UI.fin&&UI.fin.log)UI._wsparts=UI.fin.log.parts;if(v==='pre')UI._wspre=UI.prev&&UI.prev.w?UI.prev.w.parts:null;UI.sheet=null;startMorning(v)},
 wskip(){UI._wsparts=null;UI.sheet=null;UI.fin=null;UI.screen=null;UI.tab='home';render()},
 mpause(){const M=UI.mor;if(!M)return;if(M.paused){M.end=NOW()+M.left;M.paused=false}else{M.paused=true}render()},
 mskip(){mNext()},
 mprev(){const M=UI.mor;if(M&&M.i>0){mSetItem(M.i-1);render()}},
 mquit(){const M=UI.mor;if(!M)return;if(M.quit){clearInterval(_mt);releaseLock();UI.mor=null;UI.screen=null;render()}else{M.quit=true;render();setTimeout(()=>{if(UI.mor){UI.mor.quit=false;if(UI.screen==='morning')render()}},3000)}},
 mdone(){UI.screen=null;UI.fin=null;UI.tab='home';render()}
};
