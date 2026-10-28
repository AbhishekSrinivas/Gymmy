/* Cloud sync of profiles and progress (artifact db, private to the signed-in owner) */
const SYNC={db:null,uid:null,state:'off',ready:false,tm:null,tmU:null,busy:false,busyU:false,last:0};
const CH=180000;
const sCol=()=>SYNC.db.collection('data/users/'+SYNC.uid);
function setSync(s){SYNC.state=s;const e=document.getElementById('syncst');if(e)e.textContent=syncLabel()}
function syncLabel(){return SYNC.state==='on'?'Synced to your account'+(SYNC.last?' at '+new Date(SYNC.last).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):''):SYNC.state==='busy'?'Syncing...':SYNC.state==='err'?'Sync paused, will retry':'Sync is off. Open this page signed in to claude.ai to keep progress across devices.'}
async function syncInit(){
  try{
    const c=window.claude;if(!c||!c.use)return;
    const db=await c.use('db'),user=await c.use('user');if(!db||!user)return;
    const uid=await user.id();if(!uid)return;
    SYNC.db=db;SYNC.uid=uid;setSync('busy');
    await pullUsers();await pullCur();
    SYNC.ready=true;setSync('on');SYNC.last=Date.now();
    // push anything newer that exists locally only
    syncPush(true);syncPushUsers(true);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{doPush();syncPushUsers(true)}catch(e){}}});
    addEventListener('pagehide',()=>{try{doPush();syncPushUsers(true)}catch(e){}});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&SYNC.ready&&!UI.play){pullUsers().then(ch=>{if(ch)render()}).catch(()=>{});pullCur().then(ch=>{if(ch)render()}).catch(()=>{})}});
    setInterval(()=>{if(document.visibilityState==='visible'&&SYNC.ready&&!UI.play&&UI.screen!=='morning')pullUsers().then(ch=>{if(ch)render()}).catch(()=>{})},20000);
    render();
  }catch(e){setSync('err')}
}
/* Profiles merge by id instead of last-write-wins, so a profile made on one device never wipes another device's list. */
function mergeUsers(r){
  const before=JSON.stringify([U.list,U.gone||[]]);
  const gone=new Set([...(U.gone||[]),...((r&&r.gone)||[])]);
  const loc=new Map(U.list.map(x=>[x.id,x]));const out=[];const seen=new Set();
  const rl=(r&&Array.isArray(r.list))?r.list:[];
  rl.forEach(x=>{if(gone.has(x.id)||seen.has(x.id))return;seen.add(x.id);const l=loc.get(x.id);out.push(l&&(l.t||0)>(x.t||0)?l:(l?Object.assign({},l,x):x))});
  U.list.forEach(x=>{if(gone.has(x.id)||seen.has(x.id))return;seen.add(x.id);out.push(x)});
  if(out.length){U.list=out.slice(0,MAXU+5)}
  U.gone=[...gone].slice(-60);if(!U.list.find(u=>u.id===U.cur))U.cur=U.list[0].id;KEY=keyFor(U.cur);
  return JSON.stringify([U.list,U.gone])!==before;
}
async function pullUsers(){
  const s=await sCol().doc('gm_users').get();if(!s.exists)return false;
  const r=s.data();if(!r)return false;
  const ch=mergeUsers(r);
  if(ch){try{localStorage.setItem(UKEY,JSON.stringify(U))}catch(e){}}
  return ch;
}
async function pullCur(){
  const id=U.cur;const s=await sCol().doc('gm_'+id).get();if(!s.exists)return false;
  const m=s.data();if(!m||(m.t||0)<=(S._t||0))return false;
  let str='';for(let i=0;i<(m.n||0);i++){const c=await sCol().doc('gm_'+id+'_'+i).get();if(!c.exists)return false;str+=c.data().d}
  if(str.length!==m.len)return false;
  const o=JSON.parse(str);if(!o||!Array.isArray(o.logs))return false;
  if(id!==U.cur)return false;
  S=Object.assign(DEFAULT_STATE(),o);S.set=Object.assign(DEFAULT_STATE().set,o.set||{});S.tour=Object.assign({},S.tour,TSEEN);S._t=m.t;restoreGoal();migrate();
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  return true;
}
function syncPush(now){
  if(!SYNC.ready)return;clearTimeout(SYNC.tm);SYNC.tm=setTimeout(doPush,now?50:2500);
}
async function doPush(){
  if(SYNC.busy){SYNC.tm=setTimeout(doPush,1500);return}
  if(!S._t){return}
  SYNC.busy=true;const id=U.cur,t=S._t;
  try{
    const m=await sCol().doc('gm_'+id).get();if(m.exists&&(m.data().t||0)>=t){return}
    setSync('busy');const str=JSON.stringify(S);const n=Math.ceil(str.length/CH)||1;
    for(let i=0;i<n;i++)await sCol().doc('gm_'+id+'_'+i).set({d:str.slice(i*CH,(i+1)*CH)});
    await sCol().doc('gm_'+id).set({t,n,len:str.length});
    SYNC.last=Date.now();setSync('on');
  }catch(e){setSync('err');SYNC.tm=setTimeout(doPush,15000)}finally{SYNC.busy=false}
}
function syncPushUsers(now){
  if(!SYNC.ready)return;clearTimeout(SYNC.tmU);SYNC.tmU=setTimeout(doPushU,now?50:1200);
}
async function doPushU(){
  if(SYNC.busyU){SYNC.tmU=setTimeout(doPushU,1500);return}
  SYNC.busyU=true;
  try{const m=await sCol().doc('gm_users').get();if(m.exists){const ch=mergeUsers(m.data());if(ch){try{localStorage.setItem(UKEY,JSON.stringify(U))}catch(e){}render()}}
    await sCol().doc('gm_users').set({list:U.list,gone:U.gone||[],t:Date.now()});setSync('on')}
  catch(e){setSync('err');SYNC.tmU=setTimeout(doPushU,15000)}finally{SYNC.busyU=false}
}
async function syncDelete(id){
  if(!SYNC.ready)return;
  try{const m=await sCol().doc('gm_'+id).get();const n=m.exists?(m.data().n||0):0;for(let i=0;i<n;i++)await sCol().doc('gm_'+id+'_'+i).delete();await sCol().doc('gm_'+id).delete()}catch(e){}
}
async function syncSwitched(){
  if(!SYNC.ready)return;
  try{const ch=await pullCur();if(ch){render()}else syncPush()}catch(e){}
}
