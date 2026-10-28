/* ===== Decor: extra icons and automatic icon labels ===== */
Object.assign(IC,{
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
 list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.200 6.400 20.200l1.100-6.200L3 9.600l6.200-.9z"/>',
 building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01"/>',
 pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 scale:'<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M8 9a5 4 0 0 1 8 0M12 9l2-2"/>',
 hand:'<path d="M8 12V5.500a1.500 1.500 0 0 1 3 0V11M11 10V4.500a1.500 1.500 0 0 1 3 0V11M14 10V6a1.500 1.500 0 0 1 3 0v7a7 7 0 0 1-7 7h-1a5 5 0 0 1-4-2l-2-3a1.500 1.500 0 0 1 2.500-1.500L8 15"/>',
 trendu:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
 sparkle:'<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800zM19 17l.7 1.800L21.500 19.500l-1.800.7L19 22l-.7-1.800-1.800-.7 1.800-.7z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
 upload:'<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
 heart:'<path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.800A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
 repeat:'<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 users:'<circle cx="9" cy="8" r="3.500"/><path d="M2 20c0-3.500 3-6 7-6s7 2.500 7 6M17 5a3.500 3.500 0 0 1 0 7M18 14c2.500.6 4 2.500 4 5"/>',
 camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.500"/>',
 undo:'<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
 drop:'<path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z"/>',
 stretch:'<circle cx="12" cy="4.500" r="2"/><path d="M12 7v6M5 9l7 2 7-2M9 21l3-8 3 8"/>',
 leaf:'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c2-5 5-8 9-10"/>',
 flagi:'<path d="M5 21V4M5 4h13l-2 4 2 4H5"/>'
});
/* label text (lowercase, trimmed) -> icon */
const TXI=[
 [/^start workout|^start$|^let.?s go|^start morning/,'play'],[/^edit workout|^edit$/,'pencil'],[/^done editing|^done$|^save$|^save changes/,'check'],
 [/^add exercise|^add$|^create|^new /,'plus'],[/^add session/,'layers'],[/^save as/,'save'],[/^swap/,'swap'],[/^delete|^remove/,'trash'],
 [/^cancel|^not now|^skip/,'close'],[/^gym$/,'building'],[/^home$/,'home'],[/^bulk$/,'trendu'],[/^shred$/,'flame'],[/^maintain$/,'shield'],
 [/^favorites/,'lib'],[/^exercises$/,'curl'],[/^specialty$/,'layers'],[/^programs$/,'week'],[/^focus$/,'target'],
 [/^targets$|^what this trains|^feel it in/,'target'],[/^grip and stance|^grip/,'hand'],[/^how to$|^how$|^in order|^quick guide$/,'list'],[/^similar moves/,'swap'],
 [/^where are you training|^where today/,'pin'],[/^goal$|^what is your goal/,'target'],[/^setup$/,'gear'],[/^units$/,'scale'],[/^nudges$/,'bell'],[/^water goal/,'glass'],[/^length$/,'timer'],
 [/^lb first|^kg first/,'scale'],[/^funny$/,'sparkle'],[/^plain$/,'info'],[/^off$/,'moon'],[/^quit/,'close'],[/^next|^continue/,'chev'],[/^finish|^complete/,'trophy'],
 [/^export|^backup/,'download'],[/^import|^restore/,'upload'],[/^reset/,'undo'],[/^equipment/,'lib'],[/^water/,'glass'],[/^morning/,'sun'],[/^profile/,'user'],[/^reminders?/,'bell'],
 [/^milestones?|^badges?/,'trophy'],[/^preferences|^settings/,'gear'],[/^summary|^weekly summary/,'chart'],[/^show tips|^tips/,'sparkle'],[/^cardio/,'run'],[/^stretch/,'warrior']
];
function _icFor(t){t=t.trim().toLowerCase();if(!t||t.length>34)return null;for(const [re,n] of TXI)if(re.test(t))return n;return null}
function decorate(){
  const root=document.getElementById('root');if(!root)return;
  root.querySelectorAll('.btn,.chip:not(.sm),.seg button,.tabs button,.sec,.drawer button,.sheet h2,.sheet .h1').forEach(el=>{
    if(el.querySelector('svg')||el.dataset.dec||el.querySelector('.th,.avatar,input'))return;
    if(el.children.length>1)return;
    const n=_icFor(el.textContent);if(!n)return;el.dataset.dec='1';
    const isSec=el.classList.contains('sec');
    const s=document.createElement('span');s.className='dic'+(isSec?' sq':'');s.innerHTML=ico(n,isSec?14:el.classList.contains('btn')?20:16,'currentColor',isSec?2.2:2);
    if(isSec)el.classList.add('hasic');
    el.insertBefore(s,el.firstChild);
  });
}
