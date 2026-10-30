/* ===== Main: render, events, timers, reminders ===== */
const HIDE_NAV=['preview','player','finish','cfinish','equip','morning','mfinish'];
function view(){
  if(UI.pad)return padView();
  if(!S.onboarded)return onboardView();
  switch(UI.screen){
    case 'summary':return summaryView();case 'preview':return previewView();case 'player':return playView();case 'finish':return finishView();case 'cfinish':return cfinishView();case 'progress':return progressView();case 'morning':return morningView();case 'mfinish':return mfinishView();case 'equip':return equipView(false);
  }
  return UI.tab==='lib'?libView():UI.tab==='week'?weekView():homeView();
}
let ARMED=false,EXITT=0;
function arm(){try{if(!ARMED&&S.onboarded){history.pushState({g:1},'');ARMED=true}}catch(e){}}
['pointerdown','touchstart','keydown','click'].forEach(ev=>document.addEventListener(ev,arm,true));
window.addEventListener('popstate',()=>{
  ARMED=false;
  if(UI.sheet){UI.sheet=null;UI.picker=null}
  else if(UI.drawer)UI.drawer=false;
  else if(UI.screen==='player'||UI.screen==='morning'){toast('Tap Quit to leave')}
  else if((UI.screen==='finish'||UI.screen==='cfinish')&&UI.fin&&UI.fin.hist){UI.fin=null;UI.screen='progress'}
  else if(UI.screen==='finish'||UI.screen==='cfinish'){UI.fin=null;UI.screen=null;UI.tab='home'}
  else if(UI.screen){ACT.back();arm();return}
  else if(UI.tab!=='home')UI.tab='home';
  else if(NOW()-EXITT>2500){EXITT=NOW();toast('Back again to exit',2300)}
  else{return}
  arm();render();
});
let _lastKey='';
/* Renders never fire while a finger or mouse is down: a rebuild between press and release would swallow the tap (this made Create profile fail at random). */
let _pd=false,_rq=false;
document.addEventListener('pointerdown',()=>{_pd=true},true);
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>{_pd=false;if(_rq){setTimeout(()=>{if(_rq&&!_pd){_rq=false;render()}},60)}},true));
setInterval(()=>{if(_pd&&_rq&&!DG){_pd=false}},4000);
function render(){if(_pd){_rq=true;return}_rq=false;render0()}
function render0(){
  if(typeof applyTheme==='function')applyTheme();
  const root=$('#root');const sh0=$('.sheet');const shk=UI.sheet;const st=sh0?sh0.scrollTop:0;
  const hide=!S.onboarded||HIDE_NAV.includes(UI.screen)||!!UI.pad;
  document.body.classList.toggle('hide-nav',hide);
  let h=`<div id="app">${view()}</div>`;
  if(!hide)h+=`<nav class="nav" aria-label="Main"><div><i class="npill" aria-hidden="true"></i>${[['lib','Workouts','lib'],['home','Home','home'],['week','Week','week']].map(([k,l,i])=>`<button class="${UI.tab===k&&!UI.screen?'on':''}" data-a="tab" data-v="${k}">${ico(i,24)}<span class="nl">${l}</span></button>`).join('')}</div></nav>`;
  if(UI.drawer&&!UI.pad)h+=drawerView();
  if(UI.sheet&&!UI.pad)h+=`<div class="sheetbg" data-a="bgclose"><div class="sheet ${UI.sheet==='water'?'ink water':''}" role="dialog" aria-modal="true">${sheetHtml()}</div></div>`;
  if(UI.toast)h+=`<div class="toast" role="status">${esc(UI.toast)}</div>`;
  const ae=document.activeElement,aid=ae&&ae.id&&/^(INPUT|TEXTAREA)$/.test(ae.tagName)&&root.contains(ae)?ae.id:null,asel=aid&&ae.selectionStart!=null?[ae.selectionStart,ae.selectionEnd]:null;
  root.innerHTML=h;
  if(aid){const nn=document.getElementById(aid);if(nn){try{nn.focus({preventScroll:true});if(asel)nn.setSelectionRange(asel[0],asel[1])}catch(e){}}}
  const key=UI.tab+'|'+UI.screen;let go=false,dir='fade';
  if(key!==_lastKey){const ti=['lib','home','week'].indexOf(UI.tab);
    if(!_lastScr&&UI.screen)dir='fwd';else if(_lastScr&&!UI.screen)dir='back';else if(UI.screen&&_lastScr!==UI.screen)dir='fwd';else dir=ti>_lastTi?'r':ti<_lastTi?'l':'fade';
    _lastScr=UI.screen;_lastTi=ti;_lastKey=key;window.scrollTo(0,0);go=true}
  motionApply(go,dir,!!UI.sheet&&UI.sheet!==_shk,!!UI.drawer&&!_dr);_dr=!!UI.drawer;
  decorate();
  if(UI.tour)tourPlace();else tourCheck();
  const sh1=$('.sheet');if(sh1&&shk===_shk)sh1.scrollTop=st;_shk=shk;
}
let _anim=null,_shk=null,_lastScr=null,_lastTi=0,_dr=false;
function motionApply(go,dir,newSheet,newDrawer){
  document.body.dataset.motion='cascade';
  const np=document.querySelector('.npill');
  if(np){const idx=['lib','home','week'].indexOf(UI.tab),on=idx>=0&&!UI.screen,pv=UI._np;
    np.style.opacity=on?'1':'0';
    np.style.setProperty('--npi',(pv==null||!on?(on?idx:(pv==null?1:pv)):pv));
    if(on){if(pv!=null&&pv!==idx){requestAnimationFrame(()=>requestAnimationFrame(()=>{np.style.setProperty('--npi',idx)}))}UI._np=idx}}
  const add=(sel,...c)=>{const e=document.querySelector(sel);if(e)e.classList.add(...c)};
  if(go){add('#app','m-in','d-'+dir);add('.nav','m-nav');_anim={t:Date.now(),dir}}
  else if(_anim&&Date.now()-_anim.t<650){const e=Date.now()-_anim.t,a=document.getElementById('app');if(a){a.classList.add('m-in','d-'+_anim.dir);a.style.animationDelay=(-e)+'ms'}}
  if(newSheet){add('.sheetbg','m-in');add('.sheet','m-in')}
  if(newDrawer){add('.drawerbg','m-in');add('.drawer','m-in')}
}
let _toastT=null;
function toast(m,ms=3200){UI.toast=m;clearTimeout(_toastT);const el=$('.toast');if(el)el.textContent=m;else render();_toastT=setTimeout(()=>{UI.toast=null;const t=$('.toast');if(t)t.remove()},ms)}
function closeSheet(){UI.sheet=null;UI.picker=null;render()}
function today(){return dkey(NOW())}
function syncPrev(){if(UI.prev&&UI.prev.w){UI.prev.w.parts=[...new Set(UI.prev.w.blocks.flatMap(b=>b.ex.map(id=>EXB[id]?MUSCLE_PART[EXB[id].p[0]]:null)).filter(Boolean))];setCustom(UI.prev.w)}}
function addBlock(w,id){const e=EXB[id];w.blocks.push(e.m==='comp'?mkBlock([id],4,'6-10',{rest:120}):mkBlock([id],3,'10-12',{rest:75}))}
function cloneBlocks(bs){return JSON.parse(JSON.stringify(bs))}
function openBlank(){const w={id:'custom-'+NOW(),title:'My workout',parts:[],blocks:[],notes:[],kind:'custom'};setCustom(w);UI.sheet=null;UI.drawer=false;openPreview(w);UI.prev.editing=true;UI.picker={mode:'add'};UI.sheet='picker';render()}
const ACT={
 tab(v){UI.tab=v;UI.screen=null;UI.sheet=null;render()},
 mornopen(){UI.sheet='morning';render()},mornclose(){UI.mornOpen=false;render()},
 drawer(){UI.drawer=true;render()},drawerclose(){UI.drawer=false;render()},
 screen(v){UI.drawer=false;if(v==='prog'){UI.tab='lib';UI.lib.tab='prog';UI.screen=null}else{UI.screen=v;if(v==='equip')UI.eqprof='gym'}render()},
 back(){if(UI.screen==='preview'){UI.screen=UI.prev&&UI.prev.from&&UI.prev.from!=='preview'?UI.prev.from:null}else UI.screen=null;render()},
 sheet(v){UI.drawer=false;UI.sheet=v;if(v==='water')UI.wd=0;UI.uview=null;UI.uname=undefined;UI.upic=undefined;UI.delAsk=null;UI.impAsk=false;UI.resetAsk=false;UI.rsAsk=null;render()},sheetclose:closeSheet,bgclose(){closeSheet()},pickclose(){UI.picker=null;UI.sheet=null;render()},
 wkoff(v){UI.wkoff=v==='0'?0:UI.wkoff+ +v;render()},sumoff(v){if(v==='0')UI.sumoff=0;else UI.sumoff=Math.min(0,UI.sumoff+ +v);render()},
 libtab(v){UI.lib.tab=v;UI.lib.sq='';UI.lib.n=20;render()},libmore(){UI.lib.n=(UI.lib.n||20)+20;render()},libhave(){UI.lib.have=!UI.lib.have;render()},libfopen(){UI.lib.fopen=!UI.lib.fopen;UI.lib.n=20;render()},libfclear(){Object.assign(UI.lib,{eq:'',mu:'',pt:'',have:false});render()},libeq(v){UI.lib.eq=UI.lib.eq===v?'':v;render()},libmu(v){UI.lib.mu=UI.lib.mu===v?'':v;render()},libpt(v){UI.lib.pt=UI.lib.pt===v?'':v;render()},libpart(v){UI.lib.part=v;render()},
 exdetail(v){UI.detail=v;UI.sheet='detail';render()},
 addex(v){let w;if(UI.screen==='preview')w=UI.prev.w;else{w=(S.custom&&S.custom.date===today())?S.custom.w:(todayWorkout()||{id:'custom-'+NOW(),title:'My workout',parts:[],blocks:[],notes:[],kind:'custom'})}
   addBlock(w,v);if(UI.screen==='preview'){syncPrev()}else{setCustom(w);UI.prev={w,from:UI.screen};UI.screen='preview'}UI.sheet=null;render();toast('Added '+exName(v))},
 'ses-prev'(v){const s=[...S.customSessions,...SESSIONS].find(x=>x.id===v);openPreview(sessionToWorkout(s))},
 'ses-use'(v){const s=[...S.customSessions,...SESSIONS].find(x=>x.id===v);const w=sessionToWorkout(s);setCustom(w);openPreview(w)},
 'prog-prev'(){const w=programToWorkout();applyGuardToProgram(w);openPreview(w)},
 'prog-jump'(v){UI.jumpId=v;UI.sheet='jump';render()},'jump-go'(){const P=PROGRAMS.find(p=>p.id===UI.jumpId);S.program.pos=+$('#jsel').value;save();UI.sheet=null;render();toast('Program moved')},
 'prog-off'(){S.program=null;S.custom=null;save();render()},
 'prog-start'(v){const P=PROGRAMS.find(p=>p.id===v);S.program={id:v,pos:0,started:NOW()};S.goal=P.goal;rememberGoal();S.custom=null;save();render();toast('Program started. It sets your week now.')},
 foctog(v){const a=UI.focus.sel;const i=a.indexOf(v);i>=0?a.splice(i,1):a.push(v);render()},
 fmap(v,e){const k=e.target.closest('[data-k]');if(!k||!KEY_MUSCLES[k.dataset.k])return;const ms=KEY_MUSCLES[k.dataset.k];const a=UI.focus.sel;const all=ms.every(m=>a.includes(m));ms.forEach(m=>{const i=a.indexOf(m);if(all&&i>=0)a.splice(i,1);else if(!all&&i<0)a.push(m)});render()},
 focstrict(){UI.focus.strict=!UI.focus.strict;render()},focback(){UI.focus.back=!UI.focus.back;render()},
 focbuild(){const w=buildFocus();if(!w.blocks.length){toast('No matching moves for your equipment');return}setCustom(w);openPreview(w)},
 'preview-today'(){const w=todayWorkout();if(!w)return;openPreview(w)},
 pmode(v){const el=$('.mtog');if(el)el.classList.toggle('home',v==='home');setTimeout(()=>{S.mode=v;S.modeDay=dkey(NOW());save();if(UI.prev.editing)UI.prev.w.base=null;adaptW(UI.prev.w);if(!UI.prev.w.prog&&S.custom&&S.custom.w&&S.custom.w.id===UI.prev.w.id)setCustom(UI.prev.w);render();toast(v==='home'?'Home mode: swapped to what you have at home':'Gym mode: full equipment')},el?190:0)},
 'swap-today'(){UI.swapParts=[];UI.sheet='swap';render()},
 swappart(v){const a=UI.swapParts=UI.swapParts||[];const i=a.indexOf(v);i>=0?a.splice(i,1):a.push(v);render()},
 'swap-go'(){const w=genGuide(UI.swapParts,S.goal);setCustom(w);UI.sheet=null;openPreview(w)},
 'swap-guide'(){UI.swapParts=suggestParts();render()},'swap-ses'(){UI.sheet=null;UI.tab='lib';UI.lib.tab='ses';UI.screen=null;render()},'swap-foc'(){UI.sheet=null;UI.tab='lib';UI.lib.tab='foc';UI.screen=null;render()},
 build(){openBlank()},
 'train-more'(){const w=todayWorkout(true);if(w)openPreview(w)},
 mobility(){const s=SESSIONS.find(x=>x.id==='s-mobility');const w=sessionToWorkout(s);setCustom(w);openPreview(w)},
 'blk-up'(v){const a=UI.prev.w.blocks,i=+v;if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];syncPrev();render()}},
 'blk-down'(v){const a=UI.prev.w.blocks,i=+v;if(i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];syncPrev();render()}},
 'blk-del'(v){UI.prev.w.blocks.splice(+v,1);syncPrev();render()},
 'blk-sets'(v){const b=UI.prev.w.blocks[+v];b.sets=b.sets>=6?2:b.sets+1;syncPrev();render()},
 'blk-swap'(v){const b=UI.prev.w.blocks[+v];UI.picker={mode:'swap',bi:+v,alt:EXB[b.ex[0]]};UI.sheet='picker';render()},
 'picker-open'(){UI.picker={mode:'add'};UI.sheet='picker';render()},'picker-ses'(){UI.picker={mode:'ses'};UI.sheet='picker';render()},
 pickmu(v){UI.picker.mu=UI.picker.mu===v?'':v;render()},
 pick(v){const P=UI.picker,w=UI.prev.w;if(P.mode==='swap'){w.blocks[P.bi].ex[0]=v;toast('Swapped to '+exName(v))}else{addBlock(w,v);toast('Added '+exName(v))}UI.picker=null;UI.sheet=null;syncPrev();render()},
 'pick-ses'(v){const s=SESSIONS.find(x=>x.id===v);UI.prev.w.blocks.push(...cloneBlocks(resolveBlocks(s.blocks)));UI.picker=null;UI.sheet=null;syncPrev();render();toast('Added blocks from '+s.t)},
 savesession(){const w=UI.prev.w;S.customSessions.push({id:'c-'+NOW(),t:w.title==='My workout'?'My session '+(S.customSessions.length+1):w.title,parts:w.parts,goal:'both',freq:'Saved by you',blocks:cloneBlocks(w.blocks)});save();toast('Saved in Library, Sessions')},
 startplay(){startPlay(UI.prev.w)},
 'toggle-edit'(){UI.prev.editing=!UI.prev.editing;render()},
 /* player */
 quit(){const P=UI.play;if(P.quit){UI.play=null;UI.screen=null;releaseLock();render()}else{P.quit=true;render();setTimeout(()=>{if(UI.play){UI.play.quit=false;if(UI.screen==='player')render()}},3000)}},
 grip(v){const st=UI.play.steps[UI.play.i];UI.play.grip[st.id]=v;render()},
 wd(v){stepW(+v);render()},rd(v){UI.play.cur.r=Math.max(0,UI.play.cur.r+ +v);render()},
 logset(){logSet()},
 timer(){const P=UI.play;if(P.tm&&P.tm.end)P.tm=null;else P.tm={end:NOW()+P.cur.r*1000};render()},
 restadj(v){UI.play.rest.end+=+v*1000;UI.play.rest.total+=+v*1000;render()},restskip(){UI.play.rest=null;render()},
 'pl-swap'(){const P=UI.play,st=P.steps[P.i],ex=EXB[st.id];const alt=swapFor(ex);if(!alt){toast('No swap that fits your equipment');return}
   P.w.blocks[st.bi].ex[st.ei]=alt.id;P.steps.forEach(s=>{if(s.bi===st.bi&&s.ei===st.ei&&s.id===st.id)s.id=alt.id});initCur();render();toast('Swapped to '+alt.n)},
 'pl-skip'(){const P=UI.play,st=P.steps[P.i];const j=P.steps.findIndex((s,i)=>i>P.i&&s.bi>st.bi);P.rest=null;if(j<0){finishPlay();return}P.i=j;initCur();render()},
 'pl-undo'(){const P=UI.play;if(!P.log.length)return;const k=P.log.pop();P.rec[k].pop();P.i=Math.max(0,P.i-1);P.rest=null;initCur();render()},
 wday(v){UI.wd=+v;render()},
 waterall(){UI.sheet=null;UI.wd=0;UI.prg=Object.assign(UI.prg||{r:12},{water:true});UI.screen='progress';render();setTimeout(()=>{const e=document.getElementById('waterc');if(e)e.scrollIntoView({block:'start'})},60)},
 'water+'(v){const off=UI.sheet==='water'?(UI.wd||0):0;addWater(+v,off);hap(15);const nb=checkBadges();if(UI.sheet==='water'||UI.screen==='finish'||UI.screen==='player'||UI.tab==='home')render();toast(off?`+${v} ml added to ${off===1?'yesterday':fmtDate(NOW()-off*DAY)}`:`+${v} ml, ${waterToday()} ml today`);if(nb.length)setTimeout(()=>toast('Milestone: '+nb[0][1]),1800)},
 'water-cust'(){const v=Math.round(+$('#wcust').value);if(v>0&&v<=2000)ACT['water+'](v);else toast('Enter 1 to 2000 ml')},
 'water-undo'(){const k=dkey(NOW()-(UI.wd||0)*DAY);for(let i=S.water.length-1;i>=0;i--){if(dkey(S.water[i].t)===k){S.water.splice(i,1);break}}save();render()},
 finishdone(){const F=UI.fin;if(F&&F.log&&!F.hist&&F.log.kind!=='cardio'&&!F.pstr&&(F.log.parts||[]).length){F.pstr=1;UI.sheet='poststr';render();return}UI.fin=null;UI.screen=null;UI.tab='home';render()},
 /* settings */
 theme(v){S.set.theme=v;save();render()},
 mflip(){const b=$('.mswitch');const to=effMode()==='home'?'gym':'home';if(b)b.classList.toggle('home',to==='home');setTimeout(()=>{S.mode=to;S.modeDay=dkey(NOW());save();render()},230)},goal(v){S.goal=v;rememberGoal();save();render()},mode(v){S.mode=v;S.modeDay=dkey(NOW());save();render()},
 tog(v){S.set[v]=!S.set[v];save();render()},sens(v){S.set.sens=v;save();render()},units(v){S.set.units=v;save();render()},
 tone(v){if(v==='off')S.set.nudges=false;else{S.set.nudges=true;S.set.tone=v}save();render()},
 wgoal(v){S.waterGoal=Math.max(1000,Math.min(6000,S.waterGoal+ +v));save();render()},
 eqprof(v){UI.eqprof=v;render()},eqtog(v){const E=UI.eqprof||'gym';const a=S.profiles[E].items;const i=a.indexOf(v);i>=0?a.splice(i,1):a.push(v);save();render()},
 eqall(v){const E=UI.eqprof||'gym';S.profiles[E].items=v==='1'?EQUIP.map(e=>e[0]):[];save();render()},
 obnext(){window.scrollTo(0,0);if(UI.ob.step===0){UI.ob.step=1;UI.eqprof='gym';render()}else if(UI.ob.step===1){UI.ob.step=2;UI.sd=null;render()}else{S.onboarded=true;save();UI.screen=null;render()}},
 awaytype(v){UI.awayType=v;render()},
 'away-add'(){const a=$('#astart').value,b=$('#aend').value;if(!a||!b){toast('Pick both dates');return}const s=new Date(a+'T00:00').getTime(),e=new Date(b+'T00:00').getTime();if(e<s){toast('End is before start');return}S.away.push({type:UI.awayType||'vacation',start:s,end:e});save();UI.sheet=null;render();toast('Away mode on')},
 'away-end'(){const a=activeAway();if(a){a.end=startOfDay(NOW())-DAY;save()}UI.sheet=null;render()},
 cardiot(v){UI.cardioT=v;render()},
 'cardio-save'(){const m=Math.round(+$('#cmin').value);if(!(m>0)){toast('Enter minutes');return}const km=+$('#cdist').value||0;const t=UI.cardioT||'Run';S.logs.push({t:NOW(),title:'Cardio: '+t,parts:['cardio'],kind:'cardio',mode:S.mode,goal:S.goal,dur:m,ex:[],pr:[],cardio:{type:t,min:m,km}});const nb=checkBadges();save();UI.sheet=null;UI.fin={log:S.logs[S.logs.length-1],nb};UI.screen='cfinish';hap([60,40,60]);render()},
 'band-add'(){const r=Math.round(+$('#breps').value);if(!(r>0)){toast('Enter your reps');return}S.bandTests.push({name:$('#bname').value||'Band',ex:$('#bex').value,reps:r,verdict:bandVerdict(r),t:NOW()});save();render()},
 wkpart(v){const [i,p]=v.split(':');const plan=S.plan=basePlan().map(a=>a.slice());const a=plan[+i];const k=a.indexOf(p);k>=0?a.splice(k,1):a.push(p);save();render()},
 wkreset(){S.plan=null;save();render()},
 sore(v){S.soreness[v]=S.soreness[v]>NOW()?0:NOW()+24*HR;save();render()},
 copy(){const t=JSON.stringify(S);const done=()=>toast('Copied');try{navigator.clipboard.writeText(t).then(done,()=>{const e=$('#exp');e.select();toast('Select and copy the text')})}catch(e){const x=$('#exp');x.select();toast('Select and copy the text')}},
 import(){if(!UI.impAsk){UI.impAsk=true;render();return}try{const o=JSON.parse($('#imp').value);if(!o||typeof o!=='object'||!Array.isArray(o.logs))throw 0;S=Object.assign(DEFAULT_STATE(),o);S.set=Object.assign(DEFAULT_STATE().set,o.set||{});save();UI.sheet=null;UI.impAsk=false;render();toast('Backup restored')}catch(e){UI.impAsk=false;render();toast('That does not look like a Gymmy backup')}},
 sample(){sampleData();UI.sheet=null;render();toast('Sample data loaded. Erase it in Backup and data.')},
 switchuser(id){if(id===U.cur||!U.list.find(x=>x.id===id))return;{const t=uById(id);UI.unl=UI.unl||{};if(t&&t.pin&&!UI.unl[id]){UI.pad={id,mode:'enter',then:'switch',buf:'',err:''};render();return}}if(UI.play){toast('Finish or leave your workout first');return}
  save();U.cur=id;saveUsers();KEY=keyFor(id);load();UI.tab='home';UI.screen=null;UI.sheet=null;UI.drawer=false;UI.ob={step:0};UI.wkoff=0;UI.sumoff=0;UI.prev=null;UI.delAsk=null;UI.uview=null;UI.uname=undefined;render();toast('Hi '+curUser().name);syncSwitched();setTimeout(schedAsk,900)},
 gtog(){UI.gopen=!UI.gopen;render()},
 upick(v){UI.upic=v||null;render()},
 uadd(){UI.uview='add';UI.uname='';UI.upic=undefined;UI.delAsk=null;render();setTimeout(()=>{const e=$('#un');if(e)e.focus()},50)},
 uedit(id){{const t=uById(id);UI.unl=UI.unl||{};if(t&&t.pin&&!UI.unl[id]){UI.pad={id,mode:'enter',then:'edit',buf:'',err:''};render();return}}UI.uview=id;UI.uname=undefined;UI.upic=undefined;UI.delAsk=null;render()},
 uback(){UI.uview=null;UI.uname=undefined;UI.upic=undefined;UI.delAsk=null;render()},
 usave(){if(!uCanSave())return;const n=uniqName((UI.uname!==undefined?UI.uname:'').trim(),UI.uview==='add'?'':UI.uview);
  if(UI.uview==='add'){if(U.list.length>=MAXU){toast('Profile limit reached ('+MAXU+')');return}const id='u'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
    try{save()}catch(e){}U.list.push({id,name:n,pic:UI.upic||null,t:Date.now()});UI.uview=null;UI.uname=undefined;UI.upic=undefined;
    try{ACT.switchuser(id)}catch(e){
      /* never leave the person stuck on the form: finish the switch by hand */
      try{U.cur=id;KEY=keyFor(id);S=DEFAULT_STATE();S.eqv=1;UI.tab='home';UI.screen=null;UI.sheet=null;UI.drawer=false;UI.ob={step:0};UI.prev=null;render();toast('Hi '+n)}catch(e2){toast('Could not create the profile: '+(e2&&e2.message||e2))}}
    return}
  const x=U.list.find(y=>y.id===UI.uview);if(!x)return;if(n)x.name=n;if(UI.upic!==undefined)x.pic=UI.upic;x.t=Date.now();saveUsers();UI.uview=null;UI.uname=undefined;UI.upic=undefined;render();toast('Saved')},
 deluser(id){if(U.list.length<2)return;if(UI.delAsk!==id){UI.delAsk=id;render();return}UI.delAsk=null;
  try{localStorage.removeItem(keyFor(id))}catch(e){}syncDelete(id);const wasCur=id===U.cur;U.list=U.list.filter(x=>x.id!==id);(U.gone=U.gone||[]).push(id);
  if(wasCur){U.cur=U.list[0].id;KEY=keyFor(U.cur);load();UI.tab='home';UI.screen=null;UI.ob={step:0}}saveUsers();UI.uview=null;UI.uname=undefined;render();toast('Profile deleted')},
 rs(v){if(UI.rsAsk!==v){UI.rsAsk=v;render();return}const [a,b]=rsRange(v),out=x=>!(x.t>=a&&x.t<b);
  S.logs=S.logs.filter(out);S.water=S.water.filter(out);S.morn=(S.morn||[]).filter(out);S.wst=(S.wst||[]).filter(out);if(v==='week')S.plan=null;
  S.prs={};S.logs.forEach(l=>(l.ex||[]).forEach(e=>{let best=0;(e.sets||[]).forEach(s=>{if(s.w>0)best=Math.max(best,e1rm(s.w,s.r))});if(best>0&&(!S.prs[e.id]||best>S.prs[e.id]))S.prs[e.id]=best}));
  save();UI.rsAsk=null;render();toast(v==='day'?'Today was reset':v==='week'?'This week was reset':'This month was reset')},
 reset(){if(!UI.resetAsk){UI.resetAsk=true;render();return}S=DEFAULT_STATE();save();UI.resetAsk=false;UI.sheet=null;UI.ob={step:0};UI.tab='home';UI.screen=null;render()}
};
function sampleData(){
  const old=S.logs.length;const plan=basePlan();
  for(let i=20;i>=1;i--){const t=startOfDay(NOW()-i*DAY)+18*HR;const parts=plan[wkIdx(t)];if(!parts.length||i%7===3)continue;
    const g=genGuide(parts,S.goal,{noGuard:true});const exs=[];
    g.blocks.forEach(b=>b.ex.forEach(id=>{const e=EXB[id];const base={bb:42,db:14,cable:25,mach:38,smith:35,bw:0,band:0,kb:14,other:15}[e.eq]*(e.m==='comp'?1.4:1)*(1+(20-i)*0.006);const w=e.eq==='bw'||e.eq==='band'?0:Math.round(base*2)/2;const sets=[];for(let s=0;s<b.sets;s++)sets.push({w,r:Math.max(6,numFirst(b.reps)-(s>1?1:0))});exs.push({id,sets})}));
    S.logs.push({t,title:g.title,parts,kind:'guide',mode:'gym',goal:S.goal,dur:48+(i%4)*4,ex:exs,pr:i===9?[exs[0].id]:[],sample:true});
    exs.forEach(e=>{const b=Math.max(...e.sets.map(s=>s.w>0?e1rm(s.w,s.r):0));if(b>0&&(!S.prs[e.id]||b>S.prs[e.id]))S.prs[e.id]=b});
  }
  S.logs.sort((a,b)=>a.t-b.t);
  for(let i=6;i>=0;i--){const t=startOfDay(NOW()-i*DAY)+9*HR;[250,500,250,150].slice(0,2+(i%3)).forEach((ml,k)=>S.water.push({t:t+k*3*HR,ml}))}
  S.onboarded=true;checkBadges();save();
}

