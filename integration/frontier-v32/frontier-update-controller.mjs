// Frontier V3.2 safe auto-update integration.
// The trusted manifest endpoint is deliberately disabled until production key provisioning.
import {checkAndInstall} from './frontier-update-installer.mjs';
import {TRUSTED_RELEASE_KEY,UPDATE_MANIFEST_URL} from './frontier-update-config.js';
const status=document.querySelector('#frontier-v32-update-status');
const button=document.querySelector('#frontier-v32-check-update');
function report(message){if(status)status.textContent=message;}
async function check(){
 if(!TRUSTED_RELEASE_KEY||!UPDATE_MANIFEST_URL){report('HOLD: productiesleutel of manifest ontbreekt; huidige versie blijft intact');return;}
 try {const r=await checkAndInstall();report('Release cryptografisch gecontroleerd en gestaged: '+r.status+' '+r.version+'. Activatie vereist een apart geteste Service Worker-switch.');}
 catch(e){report('HOLD: '+String(e.message||e));}
}
if(button)button.addEventListener('click',check);
if(document.visibilityState==='visible')void check();
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void check()});
