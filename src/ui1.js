/* ===== UI part 1: icons, figure, components, home, week, summary ===== */
const UI={tab:'home',screen:null,sheet:null,drawer:false,lib:{tab:'ses',q:'',eq:'',mu:'',pt:'',goalf:''},focus:{sel:[],strict:true,back:false},wkoff:0,sumoff:0,play:null,toast:null,ob:{step:0},prev:null,picker:null,detail:null,fin:null};
const IC={
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',chevu:'<path d="M6 15l6-6 6 6"/>',pencil:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',check:'<path d="M5 12l5 5 9-10"/>',chev:'<path d="M9 6l6 6-6 6"/>',back:'<path d="M15 5l-7 7 7 7"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
 home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',lib:'<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',warrior:'<circle cx="12" cy="4.500" r="2"/><path d="M12 7v6M3 9.500h18M12 13l-5.500 3v5M12 13l5 8"/>',curl:'<circle cx="12" cy="3.500" r="2"/><path d="M3 9h18M5 7v4M19 7v4M12 6v9M12 15l-2.500 6M12 15l2.500 6M8.500 9l-1 5.500M15.500 9l1 5.500"/>',week:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
 glass:'<path d="M6 4h12l-1.5 16a1.5 1.5 0 0 1-1.5 1.4H9A1.5 1.5 0 0 1 7.500 20z"/><path d="M6.700 11c2-1.200 3.500 1.200 5.300 0s3.300-1.200 5.300 0"/>',
 swap:'<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',up:'<path d="M6 15l6-6 6 6"/>',down:'<path d="M6 9l6 6 6-6"/>',play:'<path d="M7 4l13 8-13 8z"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M10 18h4"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',run:'<circle cx="14" cy="4" r="2"/><path d="M6 21l4-6 3 2 2-7-4-2-3 4M13 12l4 2 3-1"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',save:'<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>'};
