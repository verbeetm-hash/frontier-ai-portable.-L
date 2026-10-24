// Read-only regression tests for Frontier V14.6. Run: node --test v14-6/security-validation.test.mjs
// No GGUF, secrets, external APIs, or production writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read = p => readFileSync(new URL(p, import.meta.url));
const txt = p => read(p).toString('utf8');
const digest = b => createHash('sha256').update(b).digest('hex');
const gate = txt('./maximum-assurance-gate.js');
const app = txt('./index.html');
const sw = txt('./sw.js');
const protocol = read('./maximum-assurance-protocol.txt');
const match = gate.match(/ASSURANCE_SHA256='([a-f0-9]{64})'/);
test('protocol digest matches pinned SHA256', () => { assert.ok(match); assert.equal(digest(protocol),match[1]); });
test('tampered protocol is rejected by pinned hash', () => { const tampered=Buffer.concat([protocol,Buffer.from('tamper')]); assert.notEqual(digest(tampered),match[1]); });
test('gate fails closed on missing crypto, HTTP failure and digest mismatch', () => { for(const term of ['secure digest unavailable','protocol unavailable','protocol integrity mismatch']) assert.ok(gate.includes(term),term); });
test('startup and model loading check assurance', () => { assert.ok(app.includes('requireMaximumAssurance().then')); assert.ok(app.includes('await assuranceReady;await requireMaximumAssurance()')); });
test('inference rechecks assurance and uses checked text', () => { assert.ok(app.includes('const freshAssurance=await requireMaximumAssurance()')); assert.ok(app.includes('content:freshAssurance.text')); });
test('service worker caches gate and protocol', () => { for(const path of ['maximum-assurance-gate.js','maximum-assurance-protocol.txt']) assert.ok(sw.includes(path),path); });
test('no external tool or account action is wired in the PWA page', () => { for(const term of ['sendEmail(', 'deleteFile(', 'executeTool(', 'apiKey']) assert.ok(!app.includes(term),term); });
test('security limitations are explicit', () => { assert.ok(txt('./assurance-selftest.html').includes('GGUF inference NOT TESTED')); assert.ok(protocol.toString().includes('UNKNOWN is not PASS')); });
test('untrusted user prompt is a user role, not system role', () => { assert.ok(app.includes("{role:'user',content:$('prompt').value}")); });
test('cache inventory includes model engine but does not imply offline proof', () => { assert.ok(sw.includes('esm/wasm/wllama.wasm')); assert.ok(app.includes('test offline herstart nog apart')); });
