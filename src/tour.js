/* ===== First-time walkthroughs ===== */
const TOURS={
 home:[
  {sel:'button[aria-label^="Profile"]',t:'Your profile',x:'Tap your picture to switch, edit or add profiles. Each profile keeps its own plan and progress.'},
  {sel:'[data-a=drawer]',t:'Menu',x:'Your goal (Bulk or Shred), program, equipment, away modes, reminders and backups live here.'},
  {sel:'.morn',t:'Stretch',x:'A short guided stretch and mobility routine. It is picked for you each day and adds moves for muscles you trained recently. Tap Start, or Change to pick another.'},
  {sel:'.hero',t:'Today\'s workout',x:'This follows your goal and your equipment, and adjusts for recovery. Tap Start workout and the app guides you one move at a time.'},
  {sel:'.g2',t:'Quick cards',x:'Summary shows muscles trained this week. Recovery shows what is resting. Streak counts your weeks. Water logs what you drink.'},
  {sel:'.nav',t:'Moving around',x:'Home, Workouts (exercises, specialty workouts and programs) and Week (your plan). The back button always goes back one step.'}
 ],
 'lib:ex':[
  {sel:'.tabs',t:'Four ways to browse',x:'Exercises are single moves. Specialty workouts are ready-made. Programs run for weeks. Focus lets you train chosen muscles.'},
  {sel:'#q',t:'Search and filter',x:'Search by name, or use the chips to filter by equipment, muscle or movement type.'},
  {sel:'.exrow',t:'Tap any exercise',x:'You see an animated demo, the exact region it works, how to grip and position, and similar moves. Tap the dumbbell to save it to Favorites.'}
 ],
 'lib:fav':[{t:'Favorites',x:'Tap the dumbbell on any exercise, session or program to save it. Everything you save shows up here for quick access.'}],
 'lib:ses':[{t:'Specialty',x:'Ready-made workouts from well-known coaches, for chest, back, shoulders, arms, abs, home and mobility. Open one to preview, edit and start it.'}],
 'lib:prog':[{t:'Programs',x:'A program plans every workout for weeks, like the 12-week size program or the 6-day shred week. Start one and Home follows it. Detach it any time from the menu.'}],
 'lib:foc':[{t:'Focus mode',x:'Pick one or more muscles and the app lists the best moves for them. Turn on Strict to hide moves that also hit other main muscles.'}],
 week:[
  {sel:'.wcard',t:'Your week',x:'Each day shows the body parts planned. Rest days are part of the plan, because muscles grow while they recover.'},
  {sel:'.wkv .row',t:'Look ahead or back',x:'Use Prev and Next to see other weeks. Done days turn green.'}
 ],
 summary:[
  {sel:'#app svg',t:'Your body map',x:'Darker green means more work this week. Muscles are split into regions, like both heads of the biceps or upper and lower chest.'},
  {sel:'.legend',t:'Reading the colors',x:'0x means not trained this week. Use Prev to compare with earlier weeks.'}
 ],
 preview:[
  {sel:'[data-a=startplay]',t:'Start',x:'Tap Start workout and the app guides you through one exercise at a time with an animated demo.'},
  {sel:'[data-a=toggle-edit]',t:'Make it yours',x:'Swap moves, reorder, or change sets and reps before you start.'}
 ],
 player:[
  {sel:'.animbox',t:'Watch the move',x:'The figure shows the movement and the tag shows which region it works.'},
  {sel:'.gdet',t:'Grip and position',x:'Open this any time to learn how to hold the weight and set your body. Great for beginners.'},
  {sel:'.stepper',t:'Weight and reps',x:'Set the weight and reps for this set. lb and kg are shown side by side.'},
  {sel:'[data-a=logset]',t:'Log your set',x:'Tap Log set when done. A rest timer starts, and the app moves you to the next set.'},
  {sel:'[data-a=pl-swap]',t:'Not feeling a move?',x:'Swap it for a similar one, skip it, or undo your last set.'}
 ],
 morning:[
  {sel:'.animbox',t:'Follow the figure',x:'Each stretch has a timer. The app moves on by itself when time is up.'},
  {sel:'#mt',t:'Sides',x:'For one-sided moves you will feel a buzz halfway. That is your cue to switch sides.'},
  {sel:'[data-a=mpause]',t:'Pause, back or skip',x:'Take your time. Never push into pain, only a comfortable stretch.'}
 ],
 drawer:[
  {sel:'.drawer .seg',t:'Goal',x:'Bulk builds size with heavier sets and longer rest. Shred keeps rest short and adds cardio bursts.'},
  {sel:'.drawer .lrow:nth-of-type(1)',t:'Profile',x:'Switch or add people here.'}
 ],
 'sheet:detail':[
  {sel:'.animbox',t:'Exercise demo',x:'The animation loops the movement. The tag is the specific region it targets.'},
  {sel:'.card.stack',t:'Grip and position',x:'How to hold it, where it goes on your body, how to set up, and the usual beginner mistake.'}
 ],
 'sheet:water':[{t:'Water',x:'Tap an amount to log what you drink. The goal starts at 1 liter a day, and the app will never push you to drink too much.'}],
 'sheet:users':[
  {sel:'.sheet .lrow',t:'Switch profile',x:'Tap a person to switch. Their plan and history load instantly.'},
  {sel:'.sheet [data-a=uedit]',t:'Edit',x:'Change a name or picture, or delete a profile from the pencil.'}
 ],
 'sheet:recovery':[{t:'Recovery',x:'Muscles you trained recently show as resting. The daily guide swaps moves so you do not overload them.'}],
 'sheet:streak':[{t:'Streaks and badges',x:'A week counts when you complete your planned workouts. Badges unlock as you hit milestones.'}],
 'sheet:morning':[{t:'Stretch',x:'Pick a different routine or length. Auto-pick is on by default and adds moves for what you trained recently.'}],
 'sheet:prefs':[{t:'Preferences',x:'Units, tone of the reminders and puns, water goal and celebrations.'}],
 'sheet:remind':[{t:'Reminders',x:'Set your workout and water reminders. In the Android app these arrive as real notifications.'}],
 'sheet:away':[{t:'Away modes',x:'Vacation, sick, travel or gym closed. The plan pauses or adapts and nobody gets roasted.'}],
 'sheet:backup':[{t:'Backup',x:'Copy your data out or paste it back in. Handy for moving a profile to another device.'}],
 'sheet:band':[{t:'Band strength test',x:'Find which resistance band suits which rep range.'}]
};
let _tt=null;
function tourKey(){
  if(UI.sheet)return 'sheet:'+UI.sheet;
  if(UI.drawer)return 'drawer';
  if(UI.screen)return UI.screen;
  if(UI.tab==='lib')return 'lib:'+UI.lib.tab;
  return UI.tab;
}
const TSEEN=(()=>{try{return JSON.parse(localStorage.getItem('gymmy.tour')||'{}')}catch(e){return {}}})();
const tourSeen=k=>!!(TSEEN[k]||(S.tour&&S.tour[k]));
function tourMark(k){TSEEN[k]=1;try{localStorage.setItem('gymmy.tour',JSON.stringify(TSEEN))}catch(e){}S.tour=S.tour||{};S.tour[k]=1;save()}
function tourCheck(){
  if(UI.tour||UI.sheet==='sched'||!S.onboarded||window.__NOTOUR||location.search.indexOf('notour')>-1)return;
  const k=tourKey();if(!TOURS[k]||tourSeen(k))return;
  if(UI.screen==='finish'||UI.screen==='mfinish')return;
  clearTimeout(_tt);_tt=setTimeout(()=>{
    if(UI.tour||tourKey()!==k||tourSeen(k))return;
    const steps=TOURS[k].filter(s=>!s.sel||document.querySelector(s.sel));
    tourMark(k);
    if(!steps.length)return;
    UI.tour={k,i:0,steps};tourMount();
  },550);
}
function tourMount(){
  document.querySelectorAll('.tour').forEach(n=>n.remove());
  const T=UI.tour;if(!T)return;
  if(T.i>=T.steps.length){UI.tour=null;return}
  const st=T.steps[T.i],last=T.i===T.steps.length-1;
  const ov=document.createElement('div');ov.className='tour';
  ov.innerHTML=`<div class="tspot"></div><div class="tcard" role="dialog" aria-live="polite"><div class="sub">${T.i+1} of ${T.steps.length}</div><div class="tt">${esc(st.t)}</div><div class="tx">${esc(st.x)}</div><div class="row" style="gap:8px;margin-top:12px">${T.steps.length>1&&!last?'<button class="btn ghost sm" data-a="tourskip" style="width:auto;padding:0 12px">Skip tips</button>':''}<div class="sp1"></div><button class="btn sm" data-a="tournext" style="width:auto;padding:0 24px">${last?'Got it':'Next'}</button></div></div>`;
  document.body.appendChild(ov);
  const el=st.sel?document.querySelector(st.sel):null;
  if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});
  tourPlace();
}
function tourPlace(){
  const T=UI.tour;if(!T)return;const ov=document.querySelector('.tour');if(!ov)return;
  const st=T.steps[T.i],el=st.sel?document.querySelector(st.sel):null;
  const sp=ov.querySelector('.tspot'),cd=ov.querySelector('.tcard');
  const vh=window.innerHeight;
  if(!el){sp.style.display='none';ov.classList.add('dim');cd.style.top=Math.max(16,(vh-cd.offsetHeight)/2)+'px';cd.style.bottom='auto';return}
  ov.classList.remove('dim');sp.style.display='block';
  const r=el.getBoundingClientRect(),pad=6;
  sp.style.left=(r.left-pad)+'px';sp.style.top=(r.top-pad)+'px';sp.style.width=(r.width+pad*2)+'px';sp.style.height=(r.height+pad*2)+'px';
  const h=cd.offsetHeight,mid=r.top+r.height/2;
  let top=mid<vh/2?r.bottom+pad+14:r.top-pad-14-h;
  top=Math.max(12,Math.min(vh-h-12,top));
  cd.style.top=top+'px';cd.style.bottom='auto';
}
window.addEventListener('resize',()=>tourPlace());
window.addEventListener('scroll',()=>tourPlace(),true);
const TACT={
 tournext(){if(!UI.tour)return;UI.tour.i++;if(UI.tour.i>=UI.tour.steps.length){UI.tour=null;document.querySelectorAll('.tour').forEach(n=>n.remove());render();return}tourMount()},
 tourskip(){UI.tour=null;document.querySelectorAll('.tour').forEach(n=>n.remove())},
 fav(v){const f=S.favs=S.favs||[];const i=f.indexOf(v);if(i>=0)f.splice(i,1);else f.push(v);save();render();toast(i>=0?'Removed from favorites':'Added to favorites',1800)},
 tipsreset(){S.tour={};Object.keys(TSEEN).forEach(k=>delete TSEEN[k]);try{localStorage.removeItem('gymmy.tour')}catch(e){}save();UI.drawer=false;render();toast('Tips will show again as you visit each screen')}
};
