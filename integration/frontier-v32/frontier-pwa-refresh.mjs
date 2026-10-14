// Same-origin PWA update: no private signing key in the client.
// Integrity anchor: pinned Maximum Assurance protocol SHA-256; atomic cache promotion.
const FILES=['v14-6/index.html','v14-6/sw.js','esm/index.js','esm/wasm/wllama.wasm','v14-6/manifest.webmanifest','v14-6/icon.svg','v14-6/maximum-assurance-gate.js','v14-6/maximum-assurance-protocol.txt'];
const ROOT=new URL('../../',import.meta.url);
const DEST='frontier-v146-assurance-shadow-v1';
const STAGING='frontier-v32-pwa-staging';
const EXPECTED_PROTOCOL='d9cfd477e8b65f5051e317a2031185dda78a12ab13a3216941aaa8d807b8c38d';
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
export async function refreshPwa(){
 if(!navigator.locks?.request)throw Error('HOLD: exclusive lock unavailable');
 return navigator.locks.request('frontier-pwa-refresh',{mode:'exclusive'},async()=>{
  const urls=FILES.map(p=>new URL(p,ROOT).href);
  await caches.delete(STAGING);
  const staging=await caches.open(STAGING);
  try{
   for(const u of urls){const r=await fetch(u,{cache:'no-store',redirect:'error'});if(!r.ok||r.redirected||r.type==='opaque')throw Error('HOLD: asset fetch '+u);await staging.put(u,r)}
   const protocol=await staging.match(new URL('v14-6/maximum-assurance-protocol.txt',ROOT));
   const digest=hex(await crypto.subtle.digest('SHA-256',await protocol.arrayBuffer()));
   if(digest!==EXPECTED_PROTOCOL)throw Error('HOLD: assurance protocol hash mismatch');
   for(const u of urls){const r=await staging.match(u);if(!r?.ok)throw Error('HOLD: incomplete staging '+u)}
   const destination=await caches.open(DEST);
   const backup=new Map();for(const u of urls)backup.set(u,await destination.match(u));
   try{for(const u of urls)await destination.put(u,await staging.match(u))}
   catch(e){for(const [u,r] of backup){if(r)await destination.put(u,r);else await destination.delete(u)}throw e}
   return {status:'REFRESHED',count:urls.length};
  }finally{await caches.delete(STAGING)}
 });
}
