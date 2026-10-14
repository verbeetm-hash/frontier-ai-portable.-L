
import {TRUSTED_RELEASE_KEY,UPDATE_MANIFEST_URL} from './frontier-update-config.js';
export const ASSETS=['v14-6/index.html','v14-6/sw.js','v14-6/frontier-update-policy-v07.mjs','v14-6/maximum-assurance-gate.js','v14-6/maximum-assurance-protocol.txt','v14-6/manifest.webmanifest','v14-6/icon.svg','esm/index.js','esm/wasm/wllama.wasm'];
const toHex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const validId=s=>typeof s==='string'&&/^[a-zA-Z0-9._-]{1,80}$/.test(s)&&s!=='..';
export function canonical(m){return JSON.stringify({version:m.version,sequence:m.sequence,expires:m.expires,assets:m.assets});}
export function validate(m){
 if(!m||!validId(m.version)||!Number.isSafeInteger(m.sequence)||m.sequence<1||!Number.isFinite(Date.parse(m.expires))||Date.parse(m.expires)<=Date.now())throw Error('HOLD: invalid or expired manifest');
 if(!m.assets||Object.keys(m.assets).length!==ASSETS.length||ASSETS.some(p=>!(/^[0-9a-f]{64}$/.test(m.assets[p]||''))))throw Error('HOLD: missing or extra asset hash');
 if(!m.signature||typeof m.signature!=='string')throw Error('HOLD: unsigned manifest');
}
export async function verifyManifest(m,key=TRUSTED_RELEASE_KEY){
 validate(m);
 if(!key)throw Error('HOLD: trusted signing key not provisioned');
 // Fail closed when the browser lacks native Ed25519. No unsigned fallback.
 if(typeof key!=='string'||b64(key).length!==32)throw Error('HOLD: invalid trusted public key');
 if(b64(m.signature).length!==64)throw Error('HOLD: invalid signature encoding');
 let publicKey;
 try { publicKey=await crypto.subtle.importKey('raw',b64(key),{name:'Ed25519'},false,['verify']); }
 catch(e) { throw Error('HOLD: native Ed25519 unavailable in this browser; no insecure fallback'); }
 const ok=await crypto.subtle.verify('Ed25519',publicKey,b64(m.signature),new TextEncoder().encode(canonical(m)));
 if(!ok)throw Error('HOLD: invalid release signature');
 return true;
}
async function installUnlocked(m,{baseURL=new URL('./',import.meta.url),key=TRUSTED_RELEASE_KEY,fetcher=fetch,cacheStorage=caches}={}){
 await verifyManifest(m,key);
 const active=await cacheStorage.open('frontier-release-control');
 const stateResponse=await active.match('https://frontier.invalid/state');
 const currentState=stateResponse?await stateResponse.json():null;
 // Validate persisted state before any early return or cache reuse.
 if(currentState && (!validId(currentState.active)||!Number.isSafeInteger(currentState.sequence)||currentState.sequence<1||!currentState.assets||Object.keys(currentState.assets).length!==ASSETS.length||ASSETS.some(p=>!(/^[0-9a-f]{64}$/.test(currentState.assets[p]||'')))))
   throw Error('HOLD: invalid stored state');
 const oldId=currentState?.active||null;
 if(oldId===m.version){
   if(currentState.sequence!==m.sequence||!currentState.assets||ASSETS.some(p=>currentState.assets[p]!==m.assets[p]))
     throw Error('HOLD: active release identity mismatch');
   const existing=await cacheStorage.open('frontier-release-'+m.version);
   for(const p of ASSETS){
     const u=new URL(p,baseURL).href;
     const item=await existing.match(u);
     if(!item||toHex(await crypto.subtle.digest('SHA-256',await item.arrayBuffer()))!==m.assets[p])
       throw Error('HOLD: active release corrupt '+p);
   }
   return {status:'ALREADY_ACTIVE',version:m.version};
 }
 const oldSeq=currentState?.sequence||0;
 if(currentState && (!validId(currentState.active)||!Number.isSafeInteger(currentState.sequence)||currentState.sequence<1))throw Error('HOLD: invalid stored state');
 if(currentState&&!Number.isSafeInteger(oldSeq))throw Error('HOLD: invalid release state');
 if(m.sequence<=oldSeq)throw Error('HOLD: rollback or replay release');
 const cacheName='frontier-release-'+m.version;
 // Never reuse a partially populated staging cache from a crashed attempt.
 if(await cacheStorage.has(cacheName)){
   // Under the exclusive Web Lock, a cache for a non-active, non-previous
   // version is an orphan left by an interrupted staging attempt.
   // Never delete caches referenced by the authoritative state pointer.
   if(m.version===currentState?.active||m.version===currentState?.previous)
     throw Error('HOLD: protected release cache collision');
   if(!(await cacheStorage.delete(cacheName)))
     throw Error('HOLD: orphan staging cache could not be removed');
 }

 const staging=await cacheStorage.open(cacheName);
 try{
   for(const p of ASSETS){
     const u=new URL(p,baseURL);
     if(u.origin!==baseURL.origin)throw Error('HOLD: cross-origin asset');
     const r=await fetcher(u.href,{cache:'no-store',redirect:'error',headers:{'X-Frontier-Update':'1'}});
     if(!r.ok||r.type==='opaque'||r.redirected)throw Error('HOLD: asset fetch failed '+p);
     const bytes=await r.arrayBuffer();
     const hash=toHex(await crypto.subtle.digest('SHA-256',bytes));
     if(hash!==m.assets[p])throw Error('HOLD: asset hash mismatch '+p);
     await staging.put(u.href,new Response(bytes,{headers:{'content-type':r.headers.get('content-type')||'application/octet-stream'}}));
   }
   // Read back all bytes before a single durable pointer commit.
   for(const p of ASSETS){
     const u=new URL(p,baseURL).href;
     const saved=await staging.match(u);
     if(!saved||toHex(await crypto.subtle.digest('SHA-256',await saved.arrayBuffer()))!==m.assets[p])
       throw Error('HOLD: staged asset verification failed '+p);
   }
   const previousState=await active.match('https://frontier.invalid/state');
   const state=previousState?await previousState.json():{active:oldId,previous:null,sequence:oldSeq};
   const next={active:m.version,previous:state.active||oldId||null,sequence:m.sequence,assets:m.assets,previousAssets:state.assets||null};
   // Single cache entry is the authoritative state. Legacy pointers are ignored.
   await active.put('https://frontier.invalid/state',new Response(JSON.stringify(next)));
   return {status:'INSTALLED',version:m.version,previous:oldId};
 }catch(e){await cacheStorage.delete(cacheName);throw e}
}
async function rollbackUnlocked(cacheStorage=caches){
 const ctl=await cacheStorage.open('frontier-release-control');
 const r=await ctl.match('https://frontier.invalid/state');
 const state=r?await r.json():null;
 if(!state?.previous||!state.previousAssets||!(await cacheStorage.has('frontier-release-'+state.previous)))
   throw Error('HOLD: no previous release');
 if(!validId(state.previous)||!validId(state.active)||!Number.isSafeInteger(state.sequence)||state.sequence<1||!state.previousAssets||Object.keys(state.previousAssets).length!==ASSETS.length||ASSETS.some(p=>!(/^[0-9a-f]{64}$/.test(state.previousAssets[p]||''))))throw Error('HOLD: invalid rollback state');
 const previousCache=await cacheStorage.open('frontier-release-'+state.previous);
 for(const p of ASSETS){
   const names=await previousCache.keys();
   const match=names.find(req=>new URL(req.url).pathname.endsWith('/'+p));
   const asset=match?await previousCache.match(match):null;
   if(!asset||toHex(await crypto.subtle.digest('SHA-256',await asset.arrayBuffer()))!==state.previousAssets[p])
     throw Error('HOLD: previous release corrupt');
 }
 const next={active:state.previous,previous:state.active,sequence:state.sequence,assets:state.previousAssets,previousAssets:state.assets};
 await ctl.put('https://frontier.invalid/state',new Response(JSON.stringify(next)));
 return next.active;
}
export async function withUpdateLock(operation,{locks=globalThis.navigator?.locks}={}){
 if(!locks?.request)throw Error('HOLD: Web Locks unavailable; update denied');
 return locks.request('frontier-release-exclusive',{mode:'exclusive'},operation);
}
export async function install(m,options={}){
 return withUpdateLock(()=>installUnlocked(m,options),{locks:options.locks});
}
export async function rollback(cacheStorage=caches,{locks=globalThis.navigator?.locks}={}){
 return withUpdateLock(()=>rollbackUnlocked(cacheStorage),{locks});
}
export async function checkAndInstall({key=TRUSTED_RELEASE_KEY,manifestURL=UPDATE_MANIFEST_URL,locks=globalThis.navigator?.locks}={}){
 if(!manifestURL)throw Error('HOLD: no trusted update endpoint configured');
 const u=new URL(manifestURL,location.href);
 if(u.origin!==location.origin||u.protocol!=='https:')throw Error('HOLD: manifest requires same-origin HTTPS');
 const r=await fetch(u.href,{cache:'no-store',redirect:'error'});
 if(!r.ok||r.redirected||r.type==='opaque')throw Error('HOLD: manifest fetch failed');
 return install(await r.json(),{key,locks});
}