/* Haptics: every press gets a tick, strength depends on the control */
const HAP_STRONG=/^(wstart|prog-start|startplay|pl-done|pl-log|logset|finishdone|mfinish|cardio-save|wskip|start|begin|save|sched-save|obnext)/;
const HAP_WARN=/(quit|delete|del|reset|clear|remove|discard|wipe|signout)/;
const HAP_SOFT=/^(tog|theme|goal|mflip|libf|chip|seg|tab|nav|wd|water\+|wchip|wtile)/;
function hapFor(el){const a=el.dataset.a||'';
  if(HAP_WARN.test(a))return [35,45,35];
  if(HAP_STRONG.test(a)||el.classList.contains('primary')||el.classList.contains('hero'))return [55];
  if(el.closest('.nav'))return [22];
  if(a==='wd'||a==='rd')return [26];
  if(HAP_SOFT.test(a)||el.classList.contains('chip')||el.classList.contains('seg'))return [18];
  return [32]}
document.addEventListener('click',e=>{
  const el=e.target.closest&&e.target.closest('[data-a],button,.chip');if(!el||el.disabled)return;
  hap(hapFor(el))},true);
document.addEventListener('keydown',e=>{
  const t=e.target;if(!t||!/^(INPUT|TEXTAREA)$/.test(t.tagName))return;
  if(e.key==='Enter'&&t.id==='un'){e.preventDefault();ACT.usave();return}
  if(e.key==='Enter')hap([30,30,30]);else if(e.key==='Backspace')hap(14);else if(e.key.length===1)hap(10)});

