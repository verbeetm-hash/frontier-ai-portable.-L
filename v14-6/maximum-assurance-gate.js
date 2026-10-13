// Frontier Portable mandatory assurance bootstrap. No external account dependency.
export const ASSURANCE_SHA256='d9cfd477e8b65f5051e317a2031185dda78a12ab13a3216941aaa8d807b8c38d';
export async function requireMaximumAssurance(){
  if(!globalThis.crypto?.subtle) throw Error('ASSURANCE HOLD: secure digest unavailable');
  const url=new URL('./maximum-assurance-protocol.txt',import.meta.url);
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok) throw Error('ASSURANCE HOLD: protocol unavailable');
  const bytes=await response.arrayBuffer();
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  const hex=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  if(hex!==ASSURANCE_SHA256) throw Error('ASSURANCE HOLD: protocol integrity mismatch');
  return Object.freeze({status:'PASS',protocolVersion:'PORTABLE_V1',sha256:hex,text:new TextDecoder().decode(bytes)});
}
