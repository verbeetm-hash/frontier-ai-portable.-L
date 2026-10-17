// V3.3 SHADOW adapter. Fail closed until a durable independent anchor is provisioned.
// No production keys or update endpoint.
import {ASSETS,install,rollback} from '../frontier-v32/frontier-update-installer.mjs';
import {assertControlState,assertMonotonicManifest} from '../../validation/frontier-v33-state-guard.mjs';
export async function guardedInstall(manifest,{anchor,cacheStorage,locks,...options}={}){
 if(!cacheStorage)throw Error('HOLD: explicit cache storage required');
 const ctl=await cacheStorage.open('frontier-release-control');
 const response=await ctl.match('https://frontier.invalid/state');
 const state=response?await response.json():null;
 if(state)assertControlState(state,ASSETS);
 assertMonotonicManifest(manifest,state,anchor);
 // The underlying installer acquires its own exclusive lock. This precheck is
 // NOT atomic with its commit, so this adapter is a validation candidate only.
 throw Error('HOLD: anchor and atomic update transaction not integrated');
}
export async function guardedRollback({cacheStorage}={}){
 if(!cacheStorage)throw Error('HOLD: explicit cache storage required');
 const ctl=await cacheStorage.open('frontier-release-control');
 const response=await ctl.match('https://frontier.invalid/state');
 const state=response?await response.json():null;
 if(state)assertControlState(state,ASSETS);
 throw Error('HOLD: signed previous release provenance and transaction lock not integrated');
}
