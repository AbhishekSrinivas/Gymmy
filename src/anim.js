/* ===== Pose-based exercise animation engine (side view, facing right) ===== */
const AD=Math.PI/180,LN={t:38,ua:21,fa:20,th:28,sh:27};
const Vd=(a,l)=>[Math.sin(a*AD)*l,Math.cos(a*AD)*l];      // limb vector, angle from straight down
const Uv=(a,l)=>[Math.sin(a*AD)*l,-Math.cos(a*AD)*l];     // torso vector, angle from straight up
const pAdd=(p,v,s=1)=>[p[0]+v[0]*s,p[1]+v[1]*s];
const FLOOR=150;
function solvePose(P){
  const r={};const g=(k,d)=>P[k]!==undefined?P[k]:d;
  const ua=g('ua',0),fa=g('fa',0),th=g('th',0),sh=g('sh',0),t=g('t',0);
  const ua2=g('ua2',ua),fa2=g('fa2',fa),th2=g('th2',th),sh2=g('sh2',sh);
  if(P.an==='foot'){r.ank=[P.x,P.y];r.knee=pAdd(r.ank,Vd(sh,LN.sh),-1);r.hip=pAdd(r.knee,Vd(th,LN.th),-1);r.sho=pAdd(r.hip,Uv(t,LN.t));r.elb=pAdd(r.sho,Vd(ua,LN.ua));r.wri=pAdd(r.elb,Vd(fa,LN.fa))}
  else if(P.an==='knee'){r.knee=[P.x,P.y];r.hip=pAdd(r.knee,Vd(th,LN.th),-1);r.ank=pAdd(r.knee,Vd(sh,LN.sh));r.sho=pAdd(r.hip,Uv(t,LN.t));r.elb=pAdd(r.sho,Vd(ua,LN.ua));r.wri=pAdd(r.elb,Vd(fa,LN.fa))}
  else if(P.an==='hand'){r.wri=[P.x,P.y];r.elb=pAdd(r.wri,Vd(fa,LN.fa),-1);r.sho=pAdd(r.elb,Vd(ua,LN.ua),-1);r.hip=pAdd(r.sho,Uv(t,LN.t),-1);r.knee=pAdd(r.hip,Vd(th,LN.th));r.ank=pAdd(r.knee,Vd(sh,LN.sh))}
  else{r.hip=[P.x,P.y];r.knee=pAdd(r.hip,Vd(th,LN.th));r.ank=pAdd(r.knee,Vd(sh,LN.sh));r.sho=pAdd(r.hip,Uv(t,LN.t));r.elb=pAdd(r.sho,Vd(ua,LN.ua));r.wri=pAdd(r.elb,Vd(fa,LN.fa))}
  if(P.dy){r.sho=[r.sho[0],r.sho[1]+P.dy];r.elb=pAdd(r.sho,Vd(ua,LN.ua));r.wri=pAdd(r.elb,Vd(fa,LN.fa))}
  r.knee2=pAdd(r.hip,Vd(th2,LN.th));r.ank2=pAdd(r.knee2,Vd(sh2,LN.sh));
  r.elb2=pAdd(r.sho,Vd(ua2,LN.ua));r.wri2=pAdd(r.elb2,Vd(fa2,LN.fa));
  r.head=pAdd(r.sho,Uv(t+g('hd',0),15));r.ft=g('ft',0);r.t=t;
  return r;
}
const f1=n=>Math.round(n*10)/10;
const ptS=p=>f1(p[0])+','+f1(p[1]);
function lerpPose(A,B,e){
  const o={an:A.an};const ks=new Set([...Object.keys(A),...Object.keys(B)]);
  ks.forEach(k=>{if(k==='an')return;const a=A[k]!==undefined?A[k]:B[k],b=B[k]!==undefined?B[k]:A[k];o[k]=a+(b-a)*e});
  return o;
}
const INK='#12202B',FAR='#9FB0BC';
const MARK={chest:['sho','hip',.3,5],lats:['sho','hip',.35,-5],midback:['sho','hip',.3,-5],lowback:['sho','hip',.8,-5],frontdelt:['sho',null,0,0],sidedelt:['sho',null,0,0],reardelt:['sho',null,0,0],traps:['sho',null,0,-2],biceps:['sho','elb',.5,0],triceps:['sho','elb',.5,0],forearms:['elb','wri',.5,0],abs:['sho','hip',.7,4],obliques:['sho','hip',.7,4],glutes:['hip',null,0,0],quads:['hip','knee',.5,0],hams:['hip','knee',.5,0],calves:['knee','ank',.6,0]};
function figureSvg(ex,tpl,e){
  const P=lerpPose(tpl.A,tpl.B,e),r=solvePose(P);
  const eq=ex.eq,pr=tpl.prop||'auto';
  let prop=pr==='auto'?({bb:'bb',db:'db',cable:'cable',band:'band',kb:'kb',smith:'bb',other:'bb',mach:'',bw:''})[eq]:pr;
  if(tpl.bw&&pr==='auto'&&(eq==='bb'||eq==='db'))prop=eq==='db'?'db':'bb';
  const cab=tpl.cab||[205,25];
  let s=`<g stroke-linecap="round" stroke-linejoin="round">`;
  s+=`<line x1="0" y1="${FLOOR+2}" x2="220" y2="${FLOOR+2}" stroke="#C9D3DA" stroke-width="2"/>`+(tpl.env||'');
  // muscle highlight
  const m=MARK[ex.p[0]];if(m){const a=r[m[0]],b=m[1]?r[m[1]]:a;const c=[a[0]+(b[0]-a[0])*m[2]+m[3],a[1]+(b[1]-a[1])*m[2]];s+=`<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="${ex.p[0]==='quads'||ex.p[0]==='hams'||ex.p[0]==='lats'?11:8}" fill="#C8F169" stroke="#86AE2B" stroke-width="1.5" opacity="${(.55+.4*Math.sin(Math.PI*e)).toFixed(2)}"/>`}
  // far limbs
  s+=`<polyline points="${ptS(r.hip)} ${ptS(r.knee2)} ${ptS(r.ank2)}" fill="none" stroke="${FAR}" stroke-width="6"/>`;
  s+=`<polyline points="${ptS(r.ank2)} ${ptS(pAdd(r.ank2,[Math.cos(r.ft*AD)*9,Math.sin(r.ft*AD)*9]))}" fill="none" stroke="${FAR}" stroke-width="5"/>`;
  s+=`<polyline points="${ptS(r.sho)} ${ptS(r.elb2)} ${ptS(r.wri2)}" fill="none" stroke="${FAR}" stroke-width="5"/>`;
  // torso
  s+=`<line x1="${f1(r.hip[0])}" y1="${f1(r.hip[1])}" x2="${f1(r.sho[0])}" y2="${f1(r.sho[1])}" stroke="${INK}" stroke-width="11"/>`;
  s+=`<polyline points="${ptS(r.hip)} ${ptS(r.knee)} ${ptS(r.ank)}" fill="none" stroke="${INK}" stroke-width="7"/>`;
  s+=`<polyline points="${ptS(r.ank)} ${ptS(pAdd(r.ank,[Math.cos(r.ft*AD)*9,Math.sin(r.ft*AD)*9]))}" fill="none" stroke="${INK}" stroke-width="5"/>`;
  s+=`<polyline points="${ptS(r.sho)} ${ptS(r.elb)} ${ptS(r.wri)}" fill="none" stroke="${INK}" stroke-width="5.5"/>`;
  s+=`<circle cx="${f1(r.head[0])}" cy="${f1(r.head[1])}" r="8" fill="${INK}"/>`;
  // props
  const hands=[r.wri];if(prop==='db'||prop==='cable'||prop==='band')hands.push(r.wri2);
  if(prop==='bb')s+=`<circle cx="${f1(r.wri[0])}" cy="${f1(r.wri[1])}" r="9" fill="none" stroke="#5B6B78" stroke-width="3.5"/><circle cx="${f1(r.wri[0])}" cy="${f1(r.wri[1])}" r="2.5" fill="#5B6B78"/>`;
  if(prop==='ball')s+=`<circle cx="${f1(r.wri[0])}" cy="${f1(r.wri[1])}" r="10" fill="#C8F169" stroke="${INK}" stroke-width="2.5"/>`;
  if(prop==='kb')s+=`<circle cx="${f1(r.wri[0])}" cy="${f1(r.wri[1]+5)}" r="7" fill="#5B6B78"/><path d="M${f1(r.wri[0]-4)} ${f1(r.wri[1]+1)}a4 4 0 018 0" fill="none" stroke="#5B6B78" stroke-width="2"/>`;
  if(prop==='db')hands.forEach((h,i)=>{s+=`<circle cx="${f1(h[0])}" cy="${f1(h[1])}" r="${i?4:5.5}" fill="${i?FAR:'#5B6B78'}"/>`});
  if(prop==='cable'||prop==='band'){const c=cab;s+=`<line x1="${f1(r.wri[0])}" y1="${f1(r.wri[1])}" x2="${c[0]}" y2="${c[1]}" stroke="#5B6B78" stroke-width="1.6" ${prop==='band'?'stroke-dasharray="4 3"':''}/><circle cx="${c[0]}" cy="${c[1]}" r="3.5" fill="#5B6B78"/><circle cx="${f1(r.wri[0])}" cy="${f1(r.wri[1])}" r="3" fill="#5B6B78"/>`}
  if(prop==='rope')s+=`<path d="M${ptS(r.wri)} Q${f1((r.wri[0]+r.wri2[0])/2+34)} ${f1(150+ (1-e)*0-6)} ${ptS(r.wri2)}" fill="none" stroke="#5B6B78" stroke-width="1.6"/>`;
  s+='</g>';
  return s;
}
/* ---------- environment pieces ---------- */
const E={
 bench:(x1,x2,y)=>`<rect x="${x1}" y="${y}" width="${x2-x1}" height="8" rx="3" fill="#C9D3DA"/><rect x="${x1+8}" y="${y+8}" width="5" height="${FLOOR-y-8}" fill="#C9D3DA"/><rect x="${x2-14}" y="${y+8}" width="5" height="${FLOOR-y-8}" fill="#C9D3DA"/>`,
 slant:(x1,y1,x2,y2,seatX,seatY)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C9D3DA" stroke-width="9"/><rect x="${seatX}" y="${seatY}" width="40" height="8" rx="3" fill="#C9D3DA"/><rect x="${seatX+14}" y="${seatY+8}" width="5" height="${FLOOR-seatY-8}" fill="#C9D3DA"/>`,
 bar:(x1,x2,y)=>`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#5B6B78" stroke-width="4"/><line x1="${x1}" y1="${y}" x2="${x1}" y2="${FLOOR}" stroke="#C9D3DA" stroke-width="4"/><line x1="${x2}" y1="${y}" x2="${x2}" y2="${FLOOR}" stroke="#C9D3DA" stroke-width="4"/>`,
 box:(x1,x2,h)=>`<rect x="${x1}" y="${FLOOR-h}" width="${x2-x1}" height="${h}" fill="#C9D3DA"/>`,
 tower:(x,y)=>`<rect x="${x}" y="${y}" width="14" height="${FLOOR-y}" rx="2" fill="#DDE5EA"/>`,
 seat:(x,y,bx)=>`<rect x="${x-16}" y="${y+3}" width="44" height="8" rx="3" fill="#C9D3DA"/><rect x="${x+4}" y="${y+11}" width="5" height="${FLOOR-y-11}" fill="#C9D3DA"/><rect x="${bx}" y="${y-48}" width="8" height="52" rx="3" fill="#C9D3DA"/>`,
 floorpad:(x1,x2)=>`<rect x="${x1}" y="${FLOOR-6}" width="${x2-x1}" height="8" rx="3" fill="#E4EAEE"/>`
};
function plank(theta){const a=90-theta;return {t:a,th:-a,sh:-a}}
const ST={an:'foot',x:100,y:FLOOR,t:0,th:0,sh:0,ua:0,fa:0,ft:0};
const mk=(base,o)=>Object.assign({},base,o);
const T={};
/* BENCH PRESS family */
const LIEB={an:'hip',x:95,y:114,t:-90,th:75,sh:-12,ft:0,hd:0};
T.bench={env:E.bench(34,148,118),A:mk(LIEB,{ua:180,fa:180}),B:mk(LIEB,{ua:68,fa:180})};
T.bench_dbfly={env:E.bench(34,148,118),A:mk(LIEB,{ua:180,fa:180}),B:mk(LIEB,{ua:112,fa:128})};
T.pullover={env:E.bench(34,148,118),A:mk(LIEB,{ua:-100,fa:-110}),B:mk(LIEB,{ua:-180,fa:-180})};
const INC={an:'hip',x:108,y:114,t:-55,th:75,sh:-12,ft:0};
T.incline={env:E.slant(76,92,108,118,88,118),A:mk(INC,{ua:180,fa:180}),B:mk(INC,{ua:70,fa:180})};
T.incline_fly={env:E.slant(76,92,108,118,88,118),A:mk(INC,{ua:180,fa:180}),B:mk(INC,{ua:115,fa:125})};
const DEC={an:'hip',x:120,y:104,t:-118,th:95,sh:-20,ft:0};
T.decline={env:`<line x1="52" y1="130" x2="132" y2="108" stroke="#C9D3DA" stroke-width="9"/>`,A:mk(DEC,{ua:180,fa:180}),B:mk(DEC,{ua:62,fa:180})};
const SEATP={an:'hip',x:100,y:118,t:-6,th:88,sh:0,ft:0};
T.machine_press={env:E.seat(100,118,78),A:mk(SEATP,{ua:-40,fa:85}),B:mk(SEATP,{ua:82,fa:88})};
T.pecdeck={env:E.seat(100,118,78),A:mk(SEATP,{ua:-30,fa:70,ua2:-30,fa2:70}),B:mk(SEATP,{ua:75,fa:90})};
const SC={an:'foot',x:96,y:FLOOR,t:14,th:14,sh:-6,ft:0,th2:-12,sh2:-16};
T.cable_fly={cab:[48,22],env:E.tower(40,20),A:mk(SC,{ua:-35,fa:-10}),B:mk(SC,{ua:70,fa:78})};
T.cable_fly_high_low={cab:[48,22],env:E.tower(40,20),A:mk(SC,{ua:-40,fa:-25,t:24}),B:mk(SC,{ua:35,fa:20,t:24})};
T.cable_press={cab:[20,80],env:E.tower(14,60),A:mk(SC,{ua:-20,fa:80}),B:mk(SC,{ua:88,fa:92})};
/* PUSH-UP family */
function pushup(hh,fh,label){ // hand height hh (bench), foot height fh
  const th0=Math.asin(Math.min(.98,Math.max(-.5,(41+hh-fh)/93)))/AD,th1=Math.asin(Math.min(.98,Math.max(-.5,(18+hh-fh)/93)))/AD;
  const ay=FLOOR-fh;const A=mk(ST,Object.assign({y:ay,ua:0,fa:0,ft:fh?-30:0},plank(th0))),B=mk(ST,Object.assign({y:ay,ua:-80,fa:44,ft:fh?-30:0},plank(th1)));
  const hx=100+93*Math.cos(th0*AD);
  const env=(hh?E.box(hx-18,hx+14,hh):'')+(fh?E.box(60,104,fh):'');
  return {env,A,B};
}
T.pushup=pushup(0,0);T.pushup_incline=pushup(32,0);T.pushup_feet=pushup(0,26);
/* DIPS */
T.dip={env:`<line x1="86" y1="96" x2="126" y2="96" stroke="#5B6B78" stroke-width="4"/><line x1="106" y1="96" x2="106" y2="${FLOOR}" stroke="#C9D3DA" stroke-width="4"/>`,
 A:{an:'hand',x:112,y:96,t:12,th:-10,sh:-45,ua:0,fa:0,ft:0},B:{an:'hand',x:112,y:96,t:28,th:-5,sh:-50,ua:-38,fa:38,ft:0}};