const ico=(n,s=22,c='currentColor',w=2)=>`<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;
const EQIC={
 barbell:'<path d="M4 24h40M9 14v20M14 10v28M34 10v28M39 14v20"/>',dumbbell:'<path d="M15 24h18M9 17v14M15 13v22M33 13v22M39 17v14M5 21v6M43 21v6"/>',
 bench:'<rect x="6" y="18" width="30" height="8" rx="3"/><path d="M36 22l8-8M12 26v10M30 26v10M8 36h8M26 36h8"/>',rack:'<path d="M12 6v38M36 6v38M8 44h8M32 44h8M12 16h6M36 16h-6M4 24h40"/>',
 smith:'<path d="M12 4v40M36 4v40M7 44h10M31 44h10M6 22h36"/><circle cx="6" cy="22" r="3"/><circle cx="42" cy="22" r="3"/>',cable:'<rect x="6" y="4" width="14" height="40" rx="2"/><path d="M10 12h6M10 20h6M20 10h14l6 14v8"/><circle cx="40" cy="37" r="4"/>',
 pulldown:'<path d="M24 4v10M8 14h32M8 14v6M40 14v6M24 14v8"/><circle cx="24" cy="29" r="4"/><path d="M15 44l5-9h8l5 9"/>',legpress:'<path d="M6 40h36M10 40l12-14M22 26l15-9"/><rect x="34" y="8" width="8" height="16" rx="2" transform="rotate(30 38 16)"/>',
 machine:'<rect x="6" y="6" width="12" height="36" rx="2"/><path d="M10 14h4M10 22h4M10 30h4M18 18h18v7H18M36 25v13M30 38h12"/>',pullup:'<path d="M5 9h38M9 9V4M39 9V4M16 18l8 5 8-5M24 23v10M17 44l7-11 7 11"/>',
 dip:'<path d="M5 22h14M29 22h14M10 22v22M38 22v22"/><circle cx="24" cy="9" r="4"/><path d="M24 15v16M17 44l7-13 7 13"/>',bands:'<path d="M8 30c0-14 12-22 20-18s6 16-4 22-16 2-16-4z"/><path d="M17 28c4-6 11-6 15-1"/>',
 kettlebell:'<path d="M16 19a8 8 0 0116 0"/><path d="M11 41c-4-9 1-20 13-20s17 11 13 20z"/>',medball:'<circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c-9 9-9 25 0 34M24 7c9 9 9 25 0 34"/>',
 boardcord:'<rect x="4" y="34" width="40" height="8" rx="3"/><path d="M14 34c-4-8 0-16 6-18M34 34c4-8 0-16-6-18"/><rect x="15" y="10" width="6" height="8" rx="2"/><rect x="27" y="10" width="6" height="8" rx="2"/>',abroller:'<circle cx="15" cy="32" r="9"/><circle cx="33" cy="32" r="9"/><path d="M15 32h18"/><path d="M10 14h28v6H10z"/>',rope:'<path d="M12 4v24c0 14 24 14 24 0V4M8 4h8M32 4h8"/>',pushboard:'<rect x="5" y="13" width="38" height="22" rx="5"/><circle cx="13" cy="24" r="2.500"/><circle cx="24" cy="24" r="2.500"/><circle cx="35" cy="24" r="2.500"/>',
 ankle:'<rect x="10" y="24" width="28" height="12" rx="4"/><path d="M17 24V8h14v16M17 30h14"/>',cardio:'<path d="M5 38h30l7-10M14 38l5-15M19 23h-6M31 6l4 9M8 43h34"/>'};
const eqIcon=(k,s=44)=>`<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" stroke="#12202B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${EQIC[k]||''}</svg>`;
/* body figure */
const RGN={front:{
 ch:[['ch_up',[0,0,300,88.6]],['ch_mid',[0,89.4,300,103.6]],['ch_low',[0,104.4,300,450]]],
 sh:[['fd',[60.4,0,300,450]],['sd',[0,0,59.6,450]]],
 bi:[['bi_long',[0,0,55,450]],['bi_short',[55.8,0,300,450]]],
 ab:[['ob',[0,0,79,450]],['ab_up',[79.8,0,300,155.6]],['ab_low',[79.8,156.4,300,450]]],
 qu:[['qu_out',[0,0,79.6,450]],['qu_mid',[80.4,0,90.6,450]],['qu_in',[91.4,0,300,450]]]},
 back:{
 tr:[['tr_up',[0,0,300,75.6]],['tr_mid',[0,76.4,300,450]]],
 la:[['la_up',[0,0,300,121.6]],['la_low',[0,122.4,300,450]]],
 tri:[['tri_lat',[0,0,55,450]],['tri_long',[55.8,0,300,450]]],
 ca:[['ca_gas',[0,0,300,333.6]],['ca_sol',[0,334.4,300,450]]],
 sh:[['rd',null]],gl:[['gl',null]],ha:[['ha',null]]}};
