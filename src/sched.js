/* ===== Weekly schedule: gym days, home days, rest days (per profile) ===== */
const DAYFULL=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function schedKind(t){if(!S.sched||!S.sched.days)return null;return S.sched.days[wkIdx(t)]||'rest'}
function schedDraft(){
  if(S.sched&&S.sched.days)return S.sched.days.slice();
  const tpl=(S.goal==='shred'?WEEK_SHRED:WEEK_BULK);return tpl.map(a=>a.length?'gym':'rest');
}
function schedPlan(days){
  const tpl=(S.goal==='shred'?WEEK_SHRED:WEEK_BULK).filter(a=>a.length);const plan=[[],[],[],[],[],[],[]];
  days.map((v,i)=>v==='gym'||v==='home'?i:-1).filter(i=>i>=0).forEach((d,n)=>{plan[d]=tpl[n%tpl.length].slice()});return plan;
}
function schedBody(onb){
  const d=UI.sd||(UI.sd=schedDraft());
  const g=d.filter(x=>x==='gym').length,h=d.filter(x=>x==='home').length,r=7-g-h;
  const warn=r===0?`<div class="note" style="background:var(--redb);color:#7A2A1D"><b>No rest day this week.</b> Muscles grow while you rest. Training seven days a week raises the risk of overuse injuries and burnout. Keep at least one day off if you can.</div>`:r===1&&h>0?`<div class="note">Only one rest day. Keep your home days light and easy.</div>`:'';
  const rows=DAYFULL.map((n,i)=>{const v=d[i];
    return `<div class="srow ${v==='gym'||v==='home'?v:'rest'}"><div class="row"><b class="sp1">${n}</b><div class="seg sm"><button class="${v==='gym'?'on':''}" data-a="sdset" data-v="${i}:gym">${ico('building',15)} Gym</button><button class="${v==='home'?'on':''}" data-a="sdset" data-v="${i}:home">${ico('home',15)} Home</button><button class="${v==='rest'?'on':''}" data-a="sdset" data-v="${i}:rest">${ico('moon',15)} Rest</button></div></div>
    ${v==='rest'?`<div class="sub srest">${ico('moon',14)} Rest day. Recover and grow.</div>`:v?'':`<div class="sub srest">${ico('moon',14)} Not chosen. Counts as no workout.</div>`}
    ${v==='home'&&(r<=1||h>0&&false)?'':''}${v==='home'?`<div class="swarn">${ico('info',14)} No rest on this day. Keep it light and listen to your body.</div>`:''}</div>`}).join('');
  return `<div class="sub">${onb?'For each day choose Gym, Home or Rest. Pick Rest whenever you want a day off.':'For each day choose Gym, Home or Rest. Nothing is forced. Only pick Home on a day you cannot rest if you really want to train, and keep it light.'}</div>
  <div class="ssum"><span class="chip sm l">${g} gym</span><span class="chip sm l">${h} home</span><span class="chip sm">${r} rest</span></div>
  <div class="stack" style="gap:8px">${rows}</div>${warn}
  <div class="sub">Your week plan is rebuilt from this. The muscles each day trains still follow your goal or program.</div>
  <button class="btn" data-a="sched-save">${onb?'Finish setup':'Save schedule'}</button>`;
}
function schedSheet(){return SH('Your week',schedBody(false))}
let _sa=0;
function schedAsk(){if(UI.tour&&_sa++<12){setTimeout(schedAsk,2500);return}if(S.onboarded&&!S.sched&&!S.schedAsked&&!UI.sheet&&!UI.screen){S.schedAsked=1;save();UI.sd=null;UI.sheet='sched';render()}}
const SCHEDACT={
 sdset(v){const [i,k]=v.split(':');const d=UI.sd||(UI.sd=schedDraft());d[+i]=d[+i]===k?null:k;render()},
 schedopen(){UI.drawer=false;UI.sd=null;UI.sheet='sched';render()},
 'sched-save'(){const d=UI.sd||schedDraft();S.sched={days:d.slice()};S.schedAsked=1;S.plan=schedPlan(d);const wasOnb=!S.onboarded;S.onboarded=true;save();UI.sd=null;UI.sheet=null;UI.screen=null;UI.ob={step:0};render();toast(wasOnb?'All set. Welcome to Gymmy':'Schedule saved')}
};
/* ===== Gym avatars: jacked humans, robot and animals ===== */
const FSK=['#F2C9A5','#E8B48A','#C98E63','#8D5A3B','#F6D7BC','#6B4128'];
function faceSvg(k,sz){
  const F=b=>`<svg viewBox="10 6 44 46" width="${sz}" height="${sz}" aria-hidden="true" style="display:block">${b}</svg>`;
  const ink='#1F1A17';
  const torso=(skin,top)=>`<rect x="27.500" y="36" width="9" height="12" rx="3" fill="${skin}"/><path d="M8 54c1-9 9-13 24-13s23 4 24 13z" fill="${top}"/><path d="M25 42.500q7 6 14 0l-2-1.500q-5 3-10 0z" fill="${skin}"/>`;
  const head=s=>`<ellipse cx="32" cy="28" rx="13" ry="13.500" fill="${s}"/><ellipse cx="19" cy="29" rx="2" ry="3" fill="${s}"/><ellipse cx="45" cy="29" rx="2" ry="3" fill="${s}"/>`;
  const face=(e=ink)=>`<circle cx="27" cy="29" r="2" fill="${e}"/><circle cx="37" cy="29" r="2" fill="${e}"/><circle cx="27.700" cy="28.300" r=".7" fill="#fff"/><circle cx="37.700" cy="28.300" r=".7" fill="#fff"/><path d="M23.500 24.500q3.500-2 7 0M33.500 24.500q3.500-2 7 0" fill="none" stroke="${ink}" stroke-width="1.300" stroke-linecap="round" opacity=".75"/><path d="M27 34.200q5 4.200 10 0" fill="none" stroke="#8A3B3B" stroke-width="1.600" stroke-linecap="round"/><circle cx="23.500" cy="33" r="2.300" fill="#F0707A" opacity=".28"/><circle cx="40.500" cy="33" r="2.300" fill="#F0707A" opacity=".28"/>`;
  const cap=c=>`<path d="M19 28c-1.500-11 5-16 13-16s14.500 5 13 16c-2-5-6-8-13-8s-11 3-13 8z" fill="${c}"/>`;
  const band=c=>`<rect x="19" y="19.500" width="26" height="3.600" rx="1.800" fill="${c}"/>`;
  const human=(skin,top,pre,post)=>F(torso(skin,top)+pre+head(skin)+post+face());
  switch(k){
  case 0:return human('#8D5A3B','#3D6FA0','',cap('#1A1210')+band('#C8F169'));
  case 1:return human('#F6D7BC','#D9577A','<circle cx="32" cy="9.500" r="5.500" fill="#4A2E1F"/>',cap('#4A2E1F')+'<path d="M19 29c0-4 1-7 3-9" stroke="#4A2E1F" stroke-width="2.500" fill="none" stroke-linecap="round"/>');
  case 2:return human('#C98E63','#2C7A5A','',cap('#1A1210')+'<path d="M20 31c0 8 5 13 12 13s12-5 12-13c-2 4-6 5-12 5s-10-1-12-5z" fill="#1A1210"/>');
  case 3:return human('#E8B48A','#6B4C9A','<circle cx="32" cy="9" r="5.500" fill="#2A1E17"/>',cap('#2A1E17')+band('#C8F169'));
  case 4:return human('#F2C9A5','#4A545C','',cap('#3B2A20')+`<circle cx="27" cy="29" r="4.600" fill="none" stroke="${ink}" stroke-width="1.400"/><circle cx="37" cy="29" r="4.600" fill="none" stroke="${ink}" stroke-width="1.400"/><path d="M31.600 29h.8" stroke="${ink}" stroke-width="1.400"/>`);
  case 5:return human('#6B4128','#E0A526','<circle cx="21" cy="16" r="7" fill="#1A1210"/><circle cx="32" cy="11" r="8" fill="#1A1210"/><circle cx="43" cy="16" r="7" fill="#1A1210"/>',cap('#1A1210')+band('#E0A526'));
  case 6:return human('#C98E63','#B3412F','',cap('#2A1E17')+'<path d="M26 37q6-3 12 0q-3 2.500-6 1.500q-3 1-6-1.500z" fill="#2A1E17"/>');
  case 7:return human('#F6D7BC','#2C9AA8','<path d="M21 13l3-5 3 4 3-5 3 5 3-5 3 5 3-4 3 5z" fill="#B3412F"/>',cap('#B3412F')+band('#2C9AA8'));
  case 8:return F(`<rect x="27" y="36" width="10" height="10" fill="#8EA0AC"/><rect x="10" y="42" width="44" height="12" rx="6" fill="#5B6B78"/><circle cx="32" cy="48" r="2.600" fill="#C8F169"/><path d="M32 4v7" stroke="#5B6B78" stroke-width="2.500"/><circle cx="32" cy="4.500" r="3" fill="#C8F169"/><rect x="17" y="11" width="30" height="27" rx="9" fill="#B7C4CD"/><rect x="21" y="19" width="22" height="10" rx="5" fill="#1B2A33"/><circle cx="27" cy="24" r="2.500" fill="#C8F169"/><circle cx="37" cy="24" r="2.500" fill="#C8F169"/><path d="M26 33q6 4 12 0" fill="none" stroke="#5B6B78" stroke-width="2" stroke-linecap="round"/>`);
  case 9:return F(`<rect x="27" y="38" width="10" height="10" fill="#C9954F"/><path d="M8 54c1-9 9-13 24-13s23 4 24 13z" fill="#B3412F"/><circle cx="32" cy="28" r="19" fill="#7A5230"/><circle cx="32" cy="29" r="13.500" fill="#D9A862"/><ellipse cx="32" cy="35" rx="8" ry="6" fill="#F1D9A8"/><rect x="19" y="18" width="26" height="3.600" rx="1.800" fill="#C8F169"/><circle cx="26" cy="27.500" r="2" fill="${ink}"/><circle cx="38" cy="27.500" r="2" fill="${ink}"/><circle cx="26.700" cy="26.800" r=".7" fill="#fff"/><circle cx="38.700" cy="26.800" r=".7" fill="#fff"/><ellipse cx="32" cy="32" rx="3" ry="2.200" fill="#2A1E17"/><path d="M32 34v2M32 36q-3 2.500-5.500 .5M32 36q3 2.500 5.500 .5" fill="none" stroke="#2A1E17" stroke-width="1.300" stroke-linecap="round"/>`);
  case 10:return F(`<path d="M10 54c1-10 8-14 22-14s21 4 22 14z" fill="#3A2E28"/><circle cx="15" cy="29" r="5" fill="#4B3A32"/><circle cx="49" cy="29" r="5" fill="#4B3A32"/><circle cx="32" cy="28" r="15" fill="#4B3A32"/><path d="M19 21q13-9 26 0v-3q-13-8-26 0z" fill="#3A2E28"/><ellipse cx="32" cy="33" rx="10.500" ry="8.500" fill="#8A7568"/><rect x="19" y="18" width="26" height="3.200" rx="1.600" fill="#C8F169"/><circle cx="26.500" cy="27" r="2" fill="#fff"/><circle cx="37.500" cy="27" r="2" fill="#fff"/><circle cx="26.700" cy="27.200" r="1.200" fill="${ink}"/><circle cx="37.300" cy="27.200" r="1.200" fill="${ink}"/><ellipse cx="29.500" cy="32" rx="1.200" ry=".9" fill="#2A1E17"/><ellipse cx="34.500" cy="32" rx="1.200" ry=".9" fill="#2A1E17"/><path d="M27 36q5 3.500 10 0" fill="none" stroke="#2A1E17" stroke-width="1.600" stroke-linecap="round"/>`);
  default:return F(`<path d="M8 54c1-9 9-13 24-13s23 4 24 13z" fill="#2C9AA8"/><path d="M16 22l-1-14 11 8zM48 22l1-14-11 8z" fill="#D9742B"/><circle cx="32" cy="29" r="14" fill="#EC8A3C"/><path d="M18 31c4 3 6 8 14 12-9 0-14-5-14-12zM46 31c-4 3-6 8-14 12 9 0 14-5 14-12z" fill="#fff"/><rect x="19" y="19" width="26" height="3.400" rx="1.700" fill="#C8F169"/><circle cx="26" cy="28" r="2" fill="${ink}"/><circle cx="38" cy="28" r="2" fill="${ink}"/><circle cx="26.700" cy="27.300" r=".7" fill="#fff"/><circle cx="38.700" cy="27.300" r=".7" fill="#fff"/><path d="M30 33l2 2 2-2z" fill="#B3412F"/><path d="M32 35q-3 3-6 1.200M32 35q3 3 6 1.200" fill="none" stroke="#7A2E2E" stroke-width="1.300" stroke-linecap="round"/><path d="M10 31l9 2M10 36l9-1M54 31l-9 2M54 36l-9-1" stroke="#fff" stroke-width="1.200"/>`);
  }
}
