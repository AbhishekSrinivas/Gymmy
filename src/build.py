"""Builds www/index.html (the file the Android app loads) from the sources in this folder."""
import os,subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
ex=open('exercises.json').read()
css=open('style.css').read()
FILES=['progs.js','core.js','anim.js','guide.js','gripanim.js','stretch.js','tour.js','ui1.js','ui2.js','ui3.js','progress.js','sched.js','deco.js','sync.js','main.js']
js='\n'.join(open(f).read() for f in FILES)
BANNER=r'''<script>window.addEventListener("error",function(e){var r=document.getElementById("root");if(r&&!r.innerHTML.trim())r.innerHTML="<div style=\"padding:24px;font:14px system-ui\"><b>Gymmy hit an error.</b><br>"+String(e.message)+"</div>"})</script>'''
FONTS="""@font-face{font-family:'DM Sans';font-weight:400;font-style:normal;font-display:swap;src:url(fonts/dm-sans-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:500;font-style:normal;font-display:swap;src:url(fonts/dm-sans-latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'DM Sans';font-weight:700;font-style:normal;font-display:swap;src:url(fonts/dm-sans-latin-700-normal.woff2) format('woff2')}
@font-face{font-family:'Barlow Condensed';font-weight:700;font-style:normal;font-display:swap;src:url(fonts/barlow-condensed-latin-700-normal.woff2) format('woff2')}"""
html=f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F3F6F8">
<title>Gymmy</title>
<style>
{FONTS}
html{{color-scheme:light dark}}
body{{margin:0}}
:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
{css}
</style></head><body>
<div id="root"></div>
{BANNER}
<script>
const EX={ex};
{js}
</script>
</body></html>"""
os.makedirs('../www',exist_ok=True)
open('_chk.js','w').write('const EX=[];\n'+js)
assert subprocess.run(['node','--check','_chk.js']).returncode==0,'syntax error'
os.remove('_chk.js')
open('../www/index.html','w').write(html)
print('built www/index.html',len(html),'bytes')