let _fid=0;
function figParts(c,back,uid,defs){
 const f=[['M70 68 C62 90 66 130 72 170 C74 190 78 200 82 206 L100 206 L100 68 Z','n'],['M72 66 C60 66 50 74 48 90 C47 98 50 104 54 108 C62 104 68 94 72 84 Z','sh'],['M98 74 L98 112 C88 120 74 118 66 108 C62 96 66 82 76 74 C84 70 92 70 98 74 Z','ch'],['M54 110 C48 122 46 140 48 154 C54 158 60 156 63 152 C64 138 64 122 62 108 Z','bi'],['M48 156 C44 176 42 196 42 214 C46 218 52 216 55 212 C58 196 61 176 63 154 Z','n'],['E46 224 6 9','n'],['M98 118 L98 192 C90 194 80 190 77 180 C73 160 73 136 77 122 C85 124 92 122 98 118 Z','ab'],['M99 204 C90 202 78 204 73 214 C69 240 72 270 80 296 C88 298 96 296 99 290 Z','qu'],['M80 300 C76 330 76 360 80 392 C86 396 94 396 97 392 C98 360 98 330 96 300 Z','n'],['E88 403 11 5','n']];
 const b=[['M70 68 C62 90 66 130 72 170 C74 190 78 200 82 206 L100 206 L100 68 Z','n'],['M100 56 L100 100 C90 96 78 82 72 68 C82 62 92 58 100 56 Z','tr'],['M72 66 C60 66 50 74 48 90 C47 98 50 104 54 108 C62 104 68 94 72 84 Z','sh'],['M98 102 C92 106 80 92 72 84 C66 102 66 130 74 158 C84 162 94 160 98 156 Z','la'],['M54 110 C48 122 46 140 48 154 C54 158 60 156 63 152 C64 138 64 122 62 108 Z','tri'],['M48 156 C44 176 42 196 42 214 C46 218 52 216 55 212 C58 196 61 176 63 154 Z','n'],['E46 224 6 9','n'],['M99 176 C88 170 76 174 72 186 C70 200 78 214 92 214 C97 214 99 212 99 210 Z','gl'],['M99 216 C90 214 78 216 74 224 C72 250 76 275 82 296 C90 298 96 296 99 290 Z','ha'],['M82 300 C76 316 76 340 82 366 C86 372 92 372 96 366 C100 340 98 316 94 300 Z','ca'],['E88 403 11 5','n']];
 const view=back?'back':'front';
 return (back?b:f).map(([d,k])=>{
  const fillOf=id=>(c[id]!==undefined?c[id]:(c[k]!==undefined?c[k]:c.n));
  if(d[0]==='E'){const t=d.split(' ');const cy=d.includes(' 224')?224:403;return `<ellipse cx="${t[0].slice(1)}" cy="${cy}" rx="${t[2]}" ry="${t[3]}" fill="${c.n}" data-k="n"/>`}
  const regs=(RGN[view]||{})[k];
  if(!regs)return `<path d="${d}" fill="${fillOf(k)}" data-k="${k}"/>`;
  return regs.map(([id,r])=>{
    if(!r)return `<path d="${d}" fill="${fillOf(id)}" data-k="${k}" data-r="${id}"/>`;
    const cid=`cp${uid}_${view}_${id}`;defs.push(`<clipPath id="${cid}"><rect x="${r[0]}" y="${r[1]}" width="${r[2]-r[0]}" height="${r[3]-r[1]}"/></clipPath>`);
    return `<path d="${d}" fill="${fillOf(id)}" clip-path="url(#${cid})" data-k="${k}" data-r="${id}"/>`}).join('');
 }).join('');
}
function figSvg(c,back,cls='fig',ph){
 const uid=++_fid,defs=[];const h=figParts(c,back,uid,defs);
 return `<svg class="${cls}" ${ph?`height="${ph}" width="${Math.round(ph*200/412)}"`:''} viewBox="0 0 200 412" role="img" aria-label="${back?'Back':'Front'} body map" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"><defs>${defs.join('')}</defs><ellipse cx="100" cy="30" rx="16" ry="20" fill="${c.n}"/><path d="M92 46 L92 62 Q100 67 108 62 L108 46 Z" fill="${c.n}"/><g>${h}</g><g transform="translate(200,0) scale(-1,1)">${h}</g></svg>`;
}
const KEY_MUSCLES={ch:['chest'],sh:['frontdelt','sidedelt','reardelt'],bi:['biceps'],ab:['abs','obliques'],qu:['quads'],tr:['traps'],la:['lats','midback'],tri:['triceps'],gl:['glutes'],ha:['hams'],ca:['calves']};
const NEUT='#E3E8EE';
function colorsBy(fn){const c={n:NEUT};Object.keys(KEY_MUSCLES).forEach(k=>c[k]=fn(KEY_MUSCLES[k],k));return c}
const SCALE=['#E3E8EE','#D9EBA7','#B5D95F','#86AE2B'];
const BACKM=new Set(['lats','midback','lowback','traps','triceps','glutes','hams','calves','reardelt']);
function wFig(w,ph,hi,ne){
  const set=new Set((w.parts||[]).flatMap(p=>PART_MUSCLES[p]||[]));
  const c=colorsBy(ms=>ms.some(m=>set.has(m))?hi:ne);c.n=ne;
  return figSvg(c,false,'wf',ph)+figSvg(c,true,'wf',ph);
}
function exFig(ex,ph){
  const pri=new Set(ex.p),sec=new Set(ex.s);
  const c=colorsBy(ms=>ms.some(m=>pri.has(m))?'#C2DF7A':ms.some(m=>sec.has(m))?'#E9F3CB':NEUT);
  (ex.rg||[]).forEach(r=>c[r]='#6F9A1E');
  const back=BACKM.has(ex.p[0]);
  return figSvg(c,back,'',ph);
}
/* sprite */
function sprite(ex,opt={}){
  if(ex&&ex.img)return `<div class="sp${opt.still?' nomo':''}" role="img" aria-label="${esc(ex.n)} form, two frames" style="background-image:url('${ex.img[0]}');${opt.still?'':'' }"></div>`;
  return '';
}
function visual(ex){
  return `<div class="vis"><div class="animbox">${frameSvg(ex,.5,0,0).replace('<svg ','<svg data-live="1" ')}<span class="animcap">${esc(ex.reg||'')}</span></div></div>`;
}
function thumb(ex){
  return `<div class="th" style="display:flex;align-items:center;justify-content:center;background:#fff">${frameSvg(ex,1,0,0)}</div>`;
}
const isFav=k=>(S.favs||[]).includes(k);
const favBtn=(k)=>`<span role="button" tabindex="0" class="fav ${isFav(k)?'on':''}" data-a="fav" data-v="${esc(k)}" aria-pressed="${isFav(k)}" aria-label="${isFav(k)?'Remove from favorites':'Add to favorites'}">${ico('lib',18)}<b>FAV</b></span>`;
const chip=(label,on,act,val,cls='')=>`<button class="chip ${cls} ${on?'on':''}" data-a="${act}" data-v="${esc(val)}">${label}</button>`;
const toggle=(on,act,val='')=>`<button class="tg ${on?'on':''}" role="switch" aria-checked="${!!on}" data-a="${act}" data-v="${esc(val)}"></button>`;
function partChips(parts){return parts.map(p=>`<span class="chip sm l">${PART_LABEL[p]||p}</span>`).join('')}
function estMin(w){if(!w)return 0;let s=0;w.blocks.forEach(b=>{const ne=b.ex.length;s+=b.sets*ne*(45+(b.rest||60)/ne)});return Math.round(s/60+4)}
/* ===== Home ===== */
function header(title,subt,right,left){return `<div class="top">${left||''}<div class="sp1"><div class="h1">${title}</div>${subt?`<div class="sub">${subt}</div>`:''}</div>${right||''}<button class="ibtn" data-a="drawer" aria-label="Menu and settings">${ico('gear')}</button></div>`}
function weekStrip(){
  const m=mondayOf(NOW()),today=startOfDay(NOW());
  return `<div class="wk">${DOW.map((d,i)=>{const t=m+i*DAY;const logs=logsOn(t).length;const isT=t===today;const away=activeAway(t);const pl=plannedParts(t);
    const past=t<today;let dot;
    if(logs)dot=`<span class="wm ok">${ico('check',13,'#2F7D12',3)}</span>`;
    else if(away)dot=`<span class="wm tx">away</span>`;
    else if(!pl.length)dot=`<span class="wm tx">rest</span>`;
    else if(past)dot=`<span class="wm bad">${ico('close',11,'#C0392B',3)}</span>`;
    else dot=`<span class="wm fut"></span>`;
    return `<div class="${isT?'tod':''}"><span>${['M','T','W','Th','F','S','Su'][i]}</span>${dot}</div>`}).join('')}</div>`}