/* ===== Long-press drag to reorder ===== */
const DRAG={
 rt(f,t){const a=rord().map(r=>r.id);const [x]=a.splice(f,1);a.splice(t,0,x);S.set.rorder=a;save();render()},
 blk(f,t){const a=UI.prev.w.blocks;const [x]=a.splice(f,1);a.splice(t,0,x);syncPrev();render()},
 fav(f,t){const ks=(S.favs||[]).filter(k=>k.indexOf('ex:')===0&&EXB[k.slice(3)]);const [x]=ks.splice(f,1);ks.splice(t,0,x);let n=0;S.favs=S.favs.map(k=>(k.indexOf('ex:')===0&&EXB[k.slice(3)])?ks[n++]:k);save();render()}
};
let DG=null;
function dgScroller(el){let p=el.parentElement;while(p&&p!==document.body){const o=getComputedStyle(p).overflowY;if((o==='auto'||o==='scroll')&&p.scrollHeight>p.clientHeight)return p;p=p.parentElement}return null}
function dgPos(){const sc=DG.sc;return (sc?sc.scrollTop:window.scrollY)}
function dgStart(){
  if(!DG)return;const box=DG.box;DG.items=[...box.children].filter(c=>c.classList.contains('dri'));
  DG.from=DG.items.indexOf(DG.it);if(DG.from<0){DG=null;return}
  DG.rects=DG.items.map(c=>c.getBoundingClientRect());DG.sc=dgScroller(box);DG.s0=dgPos();DG.on=true;DG.to=DG.from;
  const r=DG.rects[DG.from],nx=DG.rects[DG.from+1],pv=DG.rects[DG.from-1];
  DG.h=r.height+(nx?Math.max(0,nx.top-r.bottom):pv?Math.max(0,r.top-pv.bottom):8);
  DG.it.classList.add('dragging');box.classList.add('dgbox');document.body.classList.add('dgon');hap([40]);dgLoop()}
