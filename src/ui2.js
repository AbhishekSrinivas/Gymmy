/* ===== UI part 2: library, focus, sessions, programs, detail, preview ===== */
const EQ_LABEL={bw:'Bodyweight',db:'Dumbbell',bb:'Barbell',cable:'Cable',mach:'Machine',smith:'Smith',band:'Band',other:'Other',kb:'Kettlebell'};
const PT_LABEL={push:'Push',pull:'Pull',squat:'Squat',hinge:'Hinge',lunge:'Lunge',core:'Core',carry:'Carry',loco:'Cardio',locomotion:'Cardio',mob:'Mobility'};
function libQ(){return ((UI.lib&&UI.lib.sq)||'').trim().toLowerCase()}
/* original program names, kept so old names still find the workout */
const SES_ALIAS={'s-upchest':['Killer upper chest','upper chest'],'s-chest':['Meanest chest'],'s-back':['Back annihilation'],'s-abs':['Six-pack abs supersets','six pack abs'],'s-abs2':['Earn-those-abs','earn those abs'],'s-arms':['3 arm supersets','three arm supersets','arm pump'],'s-arms2':['30-day arms','arm pump'],'s-armfin':['arm pump','arm finisher'],'s-shburn':['Total shoulder builder','shoulder pump'],'s-nip-push':['push pump'],'s-isr-cable':['chest pump']};
const aliasOf=s=>(SES_ALIAS[s.id]||[]);
function qm(...t){const q=libQ();if(!q)return true;const h=t.join(' ').toLowerCase();return q.split(/\s+/).every(w=>h.includes(w))}
const LIB_PH={ses:'Search specialty workouts',prog:'Search programs',foc:'Search muscles and exercises',fav:'Search favorites'};
function libBody(){const L=UI.lib;return L.tab==='fav'?libFav():L.tab==='ex'?libEx():L.tab==='ses'?libSes():L.tab==='prog'?libProg():libFocus()}
function libView(){
  const L=UI.lib;
  return `${header('Workouts','Exercises, specialty, programs','')}
  <div class="stack"><div class="tabs">${[['ses','Specialty'],['prog','Programs'],['foc','Focus'],['ex','Exercises'],['fav','Favorites']].map(([k,l])=>`<button class="${L.tab===k?'on':''}" data-a="libtab" data-v="${k}">${l}</button>`).join('')}</div>
  ${L.tab==='ex'?libEx():`<input class="search" id="sq" type="search" placeholder="${LIB_PH[L.tab]}" value="${esc(L.sq||'')}" data-in="sq"><div class="stack" id="libbody">${libBody()}</div>`}</div>`;
}
function exList(list,act='exdetail'){return list.map(e=>`<button class="exrow" data-a="${act}" data-v="${e.id}">${thumb(e)}<div class="sp1"><div class="n">${esc(e.n)}</div><div class="d" style="color:var(--grn);font-weight:700">${esc(e.reg)}</div><div class="d">${e.p.map(m=>MUSCLE_LABEL[m]).join(', ')}${e.s.length?' + '+e.s.slice(0,2).map(m=>MUSCLE_LABEL[m].toLowerCase()).join(', '):''}, ${EQ_LABEL[e.eq]}${e.r.length&&!canDo(e)?' <b style="color:var(--amber)">needs equipment</b>':''}</div></div>${favBtn('ex:'+e.id)}${ico('chev',16,'#9AA9B4')}</button>`).join('')}
function filterEx(){
  const L=UI.lib,q=L.q.trim().toLowerCase();
  return EX.filter(e=>(!q||e.n.toLowerCase().includes(q))&&(!L.eq||e.eq===L.eq)&&(!L.mu||e.p.includes(L.mu)||e.s.includes(L.mu))&&(!L.pt||e.pt===L.pt)&&(!L.have||canDo(e)));
}
function libEx(){
  const L=UI.lib,list=filterEx();
  const muscles=Object.keys(MUSCLE_LABEL);
  const act=[];
  if(L.mu)act.push(['libmu',L.mu,MUSCLE_LABEL[L.mu]]);
  if(L.eq)act.push(['libeq',L.eq,EQ_LABEL[L.eq]]);
  if(L.pt)act.push(['libpt',L.pt,PT_LABEL[L.pt]]);
  if(L.have)act.push(['libhave','','My equipment']);
  const pins=`<div class="chips fpin">${act.map(([a,v,l])=>`<button class="chip on" data-a="${a}" data-v="${esc(v)}" aria-label="Remove filter ${esc(l)}">${esc(l)} ${ico('close',12,'currentColor',3)}</button>`).join('')}${L.fopen?'':'<button class="chip" data-a="libfopen">+ Filter</button>'}${act.length>1?'<button class="chip sm" data-a="libfclear">Clear all</button>':''}</div>`;
  const panel=L.fopen?`<div class="fpanel"><div class="sec" style="padding:0">MUSCLE</div><div class="chips">${muscles.map(k=>chip(MUSCLE_LABEL[k],L.mu===k,'libmu',k)).join('')}</div><div class="sec" style="padding:0">EQUIPMENT</div><div class="chips">${chip('Mine only',!!L.have,'libhave','')}${Object.keys(EQ_LABEL).map(k=>chip(EQ_LABEL[k],L.eq===k,'libeq',k)).join('')}</div><div class="sec" style="padding:0">MOVEMENT</div><div class="chips">${['push','pull','squat','hinge','lunge','core'].map(k=>chip(PT_LABEL[k],L.pt===k,'libpt',k)).join('')}</div><button class="btn" data-a="libfopen">Show ${list.length} exercise${list.length===1?'':'s'}</button></div>`:'';
  return `<input class="search" id="q" type="search" placeholder="Search ${EX.length} exercises" value="${esc(L.q)}" data-in="q">
  ${pins}${panel}
  ${L.fopen?'':`<div class="sub">${list.length} exercise${list.length===1?'':'s'}</div><div class="stack" id="exlist">${exList(list.slice(0,L.n||20))}${list.length>(L.n||20)?`<button class="btn out sm" data-a="libmore">Show 20 more (${list.length-(L.n||20)} left)</button>`:''}</div>`}`;
}
function favItems(){
  const f=S.favs||[];const ex=f.filter(k=>k.indexOf('ex:')===0).map(k=>EXB[k.slice(3)]).filter(Boolean);
  const all=[...S.customSessions.map(c=>Object.assign({},c,{by:'You'})),...SESSIONS];
  const ses=f.filter(k=>k.indexOf('ses:')===0).map(k=>all.find(s=>s.id===k.slice(4))).filter(Boolean);
  const pr=f.filter(k=>k.indexOf('prog:')===0).map(k=>PROGRAMS.find(p=>p.id===k.slice(5))).filter(Boolean);
  return {ex,ses,pr};
}
function libFav(){
  const F0=favItems(),sq=libQ();const F=sq?{ex:F0.ex.filter(e=>qm(e.n,e.reg||'')),ses:F0.ses.filter(s=>qm(s.t,aliasOf(s).join(' '))),pr:F0.pr.filter(p=>qm(p.t,p.sub||''))}:F0;
  if(sq&&!F.ex.length&&!F.ses.length&&!F.pr.length)return '<div class="sub" style="text-align:center">No favorites match.</div>';
  if(!F.ex.length&&!F.ses.length&&!F.pr.length)return `<div class="card stack" style="text-align:center;align-items:center;gap:10px;padding:28px 18px"><span class="fav on" style="width:56px;height:56px">${ico('lib',30)}</span><div style="font-weight:800;font-size:18px">No favorites yet</div><div class="sub">Tap the dumbbell on any exercise, session or program to save it here.</div><button class="btn out sm" style="width:auto;padding:0 20px" data-a="libtab" data-v="ex">Browse exercises</button></div>`;
  const sec=(t,n)=>`<div class="sec" style="padding:4px 2px 0">${t} (${n})</div>`;
  return `${F.ex.length?sec('Exercises',F.ex.length)+`${sq?'':'<div class="sub">Press and hold to reorder.</div>'}<div class="stack" id="exlist" ${sq?'':'data-drag="fav"'}>${(()=>{let n=0;return sq?exList(F.ex):exList(F.ex).replace(/class="exrow"/g,()=>`class="exrow dri" data-di="${n++}"`)})()}</div>`:''}
  ${F.ses.length?sec('Specialty',F.ses.length)+F.ses.map(sessionCard).join(''):''}
  ${F.pr.length?sec('Programs',F.pr.length)+progCards(F.pr):''}`;
}
function sessionCard(s,i){
  const w=sessionToWorkout(s);
  return `<div class="card stack" style="gap:8px"><div class="row"><div class="sp1"><div style="font-weight:700;font-size:16px">${esc(s.t)}</div><div class="sub">${s.by&&s.by!=='Home'&&s.by!=='Gymmy'?'From '+esc(s.by)+'. ':''}${esc(s.freq||'')}</div>${(()=>{const a=aliasOf(s).filter(x=>x.toLowerCase()!==s.t.toLowerCase()&&/[A-Z0-9]/.test(x[0])).slice(0,1);return a.length?`<div class="sub">Also called: ${esc(a[0])}</div>`:''})()}</div>${favBtn('ses:'+s.id)}</div>
  <div class="chips">${partChips(s.parts)}</div><div class="sub" style="color:var(--tx)"><b>Targets:</b> ${esc([...new Set(wTargets(w).flatMap(x=>x[1]))].slice(0,6).join(', '))}</div><div class="chips"><span class="chip sm">${w.blocks.length} blocks</span><span class="chip sm">about ${estMin(w)} min</span>${s.home?'<span class="chip sm">Home friendly</span>':''}</div>
  <div class="row"><button class="btn out sm" style="flex:1" data-a="ses-prev" data-v="${s.id}">Preview</button><button class="btn sm" style="flex:1" data-a="ses-use" data-v="${s.id}">Use today</button></div></div>`}
