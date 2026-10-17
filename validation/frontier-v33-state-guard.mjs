// Frontier V3.3 - fail-closed control-state validation, SHADOW only.
// Pure functions: no storage writes, no production configuration.
export const HEX64=/^[0-9a-f]{64}$/;
const validId=s=>typeof s==='string'&&/^[a-zA-Z0-9._-]{1,80}$/.test(s)&&s!=='..';
const exact=(obj,keys)=>obj&&typeof obj==='object'&&!Array.isArray(obj)&&
 Object.keys(obj).sort().join('|')===keys.slice().sort().join('|');
const hashes=(obj,assets)=>exact(obj,assets)&&assets.every(p=>HEX64.test(obj[p]));
export function assertControlState(state,assets){
 if(!exact(state,['active','previous','sequence','assets','previousAssets']))throw Error('HOLD: malformed control state');
 if(!validId(state.active)||!Number.isSafeInteger(state.sequence)||state.sequence<1||!hashes(state.assets,assets))throw Error('HOLD: invalid active state');
 if(state.previous!==null&&(!validId(state.previous)||state.previous===state.active||!hashes(state.previousAssets,assets)))throw Error('HOLD: invalid previous state');
 if(state.previous===null&&state.previousAssets!==null)throw Error('HOLD: orphan previous hashes');
 return true;
}
export function assertMonotonicManifest(manifest,state,anchor){
 if(!anchor||!Number.isSafeInteger(anchor.maxSequence)||anchor.maxSequence<1||!validId(anchor.version))
  throw Error('HOLD: trusted monotonic anchor unavailable');
 if(state){if(state.sequence<anchor.maxSequence)throw Error('HOLD: stored state older than anchor');}
 if(!Number.isSafeInteger(manifest?.sequence)||manifest.sequence<=anchor.maxSequence)
  throw Error('HOLD: release replay or downgrade');
 if(!validId(manifest.version))throw Error('HOLD: invalid version');
 return true;
}
