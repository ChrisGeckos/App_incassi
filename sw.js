const C='incassi-v10';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,res)=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
const html=r.mode==='navigate'||r.url.endsWith('/')||r.url.endsWith('index.html');
// pagina: prima la rete (così gli aggiornamenti arrivano subito), se offline la copia salvata
if(html){e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
// resto (icone, librerie): prima la copia salvata
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res)).catch(()=>caches.match('index.html'))))});