function heroCard(){
  const away=activeAway();const done=logsOn(NOW());
  if(away&&away.type==='sick')return `<div class="hero"><div class="k">RECOVERY MODE</div><div class="big sm">Rest up</div><div class="m">${AWAY_LABEL.sick} until ${fmtDate(away.end)}. Your program waits for you. Gentle mobility is fine if you feel up to it.</div><button class="btn" data-a="mobility">Easy mobility reset</button></div>`;
  if(done.length){const l=done[done.length-1];return `<div class="hero"><div class="k">DONE TODAY</div><div class="big sm">${esc(l.title)}</div><div class="m">${l.dur||0} min. ${l.ex?l.ex.reduce((a,e)=>a+e.sets.length,0):0} sets logged. Nice work.</div><button class="btn" data-a="train-more">Train again anyway</button></div>`}
  const w=todayWorkout();
  if(!w){return `<div class="hero"><div class="htop"><div class="k">TODAY</div>${mornPill()}</div><div class="big">Rest day</div><div class="m">${away?AWAY_LABEL[away.type]+' mode is on.':'Recovery is where the growth happens.'}</div><button class="btn" data-a="train-more">Train anyway</button></div>`}
  const t=w.title.toUpperCase();
  const lines=w.parts.length>1&&w.kind!=='session'&&w.kind!=='program'?w.parts.map(p=>PART_LABEL[p]).join('<br>+ '):esc(w.title);
  const big=(w.title.length>22)?'big sm':'big';
  const sp=mornPill();return `<div class="hero hasfig${sp?' hasstr':''}"><div class="hfig" aria-hidden="true">${wFig(w,100,'#15191D','rgba(255,255,255,.55)')}</div><div class="htop"><div class="k">TODAY${w.label?', '+esc(w.label.toUpperCase()):''}</div>${sp}</div><div class="${big}">${lines}</div><div class="m">${w.blocks.length} exercises, about ${estMin(w)} min. ${effMode()==='home'?'Home':'Gym'} profile.</div><div class="m" style="font-size:13px">Targets: ${esc([...new Set(wTargets(w).flatMap(x=>x[1]))].slice(0,3).join(', '))}</div>${w.notes&&w.notes.length?`<div class="m" style="font-size:12px">${esc(w.notes[0])}</div>`:''}<button class="btn" data-a="preview-today">Start workout</button><button class="btn ghost" style="color:var(--limed);height:34px" data-a="swap-today">Swap or build my own</button></div>`;
}
function homeView(){
  const n=currentNudge();const ms=muscleState();const resting=Object.keys(ms).filter(m=>ms[m].st==='rec');
  const restNames=[...new Set(resting.map(m=>MUSCLE_LABEL[m]))];
  const wc=weekCounts(NOW());const m0=mondayOf(NOW());const wLogs=S.logs.filter(l=>l.t>=m0&&l.t<m0+7*DAY).length;
  const planned=basePlanCount();
  const wt=waterToday(),pct=Math.min(100,Math.round(wt/S.waterGoal*100));
  const sw=streakWeeks();
  const full=`${header(greeting(),S.logs.length?`${sw} week streak`:'Let us get started',`<div style="display:flex;align-items:center;gap:6px"><span class="pill">${S.goal==='bulk'?'Bulk':S.goal==='shred'?'Shred':'Maintain'}</span><button class="mswitch ${effMode()==='home'?'home':''}" data-a="mflip" role="switch" aria-checked="${effMode()==='home'}" aria-label="Gym or home mode"><i></i><span>Gym</span><span>Home</span></button></div>`,`<button data-a="sheet" data-v="users" aria-label="Profile: ${esc(curUser().name)}" style="border-radius:50%;box-shadow:0 0 0 2px #fff">${avatar(curUser(),userIdx(curUser()),38)}</button>`)}
  <div class="stack hm">${weekStrip()}${mornCard()}${heroCard()}
  ${n?`<div class="tl ${n.k==='roast'?'roast':n.k==='away'?'away':''}">${esc(n.t)}</div>`:''}
  <div class="g2">
   <button class="mini" data-a="screen" data-v="summary"><div class="t"><span class="ic" style="background:var(--ink)">${ico('chart',18,'#C8F169')}</span><b>Summary</b>${ico('chev',16,'#9AA9B4')}</div><div class="v">${wLogs} of ${planned}</div><div class="s">sessions, ${(wc.quads||0)+(wc.hams||0)+(wc.glutes||0)>0?'legs trained':'legs 0x so far'}</div></button>
   <button class="mini" data-a="sheet" data-v="recovery"><div class="t"><span class="ic" style="background:#EEF3E1">${ico('shield',18,'#4E7A12')}</span><b>Recovery</b></div><div class="v">${resting.length?restNames.length+' resting':'All ready'}</div><div class="s">${restNames.slice(0,3).join(', ')||'Every muscle is ready'}</div></button>
   <button class="mini" data-a="sheet" data-v="streak"><div class="t"><span class="ic" style="background:#FFF1D6">${ico('flame',18,'#C77700')}</span><b>Streak</b></div><div class="v">${sw} week${sw===1?'':'s'}</div><div class="s">${S.badges.length} badge${S.badges.length===1?'':'s'} earned</div></button>
   <button class="mini" data-a="sheet" data-v="water"><div class="t"><span class="ic" style="background:#E6EEF6">${ico('glass',18,'#3D6FA0')}</span><b>Water</b>${ico('chev',16,'#9AA9B4')}</div><div class="v">${wt} ml</div><div class="s">of ${S.waterGoal.toLocaleString()} ml, ${Math.round(wt/29.5735)} of ${Math.round(S.waterGoal/29.5735)} oz</div><div class="bar b" style="margin-top:4px"><i style="width:${pct}%"></i></div></button>
   <button class="mini" style="grid-column:span 2;min-height:0" data-a="screen" data-v="progress"><div class="t"><span class="ic" style="background:#EEF3E1">${ico('chart',18,'#4E7A12')}</span><b>Progress</b>${ico('chev',16,'#9AA9B4')}</div><div class="row" style="gap:10px"><div class="sp1"><div class="v">${progHomeLine()}</div><div class="s">Strength, consistency, history</div></div>${progHomeSpark()}</div></button>
  </div></div>`;
  return LSC.matches?homeLand(full,n):full;
}
function basePlanCount(){if(S.program&&PROGRAMS.find(p=>p.id===S.program.id))return PROGRAMS.find(p=>p.id===S.program.id).days;return basePlan().filter(a=>a.length).length}
/* ===== Week ===== */
function weekView(){
  const m=mondayOf(NOW())+UI.wkoff*7*DAY,today=startOfDay(NOW());const ms=muscleState();
  const cards=DOW.map((d,i)=>{const t=m+i*DAY;const logs=logsOn(t);const away=activeAway(t);const isT=t===today;const pl=plannedParts(t);
    let parts=pl,st='',cls='';
    if(logs.length){parts=[...new Set(logs.flatMap(l=>l.parts||[]))];st='<span class="st done">Done</span>'}
    else if(away){st='<span class="st away">Away</span>';parts=[]}
    else if(isT&&pl.length){st='<span class="st now">Today</span>'}
    else if(!pl.length){cls='rest';st='<span class="st">Rest</span>'}
    else if(t<today){const ref=Math.min(S.program&&S.program.started?startOfDay(S.program.started):1e15,S.logs.length?startOfDay(S.logs[0].t):1e15);st=t>=ref?'<span class="st">Missed</span>':'';if(t<ref)parts=[]}
    else st='<span class="st">Up next</span>';
    {const sk=schedKind(t);if(sk==='gym'||sk==='home')st+=` <span class="st">${sk==='gym'?'Gym':'Home'}</span>`}
    let note='';
    if(!logs.length&&t>=today&&S.set.guard&&pl.length){const rs=pl.filter(p=>partState(ms,p)>0&&t-NOW()<2*DAY).map(p=>PART_LABEL[p]);if(rs.length)note=`<div class="note" style="margin-top:6px">${rs.join(', ')} still resting. The guard will swap moves if needed.</div>`}
    const mins=parts.length&&!logs.length?estMin(genGuide(parts,S.goal,{noGuard:true})):(logs.length?logs.reduce((a,l)=>a+(l.dur||0),0):0);
    return `<div class="wcard ${cls} ${isT?'today':''}"><div class="d"><b>${d}</b><span>${new Date(t).getDate()}</span></div><div class="sp1">${parts.length?`<div class="chips">${partChips(parts)}</div>`:`<div class="sub">${away?esc(AWAY_LABEL[away.type]):(t<today&&!st?'Before you started':'Rest and recover')}</div>`}${mins?`<div class="sub" style="margin-top:4px">${logs.length?'':'about '}${mins} min</div>`:''}${note}</div>${st}</div>`}).join('');
  return `${header('Week',`${fmtDate(m)} to ${fmtDate(m+6*DAY)}`,'')}
  <div class="stack wkv"><div class="row"><button class="chip" data-a="wkoff" data-v="-1">${ico('back',14)} Prev</button><div class="sp1"></div>${UI.wkoff?`<button class="chip" data-a="wkoff" data-v="0">This week</button>`:''}<button class="chip" data-a="wkoff" data-v="1">Next ${ico('chev',14)}</button></div>
  ${cards}
  ${S.program&&PROGRAMS.find(p=>p.id===S.program.id)?`<div class="note g">Your program sets the days. Detach it from the menu to edit the week by hand.</div>`:`<button class="btn" data-a="sheet" data-v="editweek">Edit week</button>`}
  </div>`;
}
/* ===== Summary ===== */
function summaryView(){
  const m=mondayOf(NOW())+UI.sumoff*7*DAY;const wc=weekCounts(m);const rc=weekRegions(m);
  const wl=S.logs.filter(l=>l.t>=m&&l.t<m+7*DAY);
  const colour=colorsBy((ms,k)=>{const n=Math.max(0,...ms.map(x=>wc[x]||0));return n?SCALE[1]:NEUT});
  Object.keys(REGLAB).forEach(id=>colour[id]=SCALE[Math.min(3,rc[id]||0)]);
  const untr=['chest','back','shoulders','biceps','triceps','legs','abs'].filter(p=>!PART_MUSCLES[p].some(x=>wc[x]));
  const planned=basePlanCount();const mins=wl.reduce((a,l)=>a+(l.dur||0),0);const vol=wl.reduce((a,l)=>a+(l.ex||[]).reduce((b,e)=>b+e.sets.reduce((c,s)=>c+(s.w||0)*(s.r||0),0),0),0);
  const prs=wl.flatMap(l=>(l.pr||[]));
  const cardio=wl.filter(l=>l.kind==='cardio').reduce((a,l)=>a+(l.dur||0),0);
  const ranked=Object.keys(rc).sort((a,b)=>rc[b]-rc[a]);
  const top=ranked.filter(id=>rc[id]===rc[ranked[0]]).slice(0,3).map(id=>REGLAB[id]);
  const cold=['ch_up','ch_low','bi_short','tri_long','ab_low','qu_in','la_low','rd'].filter(id=>!rc[id]).map(id=>REGLAB[id]);
  return `<div class="top"><button class="ibtn" data-a="back" aria-label="Back">${ico('back')}</button><div class="sp1"><div class="h1">Summary</div><div class="sub">${fmtDate(m)} to ${fmtDate(m+6*DAY)}</div></div><span class="pill">${S.goal==='bulk'?'Bulk':S.goal==='shred'?'Shred':'Maintain'}</span></div>
  <div class="stack">
  <div class="row"><button class="chip" data-a="sumoff" data-v="-1">${ico('back',14)} Prev</button><div class="sp1"></div>${UI.sumoff?`<button class="chip" data-a="sumoff" data-v="0">This week</button>`:''}<button class="chip" data-a="sumoff" data-v="1" ${UI.sumoff>=0?'disabled style="opacity:.4"':''}>Next ${ico('chev',14)}</button></div>
  <div class="card"><div class="row" style="align-items:flex-start;gap:6px"><div class="sp1" style="text-align:center"><div class="sub" style="font-weight:700">Front</div>${figSvg(colour,false)}</div><div class="sp1" style="text-align:center"><div class="sub" style="font-weight:700">Back</div>${figSvg(colour,true)}</div></div>
  <div class="legend" style="justify-content:center;margin-top:8px"><span><i style="background:${SCALE[0]}"></i> 0x</span><span><i style="background:${SCALE[1]}"></i> 1x</span><span><i style="background:${SCALE[2]}"></i> 2x</span><span><i style="background:${SCALE[3]}"></i> 3x or more</span></div></div>
  ${top.length&&rc[ranked[0]]?`<div class="note g">Most worked: ${esc(top.join(', '))} (${rc[ranked[0]]}x).${cold.length&&wl.length?` Not hit yet: ${esc(cold.slice(0,4).join(', ').toLowerCase())}.`:''}</div>`:''}
  <div class="g2"><div class="mini" style="min-height:0"><div class="s">Sessions</div><div class="v">${wl.length} of ${planned}</div></div><div class="mini" style="min-height:0"><div class="s">Time</div><div class="v">${mins} min</div>${cardio?`<div class="s">${cardio} min cardio</div>`:''}</div>
  <div class="mini" style="min-height:0"><div class="s">Volume lifted</div><div class="v">${Math.round(vol*KG).toLocaleString()} lb</div><div class="s">${Math.round(vol).toLocaleString()} kg</div></div><div class="mini" style="min-height:0"><div class="s">New PRs</div><div class="v">${prs.length}</div></div></div>
  ${untr.length&&wl.length?`<div class="note">No work at all on: ${untr.map(p=>PART_LABEL[p].toLowerCase()).join(', ')}. ${UI.sumoff===0?'Worth squeezing in before the week ends.':''}</div>`:''}
  <div class="card"><div style="font-weight:700;margin-bottom:8px">Region breakdown</div>
  ${REGGROUPS.map(([t,ids])=>`<div style="padding:6px 0;border-top:1px solid var(--line)"><div class="sub" style="font-weight:700;margin-bottom:2px">${t}</div>${ids.map(id=>{const n=rc[id]||0;return `<div class="row" style="font-size:13px;padding:2px 0"><span style="width:150px">${REGLAB[id]}</span><div class="bar sp1"><i style="width:${Math.min(100,n*33)}%;background:#86AE2B"></i></div><span style="width:28px;text-align:right;color:var(--mut)">${n}x</span></div>`}).join('')}</div>`).join('')}</div>
  <div class="card"><div style="font-weight:700;margin-bottom:8px">Milestones</div><div class="g2" style="grid-template-columns:repeat(3,1fr)">${BADGES.map(b=>`<div class="badge ${S.badges.includes(b[0])?'on':''}">${ico('trophy',22,S.badges.includes(b[0])?'#2C3A10':'#9AA9B4')}${b[1]}</div>`).join('')}</div></div>
  ${prs.length?`<div class="card"><div style="font-weight:700;margin-bottom:6px">PRs this week</div>${wl.flatMap(l=>(l.pr||[]).map(id=>`<div class="row" style="font-size:13px;padding:2px 0"><span class="sp1">${esc(exName(id))}</span><span class="sub">${fmtDate(l.t)}</span></div>`)).join('')}</div>`:''}
  </div>`;
}