function dgLoop(){
  if(!DG||!DG.on)return;
  const y=DG.cy;if(y<90)(DG.sc||window).scrollBy(0,-12);else if(y>innerHeight-90)(DG.sc||window).scrollBy(0,12);
  const dy=DG.cy-DG.y0+(dgPos()-DG.s0);
  DG.it.style.transform=`translateY(${dy}px) scale(1.02)`;
  const mid=DG.rects[DG.from].top+DG.rects[DG.from].height/2+dy;let to=0;
  DG.rects.forEach((r,j)=>{if(j!==DG.from&&r.top+r.height/2<mid)to++});
  if(to!==DG.to){DG.to=to;hap([14])}
  DG.items.forEach((c,j)=>{if(j===DG.from)return;let s=0;if(DG.from<j&&j<=to)s=-DG.h;else if(to<=j&&j<DG.from)s=DG.h;c.style.transform=s?`translateY(${s}px)`:''});
  requestAnimationFrame(dgLoop)}
function dgEnd(commit){
  if(!DG)return;clearTimeout(DG.tm);const g=DG;DG=null;
  if(!g.on)return;
  g.items.forEach(c=>{c.style.transform='';c.classList.remove('dragging')});g.box.classList.remove('dgbox');document.body.classList.remove('dgon');
  window.__dgc=NOW();
  if(commit&&g.to!==g.from){const f=DRAG[g.box.dataset.drag];if(f){hap([30,20,30]);f(g.from,g.to)}}}
