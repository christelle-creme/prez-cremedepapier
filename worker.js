const common={'Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline' https://esm.sh; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src 'self'; frame-ancestors 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'",'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN'}
const respond=(body,status=200,type='text/plain; charset=utf-8',extra={})=>new Response(body,{status,headers:{...common,'Content-Type':type,...extra}})
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const css=`@font-face{font-family:Cormorant;src:url('/brand/2.ttf')}@font-face{font-family:Chanel;src:url('/brand/1.ttf')}*{box-sizing:border-box}body{margin:0;background:#f4f0e7;color:#27281f;font-family:Cormorant,Georgia,serif}a{color:inherit;text-underline-offset:3px}#app{height:100dvh;display:flex;flex-direction:column}.deck{flex:1;min-height:0;width:100%;border:0}footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:5px 22px;padding:9px 14px;font:11px/1.5 Arial,sans-serif;border-top:1px solid #cdc9be}address{font-style:normal}.gate{min-height:100svh;display:grid;grid-template-columns:1fr 1fr}.cover{background:#e8e2d6 url('/brand/cover.png') center/contain no-repeat}.entry{display:grid;align-content:center;padding:clamp(32px,8vw,140px)}small,label,button{font:11px/1.5 Chanel,Arial,sans-serif;letter-spacing:.08em}h1{font-size:clamp(46px,5vw,82px);line-height:1;font-weight:400;margin:25px 0 42px}label,input{display:block}input{width:100%;margin:9px 0 18px;border:0;border-bottom:1px solid #74756a;background:transparent;font:24px Georgia;padding:8px 0}button{cursor:pointer;background:#33362d;color:white;border:0;padding:14px 20px}dialog{margin:0 0 0 auto;height:100dvh;max-height:100dvh;width:min(850px,95vw);max-width:100vw;border:0;background:#f4f0e7;padding:20px;box-shadow:0 0 40px #0003}dialog[open]{display:flex;flex-direction:column;gap:12px}dialog::backdrop{background:#2228}dialog header{display:flex;align-items:center;justify-content:space-between}dialog iframe{flex:1;border:0}dialog a{font:14px Arial}@media(max-width:640px){.gate{grid-template-columns:1fr;grid-template-rows:33svh auto}.cover{background-size:auto 145%}.entry{align-content:start}.entry h1{margin:18px 0 28px}footer{font-size:10px;gap:2px 12px}}`
const page=(lang,title,body)=>'<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>'+escape(title)+'</title><style>'+css+'</style></head><body>'+body+'</body></html>'
const imports={'react/jsx-runtime':'https://esm.sh/react@19.1.1/jsx-runtime','react/jsx-dev-runtime':'https://esm.sh/react@19.1.1/jsx-dev-runtime',react:'https://esm.sh/react@19.1.1','react-dom':'https://esm.sh/react-dom@19.1.1?external=react','react-dom/client':'https://esm.sh/react-dom@19.1.1/client?external=react','@tanstack/react-router':'https://esm.sh/@tanstack/react-router@1.131.35?bundle&external=react,react-dom'}
function login(lang,slug,error=false){
 const en=lang==='en'
 const body='<main class="gate"><div class="cover" role="img" aria-label="Crème de Papier"></div><div class="entry"><small>CRÈME DE PAPIER</small><h1>'+(en?'Your private presentation':'Votre présentation privée')+'</h1><form method="post" action="/'+slug+'/login"><label for="key">'+(en?'Password':'Mot de passe')+'</label><input id="key" type="password" name="password" required autocomplete="current-password" maxlength="200">'+(error?'<p role="alert">'+(en?'Incorrect password.':'Mot de passe incorrect.')+'</p>':'')+'<button>'+(en?'Open presentation':'Découvrir la présentation')+' →</button></form></div></main>'
 return respond(page(lang,'Crème de Papier',body),401,'text/html; charset=utf-8')
}
async function signature(secret,message){
 const enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign'])
 return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(message)))].map(x=>x.toString(16).padStart(2,'0')).join('')
}
async function asset(env,key,type){
 const object=env.MEDIA?await env.MEDIA.get(key):null
 const body=object?object.body:await env.FILES.get(key,'stream')
 return body?respond(body,200,type):respond('404',404)
}
export default {async fetch(req,env){
 const url=new URL(req.url),path=url.pathname
 if(path==='/robots.txt')return respond('User-agent: *\nDisallow: /\n')
 const brand=/^\/brand\/(logo\.png|cover\.png|[123]\.ttf)$/.exec(path)
 if(brand)return asset(env,'prez/shared/'+brand[1],brand[1].endsWith('.png')?'image/png':'font/ttf')
 const match=/^\/([a-z0-9-]+)(?:\/(.*))?$/.exec(path)
 if(!match)return respond('404',404)
 const [,slug,route='']=match
 const project=await env.FILES.get('prez/'+slug+'/project.json','json')
 if(!project)return respond('404',404)
 const {lang,documents}=project,now=Math.floor(Date.now()/1000),cookie='cdp_'+slug.replaceAll('-','_')
 if(route==='login'&&req.method==='POST'){
   if(req.headers.get('Origin')!==url.origin && req.headers.get('Sec-Fetch-Site')!=='same-origin')return respond('403',403)
   const limit=await env.LOGIN_LIMIT.limit({key:req.headers.get('CF-Connecting-IP')||'unknown'})
   if(!limit.success)return respond(lang==='en'?'Try again in one minute.':'Réessayez dans une minute.',429)
   const form=new URLSearchParams((await req.text()).slice(0,1000)),p=form.get('password'),clientSecret=env['CLIENT_'+slug.toUpperCase().replaceAll('-','_')]
   if(!p||!(p===env.AGENCY_PASSWORD||p===clientSecret))return login(lang,slug,true)
   const expires=now+28800,token=expires+'.'+await signature(env.SIGNING_KEY,slug+'.'+expires)
   return respond(null,303,'text/plain',{'Location':'/'+slug,'Set-Cookie':cookie+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800'})
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return respond('405',405)
 const token=(req.headers.get('Cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookie+'='))?.slice(cookie.length+1)||''
 const [expires,mac]=token.split('.')
 if(!/^\d{10}$/.test(expires)||Number(expires)<=now||mac!==await signature(env.SIGNING_KEY,slug+'.'+expires))return login(lang,slug)
 if(route==='content')return asset(env,'prez/'+slug+'/index.html','text/html; charset=utf-8')
 if(route==='app.js')return asset(env,'prez/shared/app.js','text/javascript; charset=utf-8')
 const image=/^assets\/([\w-]+\.(jpg|png|webp|avif))$/.exec(route)
 if(image)return asset(env,'prez/'+slug+'/'+route,'image/'+(image[2]==='jpg'?'jpeg':image[2]))
 if(route.startsWith('pdf/')&&documents.some(d=>'pdf/'+d.id===route))return asset(env,'prez/'+slug+'/'+route+'.pdf','application/pdf')
 if(route!==''&&!documents.some(d=>'document/'+d.id===route))return respond('404',404)
 const config=JSON.stringify({...project,slug}).replaceAll('<','\\u003c')
 const fallback='<iframe class="deck" title="'+escape(project.title)+'" src="/'+slug+'/content" allowfullscreen></iframe><footer><address>Crème de Papier · 10 route de Galice, 13100 Aix-en-Provence</address><a href="tel:+33618017247">+33 6 18 01 72 47</a><a href="mailto:contact@cremedepapier.fr">contact@cremedepapier.fr</a><a href="https://www.instagram.com/cremedepapier/">Instagram ↗</a>'+documents.map(d=>'<a href="/'+slug+'/pdf/'+escape(d.id)+'">'+escape(d.label)+'</a>').join('')+'</footer>'
 return respond(page(lang,project.title,'<main id="app">'+fallback+'</main><script id="presentation" type="application/json">'+config+'</script><script type="importmap">'+JSON.stringify({imports})+'</script><script type="module" src="/'+slug+'/app.js"></script>'),200,'text/html; charset=utf-8')
}}