/* ===== Large landscape home: split banner, wide progress ===== */
const LSC=window.matchMedia('(min-width:1000px) and (orientation:landscape) and (min-height:560px)');
try{LSC.addEventListener('change',()=>{if(typeof render==='function'&&S&&S.onboarded)render()})}catch(e){}
function homeLand(full,n){
  const head=full.slice(0,full.indexOf('<div class="stack hm">'));
  const minis=full.match(/<button class="mini"[\s\S]*?<\/button>/g)||[];
  const hero=heroCard();
  const btns=(hero.match(/<button class="btn[^"]*"[\s\S]*?<\/button>/g)||[]);
  const heroBody=hero.replace(/<button class="btn[^"]*"[\s\S]*?<\/button>/g,'').replace(/<button class="spill"[\s\S]*?<\/button>/,'');
  const sp=mornPill();
  const main=btns.filter(x=>x.indexOf('ghost')<0).join('');
  const ghost=btns.filter(x=>x.indexOf('ghost')>=0).join('');
  const prog=`<button class="mini lprog" data-a="screen" data-v="progress"><div class="t"><span class="ic" style="background:#EEF3E1">${ico('chart',18,'#4E7A12')}</span><b>Progress</b>${ico('chev',16,'#9AA9B4')}</div><div class="v">${progHomeLine()}</div><div class="s">Workouts per week, last 8 weeks</div><div class="lchart">${progHomeSpark(320,110)}</div></button>`;
  return `${head}<div class="hl">
   ${mornCard()}
   <div class="lhero">${heroBody}</div>
   <div class="lact">${main}${sp?sp.replace('class="spill"','class="btn out lstr"'):''}${ghost}${weekStrip()}</div>
   ${n?`<div class="tl lnote ${n.k==='roast'?'roast':n.k==='away'?'away':''}">${esc(n.t)}</div>`:''}
   ${prog}
   <div class="lcards">${minis.slice(0,4).join('')}</div>
  </div>`;
}
