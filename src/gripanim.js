/* ===== Animated grip diagrams: hand wrapping the handle + hand width on the bar ===== */
function gripKind(ex,d){
  const t=((d.g||'')+' '+(ex.g||[]).join(' ')).toLowerCase();
  let o='over';
  if(/underhand|supinat|palms? (face|facing) (up|you|the ceiling)|palms up|reverse/.test(t)&&!/overhand/.test(t))o='under';
  else if(/neutral|facing each other|palms? (face|facing) in|hammer|rope|v-bar/.test(t)&&!/overhand/.test(t))o='neutral';
  let w='mid',dx=0;
  if(/much wider|\bwide\b|wide-grip/.test(t)){w='wide';dx=34}
  else if(/wider than shoulder/.test(t)){w='wide';dx=20}
  else if(/close|narrow|hands together|diamond|inside/.test(t)){w='close';dx=-22}
  const nm=ex.n.toLowerCase();
  if(/hammer|neutral grip|rope|v-bar|farmer/.test(nm))o='neutral';else if(/reverse.*curl|curl.*reverse|pronated/.test(nm))o='over';else if(/chin-?up|underhand|supinated/.test(nm))o='under';else if(/pull-?up|pullup/.test(nm)&&!/chin|neutral|close/.test(nm))o='over';
  return {o,w,dx,hasW:/shoulder|wide|close|narrow|width|apart/.test(t)};
}
function gripHoldSvg(o,opt){opt=opt||{};
  const rot=o==='neutral'?' rotate(-90 96 64)':'';const flip=o==='under'?' translate(0 128) scale(1 -1)':'';
  const tr=`transform="${flip}${rot}"`.replace('"  ','"');
  return `<svg class="gsvg" viewBox="0 0 160 128" role="img" aria-label="Hand wrapping the handle">
  <rect width="160" height="128" rx="14" fill="#F1F6F8"/>
  <g ${tr}>
   <rect x="-4" y="43" width="66" height="15" rx="7" fill="#1B2A33"/>
   <rect x="56" y="38" width="42" height="20" rx="9" fill="#1B2A33"/>
   <path d="M98 50 L130 50" stroke="#1B2A33" stroke-width="9" stroke-linecap="round" fill="none"><animate attributeName="d" dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.18;.5;.82;1" keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1" values="M98 50 L130 50;M98 50 L130 50;M98 50 C118 50 118 80 98 80;M98 50 C118 50 118 80 98 80;M98 50 L130 50"/></path>
   <circle cx="96" cy="64" r="9.500" fill="#C8F169" stroke="#2C3A10" stroke-width="2"/>
   <path d="M80 56 L62 76" stroke="#2C4A5A" stroke-width="9" stroke-linecap="round" fill="none">${opt.nothumb?'':'<animate attributeName="d" dur="3.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.18;.5;.82;1" keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1" values="M80 56 L62 76;M80 56 L62 76;M80 56 C78 84 92 86 102 80;M80 56 C78 84 92 86 102 80;M80 56 L62 76"/>'}</path>
  </g>${opt.bad?'<circle cx="140" cy="20" r="13" fill="#B3412F"/><path d="M134 14l12 12M146 14l-12 12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>':''}</svg>`;
}
function gripWidthSvg(k){
  const base=36,dx=k.dx;
  const hand=(side)=>{const x=100+side*base,m=side*dx;return `<g><animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.15;.5;.8;1" keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1" values="0 0;0 0;${m} 0;${m} 0;0 0"/><rect x="${x-8}" y="52" width="16" height="16" rx="6" fill="#1B2A33"/><rect x="${x-8}" y="${k.o==='under'?60:49}" width="16" height="7" rx="3" fill="#C8F169"/></g>`};
  return `<svg class="gsvg" viewBox="0 0 200 128" role="img" aria-label="Hand width on the bar">
  <rect width="200" height="128" rx="14" fill="#F1F6F8"/>
  <circle cx="100" cy="22" r="10" fill="#1B2A33"/>
  <path d="M62 44 Q100 30 138 44 L132 100 L68 100 Z" fill="#1B2A33" opacity=".9"/>
  <path d="M64 40 L64 116M136 40 L136 116" stroke="#9AA9B3" stroke-width="1.200" stroke-dasharray="3 4"/>
  <rect x="6" y="58" width="188" height="6" rx="3" fill="#C8F169" stroke="#2C3A10" stroke-width="1.500"/>
  <rect x="2" y="48" width="8" height="26" rx="3" fill="#2C3A10"/><rect x="190" y="48" width="8" height="26" rx="3" fill="#2C3A10"/>
  ${hand(-1)}${hand(1)}
  <text x="100" y="120" text-anchor="middle" font-size="10" font-weight="700" fill="#4E7A12">${k.w==='wide'?'Wider than shoulders':k.w==='close'?'Narrower than shoulders':'About shoulder width'}</text>
  </svg>`;
}
function gripAnim(ex,d){
  if(ex.eq==='bw'&&!/bar|rings|handle|strap/i.test(d.g||''))return '';
  const k=gripKind(ex,d);
  const lab={over:'Overhand: palms face away or down',under:'Underhand: palms face you or up',neutral:'Neutral: palms face each other'}[k.o];
  return `<div class="ganim"><div class="gcell">${gripHoldSvg(k.o)}<div class="gcap">${lab}. Fingers wrap, thumb closes around the handle.</div></div>${k.hasW||ex.eq==='bb'||ex.eq==='smith'||ex.eq==='cable'?`<div class="gcell">${gripWidthSvg(k)}<div class="gcap">Set your hands to this spacing.</div></div>`:''}</div>`;
}
/* thumbless variant: thumb stays beside the fingers, drawn without animation */
function gripHoldBad(o){return gripHoldSvg(o,{nothumb:1,bad:1}).replace('M80 56 L62 76','M80 55 L112 55')}
/* two-hand mixed grip */
function gripMixedSvg(){return `<svg class="gsvg" viewBox="0 0 160 128"><rect width="160" height="128" rx="14" fill="#F1F6F8"/><g transform="translate(4 28) scale(.58)">${gripHoldSvg('over').replace(/<svg[^>]*>|<\/svg>|<rect width="160"[^>]*>/g,'')}</g><g transform="translate(84 28) scale(.58)">${gripHoldSvg('under').replace(/<svg[^>]*>|<\/svg>|<rect width="160"[^>]*>/g,'')}</g></svg>`}
const PRI={biceps:'arm',forearms:'arm',triceps:'push',chest:'push',frontdelt:'push',sidedelt:'push',lats:'pull',midback:'pull',reardelt:'pull',traps:'pull'};
function gripEffect(ex,v){
  const P=PRI[ex.p[0]]||'',pt=ex.pt;
  if(P==='arm'&&ex.p[0]==='biceps')return {under:'Biceps peak and inner head.',neutral:'Brachialis and forearm. Thicker looking arm.',over:'Forearms and outer arm. Go lighter.',mixed:''}[v];
  if(pt==='pull'||P==='pull')return {under:'More biceps help and lower lats.',over:'Lats and upper back do most of the work.',neutral:'Easiest on shoulders and elbows, strong lat pull.',mixed:''}[v];
  if(pt==='push'||P==='push')return {over:'Standard. Most chest and shoulder work.',neutral:'Kinder on shoulders. Elbows tuck in naturally.',under:'Reverse grip. Light weight only, it stresses the shoulder.',mixed:''}[v];
  if(pt==='hinge')return {over:'Safe default. Switch to straps before your grip fails.',mixed:'Holds heavier loads but twists the body. Alternate the hands each set.',neutral:'',under:''}[v];
  return {over:'',under:'',neutral:'',mixed:''}[v]||'';
}
function gripOptions(ex,d,k){
  const t=(ex.g||[]).join(' ').toLowerCase();const set=[k.o];
  const add=v=>{if(!set.includes(v))set.push(v)};
  if(/underhand|reverse|supinat/.test(t))add('under');if(/neutral|hammer|rope|v-bar/.test(t))add('neutral');if(/overhand|pronat|wide|medium|standard/.test(t))add('over');
  const eq=ex.eq,pt=ex.pt;
  if(set.length<2){
    if(pt==='pull'&&['db','cable','bb','smith','other','mach'].includes(eq)){add('over');add('under');if(eq!=='bb'&&eq!=='smith')add('neutral')}
    else if(pt==='push'&&eq==='db'){add('neutral');add('over')}
  }
  if(pt==='hinge'&&(eq==='bb'||eq==='db'||eq==='other')&&!set.includes('mixed'))set.push('mixed');
  if(eq==='bw'&&!/bar|ring|handle|strap/i.test(d.g||''))return [];
  return set;
}
function gripVariants(ex,d,k){
  const opts=gripOptions(ex,d,k);if(!opts.length)return '';
  const nm={over:'Overhand',under:'Underhand',neutral:'Neutral',mixed:'Mixed'};
  const cap={over:'Palms face down or away',under:'Palms face up or toward you',neutral:'Palms face each other',mixed:'One palm in, one out'};
  const cell=(v)=>{const cur=v===k.o,svg=v==='mixed'?gripMixedSvg():gripHoldSvg(v);
    return `<div class="gv${cur?' cur':''}">${svg}<div class="gvh"><b>${nm[v]}</b><span class="gtag ${cur?'use':'alt'}">${cur?'Use this':'Option'}</span></div><div class="gcap">${cap[v]}.</div><div class="gcap">${esc(gripEffect(ex,v)||'')}</div></div>`};
  const bad=(['bb','smith','db'].includes(ex.eq)&&(ex.pt==='push'||ex.pt==='pull'))?`<div class="gv bad">${gripHoldBad(k.o)}<div class="gvh"><b>Thumbless</b><span class="gtag no">Avoid</span></div><div class="gcap">Thumb on the same side as the fingers. The bar or dumbbell can roll out of your hand onto you.</div></div>`:'';
  return `<div><div class="sec" style="padding:0">All the grips</div><div class="gvs">${opts.map(cell).join('')}${bad}</div></div>`;
}
/* dumbbell horizontal vs vertical */
function dbOrientSvg(vert){
  const db=`<g><rect x="76" y="76" width="48" height="8" rx="3" fill="#8B97A0"/><rect x="62" y="60" width="14" height="40" rx="5" fill="#1B2A33"/><rect x="124" y="60" width="14" height="40" rx="5" fill="#1B2A33"/></g>`;
  const rot=`<animateTransform attributeName="transform" type="rotate" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.2;.45;.7;1" keySplines=".4 0 .2 1;.4 0 .2 1;.4 0 .2 1;.4 0 .2 1" values="0 100 80;0 100 80;90 100 80;90 100 80;0 100 80"/>`;
  return `<svg class="gsvg" viewBox="0 0 200 170" role="img" aria-label="Dumbbell horizontal and vertical"><rect width="200" height="170" rx="14" fill="#F1F6F8"/>
  <rect x="90" y="96" width="20" height="74" rx="8" fill="#2C4A5A"/>
  <g>${rot}${db}<rect x="88" y="66" width="24" height="28" rx="10" fill="#1B2A33"/><rect x="92" y="70" width="16" height="6" rx="3" fill="#C8F169"/></g>
  <text x="10" y="18" font-size="9.5" font-weight="700" fill="${vert?'#8895A0':'#4E7A12'}">Horizontal: palms down or up</text><text x="10" y="32" font-size="9.5" font-weight="700" fill="${vert?'#4E7A12':'#8895A0'}">Vertical: palms face each other</text>
  <text x="190" y="162" text-anchor="end" font-size="9.5" font-weight="700" fill="#4E7A12">This move: ${vert?'vertical':'horizontal'}</text></svg>`;
}
function dbOrient(ex,d,k){
  if(ex.eq!=='db'&&ex.eq!=='kb')return '';
  const t=((d.g||'')+' '+(d.p||'')).toLowerCase();
  const vert=k.o==='neutral'||/upright|vertical|cupped|goblet|hammer|top plate/.test(t);
  return `<div><div class="sec" style="padding:0">Dumbbell direction</div><div class="gcell" style="margin-top:6px">${dbOrientSvg(vert)}<div class="gcap">${vert?'Hold it vertical, like a hammer. Palms face each other and the handle runs up and down. Keep your wrist straight, do not let the top plate tip over.':'Hold it horizontal, across your body. Palms face down or up and the handle runs left to right. Keep the plates level, do not let one end drop.'}</div></div></div>`;
}
/* safety checklist */
function safetyItems(ex,d,k){
  const L=[],eq=ex.eq,pt=ex.pt,P=ex.p[0],n=ex.n.toLowerCase();
  L.push('Warm up first: 1 or 2 light sets of this move before working weight.');
  if(eq!=='bw')L.push('Keep your wrist straight and stacked over your forearm. A bent wrist is how wrists and elbows get hurt.');
  if(['bb','smith','db','cable','other','kb'].includes(eq))L.push('Thumb wrapped around the handle every rep. Thumbless grips slip.');
  if(eq==='bb'||eq==='smith')L.push('Put collars on the bar and load the plates evenly on both sides.');
  if((eq==='bb'||eq==='smith')&&(pt==='push'||pt==='squat')&&!/curl|row|raise/.test(n))L.push('Set the safety pins or safety arms at a height just below your lowest point, or train with a spotter. Never go heavy alone without them.');
  if(eq==='db')L.push('Lift dumbbells to your start position with your thighs, not by swinging. Lower them to your thighs, then the floor. Never drop them from overhead.');
  if(eq==='cable')L.push('Check the pin and the attachment are fully locked before the first rep. Step back with control, do not let the stack slam.');
  if(eq==='mach')L.push('Adjust the seat so your joints line up with the machine pivot. Push the weight pin all the way in.');
  if(eq==='band')L.push('Check the band for nicks or cracks. Anchor it firmly and keep it away from your face if it slips.');
  if(eq==='bw')L.push('Use a non-slip floor or mat. Set your hands and feet before you move.');
  if(pt==='push')L.push('Keep your elbows about 45 degrees from your body, not flared out to 90. Flared elbows strain the shoulder.');
  if(pt==='pull')L.push('Pull your shoulder blades down and back before you pull with the arms. No swinging or jerking the weight.');
  if(pt==='squat')L.push('Knees follow the line of your toes, heels stay down, chest stays up. Do not let the knees cave in.');
  if(pt==='hinge')L.push('Flat back the whole time. Push your hips back, keep the weight close to your legs. Stop the set if your lower back rounds.');
  if(pt==='lunge')L.push('Take a step long enough that the front knee stays over the middle of your foot. Keep your torso upright.');
  if(pt==='core')L.push('Do not pull on your neck. Breathe out as you tighten, and keep your lower back from arching hard.');
  if(/overhead|shoulder press|military/.test(n))L.push('Press in front of the face, never behind the neck. Brace your abs and do not lean back.');
  if(P==='biceps'||P==='triceps')L.push('Keep the elbows still. Locking out hard on every rep stresses the elbow joint, so stop just short of locked.');
  if(P==='lowback')L.push('Move slowly and stop short of the top. Do not overextend your back.');
  L.push('Breathe out on the hard part, in on the easy part. Do not hold your breath for long.');
  if(d.m)L.push('Common mistake to avoid: '+d.m.replace(/\.$/,'')+'.');
  return L.slice(0,11);
}
function safetyCard(ex,d,k){
  const L=safetyItems(ex,d,k);
  return `<div><div class="sec" style="padding:0">Stay safe</div><ul class="safe">${L.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="note" style="margin-top:8px;background:var(--redb);color:#7A2A1D">Stop and rest if you feel sharp, pinching or joint pain, numbness, dizziness, or your form falls apart. Muscle burn is normal. Joint pain is not. Drop the weight before you drop the form.</div></div>`;
}