document.addEventListener('pointerdown',e=>{
  const it=e.target.closest&&e.target.closest('.dri');if(!it)return;const box=it.closest('[data-drag]');if(!box)return;
  if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest('input,textarea'))return;
  DG={it,box,x:e.clientX,y:e.clientY,y0:e.clientY,cy:e.clientY,on:false,tm:setTimeout(dgStart,380)}},true);
document.addEventListener('pointermove',e=>{
  if(!DG)return;DG.cy=e.clientY;
  if(!DG.on&&Math.hypot(e.clientX-DG.x,e.clientY-DG.y)>10){clearTimeout(DG.tm);DG=null}});
document.addEventListener('pointerup',()=>dgEnd(true),true);
document.addEventListener('pointercancel',()=>dgEnd(false),true);
document.addEventListener('touchmove',e=>{if(DG&&DG.on&&e.cancelable)e.preventDefault()},{passive:false});
document.addEventListener('contextmenu',e=>{if(DG)e.preventDefault()});
document.addEventListener('click',e=>{if(window.__dgc&&NOW()-window.__dgc<450){e.stopImmediatePropagation();e.preventDefault()}},true);
Object.assign(ACT,{
 pk(v){const P=UI.pad;if(!P)return;if(P.mode==='enter'&&UI.pinlock&&UI.pinlock>NOW())return;
  if(v==='b')P.buf=P.buf.slice(0,-1);else if(P.buf.length<4)P.buf+=v;P.err='';
  render();if(P.buf.length===4)setTimeout(padDone,140)},
 padcancel(){UI.pad=null;render()},
 padswitch(id){const u=uById(id);if(!u)return;UI.unl=UI.unl||{};if(u.pin&&!UI.unl[id]){UI.pad={id,mode:'enter',then:'switch',buf:'',err:''};render()}else{UI.pad=null;ACT.switchuser(id)}},
 pinset(id){UI.pad={id,mode:'new',then:'edit',buf:'',first:'',err:''};render()},
 pinrm(id){const x=uById(id);if(!x)return;delete x.pin;x.t=Date.now();saveUsers();toast('PIN removed');render()},
 lockcur(){UI.unl=UI.unl||{};delete UI.unl[U.cur];UI.sheet=null;UI.drawer=false;UI.pad={id:U.cur,mode:'enter',then:'boot',buf:'',err:''};render()}
});
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]');if(!el)return;
  const a=el.dataset.a;
  if((a==='bgclose')&&e.target!==el)return;
  if(a==='drawerclose'&&e.target.closest('.drawer')&&!e.target.closest('button[data-a=drawerclose]'))return;
  const f=ACT[a];if(f){e.preventDefault();f(el.dataset.v,e)}
});
document.addEventListener('change',e=>{
  if(!e.target||e.target.id!=='upf'||!e.target.files||!e.target.files[0])return;
  const f=e.target.files[0],rd=new FileReader();
  rd.onload=()=>{const im=new Image();im.onload=()=>{try{const s=Math.min(im.width,im.height),c=document.createElement('canvas');c.width=c.height=144;const g=c.getContext('2d');g.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,144,144);UI.upic=c.toDataURL('image/jpeg',.82);render()}catch(x){toast('Could not use that photo')}};im.onerror=()=>toast('Could not use that photo');im.src=rd.result};
  rd.readAsDataURL(f);
});
document.addEventListener('input',e=>{
  const k=e.target.dataset&&e.target.dataset.in;if(!k)return;const v=e.target.value;
  if(k==='q'){UI.lib.q=v;const l=filterEx();const box=$('#exlist');if(box)box.innerHTML=exList(l.slice(0,60))+(l.length>60?'<div class="sub" style="text-align:center">Showing 60. Search or filter to narrow down.</div>':'');const c=$('#q');return}
  if(k==='sq'){UI.lib.sq=v;const b=$('#libbody');if(b)b.innerHTML=libBody();return}
  if(k==='pq'){UI.picker.q=v;const box=$('#pklist');if(box){const tmp=document.createElement('div');tmp.innerHTML=pickerView();const nb=tmp.querySelector('#pklist');if(nb)box.innerHTML=nb.innerHTML}return}
  if(k==='w'){const n=parseFloat(v);if(!isNaN(n)){UI.play.cur.w=S.set.units==='lb'?n/KG:n;const s=$('#wsub');if(s)s.textContent=S.set.units==='lb'?kgr(UI.play.cur.w)+' kg':lb(UI.play.cur.w)+' lb'}return}
  if(k==='r'){const n=parseInt(v);if(!isNaN(n))UI.play.cur.r=n;return}
  if(k==='uname'){UI.uname=v;const x=U.list.find(y=>y.id===UI.uview);const er=nameErr(v,x&&x.id);const e=$('#uerr');if(e)e.textContent=er;const b=$('#usave');if(b)b.disabled=!uCanSave();return}
  if(k==='remCount'){S.set.remCount=+v;save();return}
  if(k==='remTime'||k==='wake'||k==='sleep'){S.set[k]=v;save();return}
});
/* timers */
setInterval(()=>{
  const P=UI.play;
  if(P&&P.rest){const left=P.rest.end-NOW();const rt=$('#rt');if(left<=0){hap([200,80,200]);beep();P.rest=null;if(UI.screen==='player')render()}else{if(rt)rt.textContent=fmtT(left);const rb=$('#rbar');if(rb)rb.style.width=Math.min(100,Math.round((1-left/P.rest.total)*100))+'%'}}
  if(P&&P.tm&&P.tm.end){const left=P.tm.end-NOW();const el=$('#tmr');if(left<=0&&!P.tm.done){P.tm.done=true;hap([200,80,200]);beep();if(el)el.textContent='00:00'}else if(el&&!P.tm.done)el.textContent=fmtT(left)}
},250);
const REM={day:'',shown:new Set()};
function hm(s){const [h,m]=s.split(':').map(Number);return h*60+m}
function checkReminders(){
  if(!S.onboarded||UI.play)return;
  const d=today();if(REM.day!==d){REM.day=d;REM.shown=new Set()}
  const n=new Date(),mins=n.getHours()*60+n.getMinutes();
  if(activeAway())return;
  if(S.set.remWorkout&&!REM.shown.has('w')&&mins>=hm(S.set.remTime)&&mins<hm(S.set.remTime)+120&&plannedParts(NOW()).length&&!logsOn(NOW()).length){REM.shown.add('w');toast('Workout time: '+plannedParts(NOW()).map(p=>PART_LABEL[p]).join(' + '),7000);return}
  if(S.set.remWater){const a=hm(S.set.wake),b=hm(S.set.sleep),c=S.set.remCount;for(let i=0;i<c;i++){const t=a+Math.round((b-a)*(i+0.5)/c);if(mins>=t&&mins<t+90&&!REM.shown.has('h'+i)){REM.shown.add('h'+i);if(waterToday()<S.waterGoal*(i+1)/c){toast(`Sip some water. ${waterToday()} of ${S.waterGoal} ml so far.`,6000);return}}}}
}
setInterval(checkReminders,30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(UI.play)wakeLock();checkReminders()}});
Object.assign(ACT,MACT,TACT,SCHEDACT,PLANACT,PRGACT);
/* init */
loadUsers();load();UI.unl={};if(curUser().pin)UI.pad={id:U.cur,mode:'enter',then:'boot',buf:'',err:''};syncInit();
if(!S.onboarded&&S.logs.length)S.onboarded=true;
render();
setTimeout(schedAsk,1200);
setTimeout(checkReminders,2000);
