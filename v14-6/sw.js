const VERSION='frontier-v146-assurance-shadow-v1';const ROOT=new URL('../',self.location.href);const PATHS=['v14-6/index.html','v14-6/sw.js','esm/index.js','esm/wasm/wllama.wasm','v14-6/manifest.webmanifest','v14-6/icon.svg','v14-6/maximum-assurance-gate.js','v14-6/maximum-assurance-protocol.txt'];const URLS=PATHS.map(p=>new URL(p,ROOT).href);self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(URLS);for(const u of URLS){const r=await c.match(u);if(!r||!r.ok)throw Error('Missing cache: '+u)}await self.skipWaiting()})()));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==self.location.origin)return;if(!URLS.includes(url.href))return;e.respondWith((async()=>{const c=await caches.open(VERSION);const r=await c.match(e.request);return r||fetch(e.request)})())})
// Frontier V3.2: serve only verified staged assets on a separate /v14-6/active/ route.
// Never replace existing canary URLs or bypass the assurance gate.
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith('/v14-6/active/'))return;
 event.respondWith((async()=>{
  const ctl=await caches.open('frontier-release-control');
  const saved=await ctl.match('https://frontier.invalid/state');
  if(!saved)return new Response('HOLD: no signed active release',{status:503});
  const state=await saved.json();
  if(!state||typeof state.active!=='string'||!/^v[0-9a-zA-Z._-]{1,79}$/.test(state.active))return new Response('HOLD: invalid release pointer',{status:503});
  const suffix=u.pathname.slice('/v14-6/active/'.length);
  if(!/^(v14-6\/(index\.html|sw\.js|frontier-update-policy-v07\.mjs|maximum-assurance-gate\.js|maximum-assurance-protocol\.txt|manifest\.webmanifest|icon\.svg)|esm\/index\.js|esm\/wasm\/wllama\.wasm)$/.test(suffix))return new Response('HOLD: path not allowlisted',{status:403});
  const c=await caches.open('frontier-release-'+state.active);
  const candidates=await c.keys();
  const match=candidates.find(req=>new URL(req.url).pathname.endsWith('/'+suffix));
  const result=match?await c.match(match):null;
  if(!result)return new Response('HOLD: signed asset unavailable',{status:503});
  return result;
 })());
});
