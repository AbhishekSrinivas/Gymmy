/* ===== Updates from GitHub =====
   The app downloads the newest web files from the repo and applies them on the next start.
   Changes to the Android shell (permissions, plugins) still need a new APK. */
const APK_URL='https://github.com/AbhishekSrinivas/Gymmy/releases/download/latest/Gymmy.apk';
const IS_NATIVE=(()=>{try{const C=window.Capacitor;return !!(C&&C.isNativePlatform&&C.isNativePlatform())}catch(e){return false}})();
const OTA={repo:'AbhishekSrinivas/Gymmy',branch:'main',st:'idle',msg:'',latest:0};
const otaUrl=f=>`https://raw.githubusercontent.com/${OTA.repo}/${OTA.branch}/www/${f}?t=${Date.now()}`;
function otaPending(){try{const o=JSON.parse(localStorage.getItem('gymmy.ota')||'null');return o&&o.build>BUILD?o.build:0}catch(e){return 0}}
async function otaCheck(auto){
  if(OTA.st==='busy')return;
  const pend=otaPending();if(pend){OTA.st='ready';OTA.latest=pend;OTA.msg='Build '+pend+' is downloaded. Restart to use it.';if(!auto)render();return}
  OTA.st='busy';OTA.msg='Checking GitHub...';if(!auto)render();
  try{
    const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),12000);
    const v=await (await fetch(otaUrl('version.json'),{cache:'no-store',signal:ctl.signal})).json();
    OTA.latest=+v.build||0;
    if(!(OTA.latest>BUILD)){OTA.st='ok';OTA.msg='You have the newest version (build '+BUILD+').'}
    else{
      OTA.msg='Downloading build '+OTA.latest+'...';if(!auto)render();
      const html=await (await fetch(otaUrl('index.html'),{cache:'no-store',signal:ctl.signal})).text();
      clearTimeout(to);
      if(html.length<200000||!html.includes('<title>Gymmy</title>')||!html.includes('const BUILD='+OTA.latest+';'))throw new Error('bad file');
      localStorage.setItem('gymmy.ota',JSON.stringify({build:OTA.latest,html}));
      OTA.st='ready';OTA.msg='Build '+OTA.latest+' is downloaded. Restart to use it.';
      if(auto)toast('Update ready. Open the menu, then App updates.',5000);
    }
    clearTimeout(to);
  }catch(e){OTA.st='err';OTA.msg=navigator.onLine===false?'You are offline.':'Could not reach GitHub. Try again later.'}
  try{localStorage.setItem('gymmy.ota.chk',String(Date.now()))}catch(e){}
  render();
}
function otaApply(){location.reload()}
function otaAuto(){try{if(window.claude)return;const last=+localStorage.getItem('gymmy.ota.chk')||0;if(Date.now()-last>12*3600000&&navigator.onLine!==false)otaCheck(true)}catch(e){}}
function otaOk(){try{localStorage.setItem('gymmy.ota.ok',String(BUILD))}catch(e){}}
function updateSheet(){
  const rdy=OTA.st==='ready';
  return SH('App updates',`<div class="card stack" style="gap:6px"><div><b>Installed</b> build ${BUILD}</div>${OTA.latest>BUILD||OTA.msg?`<div class="sub">${esc(OTA.msg||'')}</div>`:'<div class="sub">Tap check to look for a newer build on GitHub.</div>'}</div>
  ${rdy?'<button class="btn lime" data-a="otaapply">Restart to apply update</button>':`<button class="btn" data-a="otacheck" ${OTA.st==='busy'?'disabled':''}>${OTA.st==='busy'?'Checking...':'Check for updates'}</button>`}
  <div class="note g">Your workouts, profiles and settings stay on your phone. An update only replaces the app itself.</div>
  <div class="sub">The app checks by itself about twice a day when you are online. Updates come from github.com/${OTA.repo}. If a release changes the Android app itself, <a href="https://github.com/${OTA.repo}/releases/download/latest/Gymmy.apk" download target="_blank" rel="noopener" style="color:var(--grn);font-weight:700">download the new APK</a> and install it over this one.</div>`);
}