T.bench_dip={env:E.bench(120,170,112)+'',A:{an:'hand',x:140,y:112,t:-12,th:-72,sh:-10,ua:-5,fa:0,ft:0},B:{an:'hand',x:140,y:112,t:-12,th:-72,sh:-10,ua:-70,fa:35,ft:0}};
/* PULLING */
const HANG={an:'hand',x:110,y:36,t:0,th:0,sh:-25,ft:70};
T.pullup={env:E.bar(70,150,32),A:mk(HANG,{ua:180,fa:180}),B:mk(HANG,{ua:-22,fa:168,th:20,sh:-20})};
T.hang={env:E.bar(70,150,32),A:mk(HANG,{ua:180,fa:180}),B:mk(HANG,{ua:180,fa:180,t:4,th:6})};
T.scap={env:E.bar(70,150,32),A:mk(HANG,{ua:180,fa:180}),B:mk(HANG,{ua:172,fa:174,t:0})};
const SEATD={an:'hip',x:110,y:118,t:-8,th:88,sh:0,ft:0};
T.pulldown={cab:[120,10],env:E.seat(110,118,86)+E.tower(112,8),A:mk(SEATD,{ua:168,fa:170}),B:mk(SEATD,{ua:-12,fa:140,t:-18})};
T.pulldown_stand={cab:[130,12],env:E.tower(122,10),A:mk(SC,{ua:140,fa:150,t:12}),B:mk(SC,{ua:-12,fa:110,t:12})};
T.straightarm={cab:[130,16],env:E.tower(122,14),A:mk(SC,{ua:140,fa:140,t:16}),B:mk(SC,{ua:12,fa:12,t:24})};
const SEATR={an:'hip',x:85,y:128,t:12,th:78,sh:-14,ft:0};
T.row_seated={cab:[215,118],env:E.floorpad(90,150)+`<rect x="206" y="104" width="12" height="46" rx="2" fill="#DDE5EA"/>`,A:mk(SEATR,{ua:86,fa:86,t:22}),B:mk(SEATR,{ua:-34,fa:100,t:6})};
const HING={an:'foot',x:96,y:FLOOR,t:62,th:22,sh:-12,ft:0};
T.bentrow={A:mk(HING,{ua:4,fa:0}),B:mk(HING,{ua:-62,fa:8})};
T.row_support={env:`<rect x="104" y="108" width="60" height="8" rx="3" fill="#C9D3DA"/><rect x="118" y="116" width="5" height="34" fill="#C9D3DA"/>`,A:mk(HING,{ua:4,fa:0,t:70,th:30}),B:mk(HING,{ua:-62,fa:8,t:70,th:30})};
T.reardelt_bent={A:mk(HING,{ua:4,fa:4,t:72}),B:mk(HING,{ua:-40,fa:-40,t:72})};
/* HINGE / DEADLIFT / SQUAT */
T.deadlift={A:mk(ST,{ua:2,fa:2,t:2}),B:mk(ST,{th:62,sh:-24,t:48,ua:2,fa:2})};
T.rdl={A:mk(ST,{ua:2,fa:2,t:2}),B:mk(HING,{th:14,sh:-6,t:78,ua:2,fa:2})};
T.backext={env:`<line x1="70" y1="118" x2="116" y2="104" stroke="#C9D3DA" stroke-width="9"/>`,A:{an:'hip',x:104,y:100,t:80,th:-82,sh:-82,ua:0,fa:0,ft:0},B:{an:'hip',x:104,y:100,t:12,th:-82,sh:-82,ua:0,fa:0,ft:0,ua2:40}};
const SQ={an:'foot',x:104,y:FLOOR,t:0,th:0,sh:0,ft:0};
T.squat={A:mk(SQ,{ua:-35,fa:165}),B:mk(SQ,{t:42,th:78,sh:-36,ua:-35,fa:165})};
T.squat_front={A:mk(SQ,{ua:50,fa:175}),B:mk(SQ,{t:30,th:78,sh:-34,ua:50,fa:175})};
T.goblet={A:mk(SQ,{ua:25,fa:150}),B:mk(SQ,{t:30,th:76,sh:-34,ua:25,fa:150})};
T.box_squat={env:E.box(30,60,40),A:mk(SQ,{ua:-35,fa:165}),B:mk(SQ,{t:48,th:84,sh:-26,ua:-35,fa:165})};
T.squat_jump={A:mk(SQ,{t:36,th:76,sh:-32,ua:-50,fa:-30}),B:mk(SQ,{y:FLOOR-16,ua:170,fa:170,ft:55})};
T.lunge={A:mk(SQ,{th:0,sh:0,th2:0,sh2:0,ua:2,fa:2}),B:mk(SQ,{x:128,th:80,sh:-6,th2:-70,sh2:-100,t:4,ua:2,fa:2})};
T.lunge_jump={A:mk(SQ,{x:128,th:80,sh:-6,th2:-70,sh2:-100,ua:60,fa:60}),B:mk(SQ,{x:116,y:FLOOR-14,th:30,sh:-6,th2:-30,sh2:-40,ua:-40,fa:-40,ft:40})};
T.bulgarian={env:E.bench(24,70,118),A:mk(SQ,{x:128,th:40,sh:-8,th2:-84,sh2:-90,ua:2,fa:2}),B:mk(SQ,{x:128,th:82,sh:-12,th2:-84,sh2:-110,ua:2,fa:2})};
T.stepup={env:E.box(112,170,34),A:mk(SQ,{x:122,y:FLOOR-34,th:72,sh:-10,th2:-4,sh2:0,ua:2,fa:2}),B:mk(SQ,{x:136,y:FLOOR-34,th:0,sh:0,th2:60,sh2:-10,ua:2,fa:2})};
T.boxjump={env:E.box(130,180,40),A:mk(SQ,{x:92,t:38,th:74,sh:-30,ua:-50,fa:-30}),B:mk(SQ,{x:156,y:FLOOR-40,ua:150,fa:150})};
T.leglpress={env:`<line x1="40" y1="118" x2="96" y2="96" stroke="#C9D3DA" stroke-width="9"/><line x1="44" y1="126" x2="150" y2="${FLOOR}" stroke="#E4EAEE" stroke-width="3"/>`,A:{an:'hip',x:92,y:112,t:-62,th:158,sh:152,ft:-60,ua:70,fa:85},B:{an:'hip',x:92,y:112,t:-62,th:118,sh:30,ft:-60,ua:70,fa:85}};
T.legext={env:E.seat(100,112,80),A:{an:'hip',x:100,y:108,t:-4,th:88,sh:2,ft:60,ua:60,fa:70},B:{an:'hip',x:100,y:108,t:-4,th:88,sh:92,ft:-10,ua:60,fa:70}};
T.legcurl_seated={env:E.seat(100,112,80),A:{an:'hip',x:100,y:108,t:-4,th:88,sh:92,ft:-10,ua:60,fa:70},B:{an:'hip',x:100,y:108,t:-4,th:88,sh:2,ft:60,ua:60,fa:70}};
T.legcurl_lying={env:`<rect x="30" y="118" width="130" height="8" rx="3" fill="#C9D3DA"/>`,A:{an:'hip',x:130,y:112,t:-90,th:90,sh:92,ft:-40,ua:-100,fa:-100},B:{an:'hip',x:130,y:112,t:-90,th:90,sh:200,ft:-40,ua:-100,fa:-100}};
T.hipthrust={env:E.bench(24,76,122),A:{an:'foot',x:124,y:FLOOR,th:100,sh:-28,t:-84,ft:0,ua:60,fa:90},B:{an:'foot',x:124,y:FLOOR,th:90,sh:-8,t:-88,ft:0,ua:60,fa:90}};
T.bridge={env:'',A:{an:'foot',x:128,y:FLOOR,th:118,sh:-10,t:-94,ft:0,ua:-130,fa:-130},B:{an:'foot',x:128,y:FLOOR,th:80,sh:-24,t:-70,ft:0,ua:-170,fa:180}};
T.kbswing={A:mk(HING,{x:96,t:56,th:26,sh:-10,ua:12,fa:12}),B:mk(ST,{x:96,t:-4,ua:88,fa:88})};
T.calf={A:mk(ST,{}),B:mk(ST,{y:FLOOR-8,ft:60})};
T.calf_seated={env:`<rect x="76" y="86" width="40" height="8" rx="3" fill="#C9D3DA"/>`,A:{an:'foot',x:130,y:FLOOR,th:86,sh:-6,t:4,ft:0,ua:20,fa:70},B:{an:'foot',x:130,y:FLOOR-8,th:86,sh:-6,t:4,ft:60,ua:20,fa:70}};
T.jumprope={prop:'rope',A:mk(ST,{ua:-12,fa:70,ua2:-12,fa2:70}),B:mk(ST,{y:FLOOR-9,ft:55,ua:-12,fa:70,ua2:-12,fa2:70})};
T.run={an:'hip',env:'',A:{an:'hip',x:100,y:96,t:10,th:78,sh:-8,th2:-24,sh2:-60,ua:60,fa:130,ua2:-50,fa2:60,ft:0},B:{an:'hip',x:100,y:92,t:10,th:-24,sh:-60,th2:78,sh2:-8,ua:-50,fa:60,ua2:60,fa2:130,ft:0}};
T.climber={A:{an:'hand',x:186,y:FLOOR,t:64,th:-64,sh:-64,th2:20,sh2:-40,ua:0,fa:0,ft:0},B:{an:'hand',x:186,y:FLOOR,t:64,th:20,sh:-40,th2:-64,sh2:-64,ua:0,fa:0,ft:0}};
T.burpee={A:mk(SQ,{t:46,th:80,sh:-34,ua:8,fa:8}),B:mk(ST,Object.assign({x:90,ua:0,fa:0},plank(26)))};
T.slam={prop:'ball',A:mk(ST,{ua:170,fa:170,ft:55,y:FLOOR-3}),B:mk(SQ,{t:58,th:50,sh:-26,ua:12,fa:12})};
T.battle={A:mk(SQ,{t:20,th:36,sh:-18,ua:70,fa:70,ua2:10,fa2:10}),B:mk(SQ,{t:20,th:36,sh:-18,ua:10,fa:10,ua2:70,fa2:70})};
/* SHOULDERS */
T.ohp={A:mk(ST,{ua:18,fa:172}),B:mk(ST,{ua:178,fa:178})};
T.ohp_seated={env:E.seat(100,118,78),A:mk(SEATP,{ua:18,fa:172}),B:mk(SEATP,{ua:178,fa:178})};
T.arnold={env:E.seat(100,118,78),A:mk(SEATP,{ua:30,fa:150,fa2:150}),B:mk(SEATP,{ua:178,fa:178})};
T.front_raise={A:mk(ST,{ua:2,fa:2}),B:mk(ST,{ua:86,fa:88})};
T.front_alt={A:mk(ST,{ua:2,fa:2,ua2:80,fa2:82}),B:mk(ST,{ua:80,fa:82,ua2:2,fa2:2})};
T.lateral={A:mk(ST,{ua:4,fa:4}),B:mk(ST,{ua:78,fa:80,t:6})};
T.upright={A:mk(ST,{ua:4,fa:4}),B:mk(ST,{ua:128,fa:20})};
T.shrug={A:mk(ST,{ua:2,fa:2}),B:mk(ST,{ua:2,fa:2,dy:-7})};
T.facepull={cab:[212,52],env:E.tower(204,48),A:mk(SC,{ua:86,fa:88,t:6}),B:mk(SC,{ua:-70,fa:80,t:6})};
T.extrot={A:mk(ST,{ua:2,fa:92}),B:mk(ST,{ua:2,fa:40})};
/* ARMS */
T.curl={A:mk(ST,{ua:4,fa:4}),B:mk(ST,{ua:12,fa:158})};
T.curl_cable={cab:[170,144],A:mk(ST,{ua:4,fa:4}),B:mk(ST,{ua:12,fa:158})};
T.curl_incline={env:E.slant(70,98,104,118,86,118),A:mk({an:'hip',x:106,y:114,t:-38,th:76,sh:-10,ft:0},{ua:2,fa:2}),B:mk({an:'hip',x:106,y:114,t:-38,th:76,sh:-10,ft:0},{ua:2,fa:150})};
T.curl_preacher={env:`<rect x="110" y="100" width="18" height="26" rx="4" fill="#C9D3DA" transform="rotate(-18 119 113)"/>`,A:{an:'hip',x:96,y:112,t:22,th:88,sh:0,ft:0,ua:48,fa:70},B:{an:'hip',x:96,y:112,t:22,th:88,sh:0,ft:0,ua:48,fa:176}};
T.curl_conc={A:{an:'hip',x:100,y:112,t:44,th:76,sh:-4,ft:0,ua:6,fa:6},B:{an:'hip',x:100,y:112,t:44,th:76,sh:-4,ft:0,ua:6,fa:150}};
T.wristcurl={A:{an:'hip',x:92,y:112,t:46,th:76,sh:-4,ft:0,ua:56,fa:90},B:{an:'hip',x:92,y:112,t:46,th:76,sh:-4,ft:0,ua:56,fa:128}};
T.pushdown={cab:[120,10],env:E.tower(112,8),A:mk(ST,{x:92,ua:6,fa:150,t:6}),B:mk(ST,{x:92,ua:6,fa:6,t:6})};
T.overhead_ext={A:mk(ST,{ua:176,fa:-24}),B:mk(ST,{ua:176,fa:-180})};
T.overhead_cable={cab:[60,12],A:mk(ST,{ua:176,fa:-24,t:8}),B:mk(ST,{ua:176,fa:-176,t:8})};
T.skull={env:E.bench(34,148,118),A:mk(LIEB,{ua:178,fa:-100}),B:mk(LIEB,{ua:178,fa:-180})};
T.kickback={A:mk(HING,{ua:-78,fa:-8,t:66}),B:mk(HING,{ua:-78,fa:-96,t:66})};
/* CORE */
T.crunch={env:E.floorpad(30,150),A:{an:'hip',x:118,y:FLOOR-8,t:-90,th:140,sh:-14,ft:0,ua:-160,fa:-130},B:{an:'hip',x:118,y:FLOOR-8,t:-52,th:140,sh:-14,ft:0,ua:-120,fa:-170}};
T.situp=T.crunch;
T.cable_crunch={cab:[100,14],env:E.tower(92,10),A:{an:'knee',x:112,y:FLOOR-2,t:8,th:0,sh:-90,ua:120,fa:150,ft:90},B:{an:'knee',x:112,y:FLOOR-2,t:70,th:6,sh:-90,ua:70,fa:150,ft:90}};
T.machine_crunch={env:E.seat(100,118,78),A:mk(SEATP,{t:-8,ua:50,fa:150}),B:mk(SEATP,{t:44,ua:50,fa:150})};
T.reverse_crunch={env:E.floorpad(30,150),A:{an:'hip',x:118,y:FLOOR-8,t:-90,th:128,sh:70,ft:0,ua:-100,fa:-100},B:{an:'hip',x:116,y:FLOOR-16,t:-90,th:176,sh:130,ft:0,ua:-100,fa:-100}};
T.heels={env:E.floorpad(30,150),A:{an:'hip',x:118,y:FLOOR-8,t:-90,th:150,sh:150,ft:-90,ua:-100,fa:-100},B:{an:'hip',x:116,y:FLOOR-18,t:-90,th:178,sh:178,ft:-90,ua:-100,fa:-100}};
T.legraise={env:E.bar(70,150,32),A:mk(HANG,{ua:180,fa:180,th:0,sh:0,ft:70}),B:mk(HANG,{ua:180,fa:180,th:86,sh:88,ft:-70})};
T.kneeraise={env:E.bar(70,150,32),A:mk(HANG,{ua:180,fa:180,th:0,sh:0,ft:70}),B:mk(HANG,{ua:180,fa:180,th:88,sh:8,ft:70})};
T.plank={A:{an:'foot',x:100,y:FLOOR,ua:0,fa:90,ft:0,...plank(13)},B:{an:'foot',x:100,y:FLOOR-2,ua:0,fa:90,ft:0,...plank(15)}};
T.rollout={env:'',A:{an:'knee',x:112,y:FLOOR-2,t:10,th:0,sh:-90,ua:70,fa:70,ft:90},B:{an:'knee',x:112,y:FLOOR-2,t:80,th:-72,sh:-90,ua:98,fa:98,ft:90}};
T.woodchop={cab:[40,12],env:E.tower(32,10),A:mk(SC,{t:-6,ua:150,fa:150,ua2:150,fa2:150}),B:mk(SC,{t:22,ua:32,fa:36,ua2:32,fa2:36})};
T.sidebend={A:mk(ST,{t:-12,ua:4,fa:4}),B:mk(ST,{t:14,ua:4,fa:4})};
T.twist={A:mk(ST,{ua:-30,fa:160,ua2:-30,fa2:160}),B:mk(ST,{ua:-8,fa:160,ua2:-8,fa2:160,t:6})};
T.oblique_crunch=T.crunch;
/* ----- stretch and mobility templates ----- */
const QD={an:'hand',x:150,y:FLOOR,t:75,th:0,sh:-90,ua:0,fa:0,ft:90};
T.catcow={A:mk(QD,{t:72,hd:-32}),B:mk(QD,{t:80,hd:42})};
T.thoracic={A:mk(QD,{ua2:0,fa2:0}),B:mk(QD,{t:66,ua2:172,fa2:172,hd:-24})};
T.birddog={A:mk(QD,{th2:0,sh2:-90,ua2:0,fa2:0}),B:mk(QD,{t:80,th2:-88,sh2:-88,ua2:92,fa2:92})};
T.childs={A:{an:'knee',x:120,y:FLOOR-2,t:14,th:12,sh:-90,ua:0,fa:0,ft:90},B:{an:'knee',x:120,y:FLOOR-2,t:84,th:82,sh:-90,ua:88,fa:88,ft:90}};
const HF={an:'foot',x:150,y:FLOOR,th:88,sh:-10,th2:-8,sh2:-90,ft:0};
T.hipflex={A:mk(HF,{t:4,ua:0,fa:0}),B:mk(HF,{t:-8,ua:176,fa:176,hd:-14})};
T.wgs={A:mk(HF,{t:42,ua:14,fa:14}),B:mk(HF,{t:14,ua:176,fa:176,hd:-20})};
T.hamfold={A:mk(ST,{t:8,ua:2,fa:2}),B:mk(ST,{t:116,th:2,sh:2,ua:0,fa:0})};
T.squathold={A:mk(SQ,{t:42,th:88,sh:-40,ua:70,fa:20}),B:mk(SQ,{t:20,th:88,sh:-40,ua:48,fa:150})};
T.ankle={env:'<line x1="162" y1="30" x2="162" y2="152" stroke="#C9D3DA" stroke-width="5"/>',A:mk(ST,{x:104,t:8,ua:88,fa:88}),B:mk(ST,{x:104,t:20,th:40,sh:-28,ua:88,fa:88})};
T.neck={A:mk(ST,{ua:2,fa:2,hd:-42}),B:mk(ST,{ua:2,fa:2,hd:42})};
T.armcirc={A:mk(ST,{ua:2,fa:2,ua2:2,fa2:2}),B:mk(ST,{ua:178,fa:178,ua2:178,fa2:178})};
T.doorway={env:'<line x1="124" y1="30" x2="124" y2="152" stroke="#9FB0BC" stroke-width="6"/>',A:mk(ST,{x:96,ua:92,fa:178}),B:mk(ST,{x:96,t:16,th:6,sh:-6,ua:92,fa:178})};
T.chintuck={A:mk(ST,{ua:2,fa:2,hd:40}),B:mk(ST,{ua:2,fa:2,hd:-14})};
const CB={an:'hip',x:100,y:FLOOR-7,th:-88,sh:-88,ft:-30};
T.cobra={A:mk(CB,{t:82,ua:-70,fa:70}),B:mk(CB,{t:32,ua:0,fa:0,hd:-12})};
T.dog={A:{an:'foot',x:50,y:FLOOR,t:118,th:-12,sh:-10,ua:25,fa:25,ft:30},B:{an:'foot',x:50,y:FLOOR,t:128,th:-12,sh:-10,ua:22,fa:22,ft:30,hd:-16}};
const DB={an:'hip',x:112,y:FLOOR-8,t:-90,ft:0};
T.deadbug={env:E.floorpad(30,170),A:mk(DB,{th:162,sh:100,th2:162,sh2:100,ua:178,fa:178,ua2:178,fa2:178}),B:mk(DB,{th:162,sh:100,th2:100,sh2:96,ua:178,fa:178,ua2:-100,fa2:-100})};
T.quadstr={A:mk(ST,{ua:2,fa:2,th2:0,sh2:0}),B:mk(ST,{ua:2,fa:2,th2:0,sh2:-162,ua2:2,fa2:2})};
T.inchworm={A:T.hamfold.B,B:mk(ST,Object.assign({ua:0,fa:0},plank(26)))};
T.bwsquat={prop:'',A:mk(SQ,{ua:6,fa:6}),B:mk(SQ,{t:40,th:80,sh:-34,ua:86,fa:86})};
/* ---------- mapping ---------- */
const RULES=[
 [/gorilla|suspended oblique|knee raise on parallel/,'kneeraise'],[/hanging leg raise/,'legraise'],[/knee raise/,'kneeraise'],
 [/dead hang/,'hang'],[/scap pull/,'scap'],[/pull-up|chin-up/,'pullup'],
 [/straight-arm/,'straightarm'],[/standing pulldown|single-arm high cable row|underhand cable pulldown/,'pulldown_stand'],[/pulldown/,'pulldown'],
 [/seated.*row|cable row/,'row_seated'],[/chest-supported|45-degree|t-bar/,'row_support'],[/single-arm dumbbell row/,'row_support'],[/row/,'bentrow'],
 [/pullover/,'pullover'],
 [/incline.*fly/,'incline_fly'],[/dumbbell fly/,'bench_dbfly'],[/high-to-low/,'cable_fly_high_low'],[/crossover|bent-over cable fly|d2 flexion/,'cable_fly'],[/pec deck|reverse pec|reverse cable fly/,'pecdeck'],
 [/standing cable|kneeling x/,'cable_press'],[/leverage|machine chest|machine shoulder/,'machine_press'],
 [/decline bench/,'decline'],[/incline.*(press|bench)|landmine/,'incline'],[/bench press|underhand chest|static dumbbell/,'bench'],
 [/bench dip/,'bench_dip'],[/dip/,'dip'],[/feet-elevated pushup/,'pushup_feet'],[/incline pushup|incline twisting/,'pushup_incline'],[/pushup|push-up/,'pushup'],[/jackhammer|pressdown|pushdown|triceps pushdown/,'pushdown'],
 [/skullcrusher|lying triceps|cable lying/,'skull'],[/kickback/,'kickback'],[/triceps extension|overhead.*extension|cable overhead|single-arm cable extension/,'overhead_ext'],
 [/preacher/,'curl_preacher'],[/incline curl/,'curl_incline'],[/concentration/,'curl_conc'],[/wrist curl/,'wristcurl'],[/cable curl|high cable curl|reverse-grip cable curl|behind-back/,'curl_cable'],[/curl/,'curl'],
 [/romanian|stiff/,'rdl'],[/deadlift|rack pull/,'deadlift'],[/back extension/,'backext'],
 [/goblet/,'goblet'],[/front squat/,'squat_front'],[/box squat/,'box_squat'],[/squat jump|lunge jump|split squat jump/,'lunge_jump'],[/bulgarian/,'bulgarian'],[/step-up/,'stepup'],[/lunge/,'lunge'],[/^squat/,'squat'],[/box jump|lateral bound/,'boxjump'],
 [/leg press calf|calf raise.*seated|seated calf/,'calf_seated'],[/calf raise/,'calf'],[/leg press/,'leglpress'],[/leg extension/,'legext'],[/seated leg curl/,'legcurl_seated'],[/lying leg curl|leg curl/,'legcurl_lying'],
 [/hip thrust/,'hipthrust'],[/bridge/,'bridge'],[/kettlebell swing/,'kbswing'],
 [/burpee/,'burpee'],[/sprint|running/,'run'],[/mountain/,'climber'],[/jump rope/,'jumprope'],[/medicine ball slam/,'slam'],[/battle rope/,'battle'],
 [/arnold/,'arnold'],[/seated.*(press|shoulder)|machine shoulder/,'ohp_seated'],[/press|high pull/,'ohp'],[/front raise/,'front_raise'],[/upright row|high pull/,'upright'],[/shrug/,'shrug'],
 [/face pull/,'facepull'],[/external rotation/,'extrot'],[/bent-over lateral|rear delt|seated rear/,'reardelt_bent'],[/lateral raise|y-raise|burnout/,'lateral'],
 [/cable crunch|rope crunch/,'cable_crunch'],[/machine crunch/,'machine_crunch'],[/reverse crunch/,'reverse_crunch'],[/heels to heaven/,'heels'],[/sit-up|crunch/,'crunch'],[/roll-out|rollout/,'rollout'],[/plank/,'plank'],
 [/woodchop|roundhouse/,'woodchop'],[/side bend/,'sidebend'],[/twist/,'twist']
];
function tplFor(ex){
  if(ex.tpl&&T[ex.tpl])return T[ex.tpl];
  const n=ex.n.toLowerCase();
  for(const [re,id] of RULES){if(re.test(n)&&T[id]){let t=T[id];
    if(id==='front_raise'&&/alternating/.test(n))t=T.front_alt;
    return t}}
  return null;
}
function frameSvg(ex,e,w,h){
  const t=tplFor(ex);
  const inner=t?figureSvg(ex,t,e):'<text x="110" y="85" text-anchor="middle" font-size="12" fill="#5B6B78">No animation yet</text>';
  return `<svg class="anim" data-id="${ex.id}" viewBox="6 14 208 144" ${w?`width="${w}" height="${h}"`:''} role="img" aria-label="${esc(ex.n)} movement">${inner}</svg>`;
}
const easeIO=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function cycleE(ms){const c=(ms%2800)/2800;if(c<.1)return 0;if(c<.5)return easeIO((c-.1)/.4);if(c<.6)return 1;return easeIO(1-(c-.6)/.4)}
function animLoop(ts){
  const els=document.querySelectorAll('svg.anim[data-live]');
  if(els.length){const e=cycleE(ts);els.forEach(el=>{const ex=EXB[el.dataset.id];const t=ex&&tplFor(ex);if(t)el.innerHTML=figureSvg(ex,t,el.dataset.still?+el.dataset.still:e)})}
  requestAnimationFrame(animLoop);
}
if(typeof requestAnimationFrame!=='undefined'&&!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(animLoop);