function libSes(){
  const all=[...S.customSessions.map(c=>Object.assign({},c,{by:'You'})),...SESSIONS];
  const f=UI.lib.part;
  const parts=['chest','back','shoulders','biceps','triceps','abs','legs','mobility'];
  const list=all.filter(s=>(!f||s.parts.includes(f))&&qm(s.t,s.by||'',aliasOf(s).join(' '),s.parts.map(p=>PART_LABEL[p]).join(' ')));
  return `<div class="scrollx">${chip('All',!f,'libpart','')}${parts.map(p=>chip(PART_LABEL[p],f===p,'libpart',p)).join('')}</div>
  <div class="row"><button class="btn out sm" style="flex:1" data-a="sheet" data-v="cardio">${ico('run',18)} Log cardio</button><button class="btn out sm" style="flex:1" data-a="build">${ico('plus',18)} Build my own</button></div>
  ${list.length?list.map(sessionCard).join(''):'<div class="sub" style="text-align:center">No specialty workouts match.</div>'}`;
}
function libProg(){const pl=PROGRAMS.filter(P=>qm(P.t,P.sub||''));return (pl.length?progCards(pl):'<div class="sub" style="text-align:center">No programs match.</div>')+`<div class="sub" style="padding:0 4px">Programs and specialty workouts mix freely. Use any one as today's workout, then go back to your program the next day.</div>`}
function progCards(list){
  const cur=S.program;
  return list.map(P=>{
    const on=cur&&cur.id===P.id;const pos=on?cur.pos%P.total:0;const d=P.get(pos);
    return `<div class="card stack" style="gap:8px"><div class="row"><div class="sp1"><div style="font-weight:700;font-size:16px">${esc(P.t)}</div><div class="sub">${esc(P.sub)}</div></div>${on?'<span class="st now">Active</span>':''}${favBtn('prog:'+P.id)}</div>
    <div class="chips"><span class="chip sm">${P.days} workouts a week</span><span class="chip sm">${P.total} workouts</span><span class="chip sm">${P.goal==='bulk'?'Size up':'Shred'}</span></div>
    ${on?`<div class="note g">Up next: ${esc(d.label||'')}. ${esc(d.title)}</div><div class="bar"><i style="width:${Math.round(pos/P.total*100)}%"></i></div>`:''}
    <div class="row">${on?`<button class="btn out sm" style="flex:1" data-a="prog-prev" data-v="${P.id}">Preview next</button><button class="btn out sm" style="flex:1" data-a="prog-jump" data-v="${P.id}">Jump to</button><button class="btn out sm" style="flex:1" data-a="prog-off">Detach</button>`:`<button class="btn sm" style="flex:1" data-a="prog-start" data-v="${P.id}">Start this program</button>`}</div></div>`}).join('');
}
/* ===== Focus mode ===== */
function focusResults(){
  const sel=UI.focus.sel;if(!sel.length)return [];
  const strict=UI.focus.strict;
  let list=EX.filter(e=>canDo(e)&&sel.includes(e.p[0])||canDo(e)&&e.p.some(m=>sel.includes(m)));
  if(strict)list=list.filter(e=>e.p.every(m=>sel.includes(m)));
  list.sort((a,b)=>(sel.includes(b.p[0])-sel.includes(a.p[0]))||((a.m==='iso')===(b.m==='iso')?0:a.m==='iso'?-1:1)||(a.p.length-b.p.length));
  return list;
}
function libFocus(){
  const F=UI.focus,sel=new Set(F.sel);
  const c=colorsBy(ms=>ms.some(m=>sel.has(m))?'#86AE2B':NEUT);
  const res=focusResults();
  return `<div class="card"><div class="row" style="margin-bottom:6px"><div class="sp1" style="font-weight:700">Tap muscles to focus</div><button class="chip sm" data-a="focback">${F.back?'Show front':'Show back'}</button></div>
  <div id="fmap" style="max-width:240px;margin:0 auto" data-a="fmap">${figSvg(c,F.back)}</div></div>
  <div class="scrollx">${Object.keys(MUSCLE_LABEL).filter(k=>qm(MUSCLE_LABEL[k])||sel.has(k)).map(k=>chip(MUSCLE_LABEL[k],sel.has(k),'foctog',k)).join('')}</div>
  ${libQ()?(()=>{const m=EX.filter(e=>qm(e.n)).slice(0,12);return m.length?`<div class="sec" style="padding:4px 2px 0">Exercises matching</div><div class="stack">${exList(m)}</div>`:''})():''}
  <div class="lrow"><div class="sp1"><b>Strict</b><small>${F.strict?'Only moves that train just your picks':'Also show moves that hit other muscles too'}</small></div>${toggle(F.strict,'focstrict')}</div>
  ${F.sel.length?`<button class="btn" data-a="focbuild">Build ${F.sel.map(m=>MUSCLE_LABEL[m].toLowerCase()).slice(0,3).join(', ')} workout</button><div class="sub">${res.length} matching exercise${res.length===1?'':'s'}, isolation first</div><div class="stack">${exList(res.slice(0,40))}</div>`:`<div class="sub" style="text-align:center;padding:10px">Pick one or several muscles to see only the exercises that train them.</div>`}`;
}
function buildFocus(){
  const sel=UI.focus.sel,res=focusResults();const blocks=[];const per=sel.length===1?5:sel.length===2?3:2;
  const goalC=S.goal==='shred'?{c:['10-15',3,45],i:['12-15',3,40]}:{c:['6-10',4,120],i:['10-12',3,75]};
  sel.forEach(m=>{
    const mine=res.filter(e=>e.p[0]===m);
    const iso=mine.filter(e=>e.m==='iso'),comp=mine.filter(e=>e.m!=='iso');
    const pickList=[...(sel.length===1?[...comp.slice(0,2),...iso]:[...comp.slice(0,1),...iso]),...comp.slice(2)];
    const seen=new Set();let n=0;
    pickList.forEach(e=>{if(n>=per||seen.has(e.id)||blocks.some(b=>b.ex[0]===e.id))return;seen.add(e.id);const c=e.m==='iso'?goalC.i:goalC.c;blocks.push(mkBlock([e.id],c[1],c[0],{rest:c[2]}));n++});
  });
  return {id:'focus-'+Date.now(),title:'Focus: '+sel.map(m=>MUSCLE_LABEL[m]).join(', '),parts:[...new Set(sel.map(m=>MUSCLE_PART[m]))],blocks,notes:UI.focus.strict?['Strict focus: every move trains only your picked muscles.']:[],kind:'focus'};
}
/* ===== Exercise detail sheet ===== */
function exDetail(id){
  const e=EXB[id];if(!e)return '';
  const last=lastPerf(id);
  const pr=S.prs[id];
  const alts=EX.filter(x=>x.id!==id&&x.p[0]===e.p[0]&&canDo(x)).slice(0,4);
  return `<div class="grab"></div><div class="stack">
  <div class="row"><div class="sp1"><div class="big2">${esc(e.n)}</div></div>${favBtn('ex:'+e.id)}<button class="ibtn" data-a="sheetclose" aria-label="Close">${ico('close')}</button></div>
  ${visual(e)}
  <div class="chips">${e.p.map(m=>`<span class="chip sm l">${MUSCLE_LABEL[m]}</span>`).join('')}${e.s.map(m=>`<span class="chip sm">${MUSCLE_LABEL[m]}</span>`).join('')}<span class="chip sm">${EQ_LABEL[e.eq]}</span><span class="chip sm">${e.m==='comp'?'Compound':'Isolation'}</span><span class="chip sm">${PT_LABEL[e.pt]||e.pt}</span></div>
  <div class="card row" style="gap:12px"><div>${exFig(e,110)}</div><div class="sp1"><div class="sec" style="padding:0">Targets</div><div style="font-weight:700;font-size:16px">${esc(e.reg)}</div><div class="sub">Main: ${e.p.map(m=>MUSCLE_LABEL[m]).join(', ')}.${e.s.length?' Helpers: '+e.s.map(m=>MUSCLE_LABEL[m].toLowerCase()).join(', ')+'.':''}</div></div></div>
  ${UI.picker?'':`<div class="card stack" style="gap:8px"><div class="sec" style="padding:0">Ready?</div><div class="row"><button class="btn sm sp1" data-a="startex" data-v="${e.id}">${ico('play',18)} Start now</button><button class="btn out sm sp1" data-a="planadd" data-v="ex:${e.id}">${ico('week',16)} Add to plan</button></div></div>`}
  ${e.g&&e.g.length?`<div><div class="sec">Grip and stance</div><div class="chips" style="margin-top:6px">${e.g.map(g=>`<span class="chip">${esc(g)}</span>`).join('')}</div></div>`:''}
  ${e.mv?'':gripCard(e)}
  ${last||pr?`<div class="card"><div class="sub">Your best</div><div style="font-weight:700">${pr?'Est. 1 rep max '+fmtW(pr):''}${last?` <span class="sub" style="font-weight:400">Last: ${fmtW(last.w)} x ${last.r}</span>`:''}</div></div>`:''}
  ${e.how&&e.how.length?`<div><div class="sec">How to</div><ol class="how" style="margin-top:6px">${e.how.slice(0,6).map(h=>`<li>${esc(h)}</li>`).join('')}</ol></div>`:''}
  ${e.r.length&&!canDo(e)?`<div class="note">Needs ${e.r.map(r=>(EQUIP.find(q=>q[0]===r)||[r,r])[1].toLowerCase()).join(', ')}, which is not in your current equipment profile.</div>`:''}
  ${alts.length?`<div><div class="sec">Similar moves</div><div class="stack" style="margin-top:6px">${exList(alts)}</div></div>`:''}
  ${UI.picker?'':`<button class="btn" data-a="addex" data-v="${e.id}">Add to today's workout</button>`}
  </div>`;
}
/* ===== Preview / editor ===== */
function blockCard(b,i,w,editable){
  const exs=b.ex.map(id=>EXB[id]).filter(Boolean);
  const e0=exs[0];
  return `<div class="card stack${editable?' dri':''}" ${editable?`data-di="${i}" `:''}style="gap:8px"><div class="row" style="align-items:flex-start">${exs.length===1?`<div style="width:84px;flex-shrink:0">${thumb(e0).replace('class="th"','class="th" style="width:84px;height:58px;border-radius:10px;overflow:hidden;background:var(--line)"')}</div>`:`<span class="st now" style="flex-shrink:0">${exs.length===2?'Superset':'Giant set'}</span>`}<div class="sp1">${exs.map(e=>`<button data-a="exdetail" data-v="${e.id}" style="text-align:left;display:block;font-weight:700;font-size:14px;line-height:1.25">${esc(e.n)}</button>`).join('')}<div class="sub">${b.sets} x ${esc(b.reps)}${b.hold?' hold':''}, rest ${b.rest}s${b.tech&&b.tech!==true?', '+esc(b.tech):''}</div></div>
  ${editable?`<div style="display:flex;flex-direction:column;gap:2px"><button class="ibtn" style="width:34px;height:30px;border-radius:9px;background:var(--bg)" data-a="blk-up" data-v="${i}" aria-label="Move up">${ico('up',16)}</button><button class="ibtn" style="width:34px;height:30px;border-radius:9px;background:var(--bg)" data-a="blk-down" data-v="${i}" aria-label="Move down">${ico('down',16)}</button></div>`:''}</div>
  ${b.note?`<div class="sub">${esc(b.note)}</div>`:''}
  ${editable?`<div class="row"><button class="btn out sm" style="flex:1" data-a="blk-swap" data-v="${i}">${ico('swap',16)} Swap</button><button class="btn out sm" style="flex:1" data-a="blk-sets" data-v="${i}">Sets: ${b.sets}</button><button class="btn out sm" style="flex:0 0 52px" data-a="blk-del" data-v="${i}" aria-label="Remove">${ico('trash',16)}</button></div>`:''}</div>`;
}
function previewView(){
  const w=UI.prev.w;if(!w)return '';
  const ms=muscleState();const ed=!!UI.prev.editing;
  const rec=w.parts.filter(p=>partState(ms,p)>0);
  const tg=wTargets(w);
  return `<div class="top"><button class="ibtn" data-a="back" aria-label="Back">${ico('back')}</button><div class="sp1"><div class="h1">${esc(w.title)}</div><div class="sub">${w.blocks.length} exercises, about ${estMin(w)} min${w.by?`, from ${esc(w.by)}`:''}</div></div>${(()=>{const h=effMode()==='home';return `<button class="mtog${h?' home':''}" data-a="pmode" data-v="${h?'gym':'home'}" aria-label="${h?'Home mode, tap for gym':'Gym mode, tap for home'}"><i></i><span>${ico('building',17)}</span><span>${ico('home',17)}</span></button>`})()}</div>
  <div class="stack">
  <div class="card"><div class="sec" style="padding:0 0 6px">What this trains</div><div class="trfig"><div class="wfs" aria-hidden="true">${wFig(w,132,'#86AE2B','#E3E8EE')}</div><div class="sp1">${tg.length?tg.map(([t,r])=>`<div style="padding:4px 0"><b>${esc(t)}</b><div class="chips" style="margin-top:4px">${r.map(x=>`<span class="chip sm l">${esc(x)}</span>`).join('')}</div></div>`).join(''):'<div class="sub">Add an exercise to begin.</div>'}</div></div></div>
  <div class="card stack" style="gap:8px"><div class="sec" style="padding:0">Ready?</div><div class="row"><button class="btn sm sp1" data-a="startplay" ${w.blocks.length?'':'disabled'}>${ico('play',18)} Start now</button><button class="btn out sm sp1" data-a="planadd" ${w.blocks.length?'':'disabled'}>${ico('week',16)} Add to plan</button></div><button class="btn ghost" style="height:36px" data-a="wstart" data-v="pre">${ico('warrior',16)} Warm up first, 5 min</button></div>
  ${w.techNote?`<div class="note g">${esc(w.techNote)}</div>`:''}
  ${(w.notes||[]).length?`<div class="note">${esc(w.notes.slice(0,2).map(x=>x.replace(/^\[mode\]/,'')).join(' '))}${w.notes.length>2?` And ${w.notes.length-2} more guard changes.`:''}</div>`:''}
  ${rec.length&&S.set.guard?`<div class="note">${rec.map(p=>PART_LABEL[p]).join(', ')} still recovering. You can still train, but go lighter.</div>`:''}
  <div class="card"><div class="row" style="margin-bottom:6px"><div class="sec sp1" style="padding:0">In order</div><button class="chip sm" data-a="toggle-edit">${ed?'Done editing':'Edit workout'}</button></div>
  ${ed?'':w.blocks.map((b,i)=>`<div class="row" style="padding:6px 0;border-top:${i?'1px solid var(--line)':'0'};align-items:flex-start"><span class="st" style="margin-top:2px">${i+1}</span><div class="sp1">${b.ex.map(id=>{const e=EXB[id];return e?`<div style="font-weight:700;line-height:1.25">${esc(e.n)}</div><div class="sub" style="color:var(--grn)">${esc(e.reg)}</div>`:''}).join('')}${b.ex.length>1?`<div class="sub">${b.ex.length===2?'Superset':'Giant set'}</div>`:''}</div></div>`).join('')}</div>
  ${ed?`<div class="sub" style="margin:-2px 0 4px">Press and hold an exercise, then drag to reorder.</div><div class="stack" data-drag="blk" style="gap:var(--gap,12px)">${w.blocks.map((b,i)=>blockCard(b,i,w,true)).join('')}</div>
  <div class="row"><button class="btn out sm" style="flex:1" data-a="picker-open">${ico('plus',16)} Add exercise</button><button class="btn out sm" style="flex:1" data-a="picker-ses">${ico('plus',16)} Add session blocks</button></div>
  <button class="btn out sm" data-a="savesession">${ico('save',16)} Save as my session</button>`:''}
  </div>`;
}
function openPreview(w,from){adaptW(w);UI.prev={w,from:UI.screen==='preview'?UI.prev.from:UI.screen};UI.screen='preview';render()}
function pickerView(){
  const P=UI.picker;if(!P)return '';
  if(P.mode==='ses'){return `<div class="grab"></div><div class="stack"><div class="row"><div class="h1 sp1">Add session blocks</div><button class="ibtn" data-a="pickclose">${ico('close')}</button></div>${SESSIONS.map(s=>`<button class="lrow" data-a="pick-ses" data-v="${s.id}"><div class="sp1"><b>${esc(s.t)}</b><small>${s.parts.map(p=>PART_LABEL[p]).join(', ')}, ${s.blocks.length} blocks${s.by&&!['Home','Gymmy'].includes(s.by)?', '+esc(s.by):''}</small></div>${ico('plus',18)}</button>`).join('')}</div>`}
  const q=(P.q||'').toLowerCase();
  const list=EX.filter(e=>(!q||e.n.toLowerCase().includes(q))&&(!P.mu||e.p.includes(P.mu))&&(!P.alt||(P.alt&&e.p[0]===P.alt.p[0]&&e.id!==P.alt.id))).filter(e=>canDo(e)||P.all).slice(0,40);
  return `<div class="grab"></div><div class="stack"><div class="row"><div class="h1 sp1">${P.mode==='swap'?'Swap exercise':'Add exercise'}</div><button class="ibtn" data-a="pickclose">${ico('close')}</button></div>
  <input class="search" id="pq" type="search" placeholder="Search" value="${esc(P.q||'')}" data-in="pq">
  ${P.mode==='swap'?'':`<div class="scrollx">${Object.keys(MUSCLE_LABEL).map(k=>chip(MUSCLE_LABEL[k],P.mu===k,'pickmu',k)).join('')}</div>`}
  <div class="sub">Showing moves that fit your ${effMode()==='home'?'home':S.profile} equipment.</div>
  <div class="stack" id="pklist">${list.map(e=>`<button class="exrow" data-a="pick" data-v="${e.id}">${thumb(e)}<div class="sp1"><div class="n">${esc(e.n)}</div><div class="d">${e.p.map(m=>MUSCLE_LABEL[m]).join(', ')}, ${EQ_LABEL[e.eq]}</div></div>${ico(P.mode==='swap'?'swap':'plus',18)}</button>`).join('')}</div></div>`;
}
