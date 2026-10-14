#!/usr/bin/env node
// Frontier V3.2 production manifest signer. Node.js >=20; never store private key in Git.
// Usage: FRONTIER_SIGNING_KEY=/secure/offline/ed25519-private.pem node integration/frontier-v32/sign-release.mjs unsigned.json signed.json
import {readFileSync,writeFileSync} from 'node:fs';
import {createPrivateKey,createPublicKey,sign} from 'node:crypto';
const [input,output]=process.argv.slice(2);
if(!input||!output||!process.env.FRONTIER_SIGNING_KEY)throw Error('HOLD: input, output or private key path missing');
const key=createPrivateKey(readFileSync(process.env.FRONTIER_SIGNING_KEY));
if(key.asymmetricKeyType!=='ed25519')throw Error('HOLD: expected Ed25519 private key');
const m=JSON.parse(readFileSync(input,'utf8'));
if(typeof m.version!=='string'||!Number.isSafeInteger(m.sequence)||m.sequence<1||!Number.isFinite(Date.parse(m.expires))||Date.parse(m.expires)<=Date.now())throw Error('HOLD: invalid manifest');
if(!m.assets||Object.keys(m.assets).length!==9||Object.values(m.assets).some(x=>typeof x!=='string'||!/^[0-9a-f]{64}$/.test(x)))throw Error('HOLD: invalid asset hashes');
const canonical=JSON.stringify({version:m.version,sequence:m.sequence,expires:m.expires,assets:m.assets});
const signature=sign(null,Buffer.from(canonical),key).toString('base64');
const publicKey=createPublicKey(key).export({format:'der',type:'spki'}).subarray(-32).toString('base64');
writeFileSync(output,JSON.stringify({...m,signature},null,2)+'\n',{flag:'wx',mode:0o600});
process.stdout.write('Signed manifest created; public Ed25519 key (base64): '+publicKey+'\n');
