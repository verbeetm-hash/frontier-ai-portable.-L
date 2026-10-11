# Frontier V14.3 - Android offline validation (2026-10-11)

Evidence source: four screenshots provided directly by user in conversation, time approximately 23:21-23:24 Netherlands local time. Screenshots are not uploaded to GitHub.

## Verified from screenshots
- V14.3 CANARY page rendered in Chrome while airplane-mode indicator visible.
- App reported Browser meldt: offline.
- SW actief: true; Pagina gecontroleerd: true.
- PASS v14-3/index.html; PASS v14-3/sw.js; PASS esm/index.js; PASS esm/wasm/wllama.wasm; PASS manifest.webmanifest.
- Local qwen2.5 Q2_K GGUF selected.
- PASS: inferentie uitgevoerd.
- Generated output: 42 for What is 17 + 25? Reply with just the number.
- Persistent storage false; persistent request NOT GRANTED.
- Earlier V14 root page also shown separately, not to be confused with V14.3.

## Scope
PASS (user device evidence): Offline page load and offline inference on this Chrome installation at test time.
UNKNOWN: Whether Chrome cache will survive storage eviction, manual clear, full device reboot, app update, or factory reset.
UNKNOWN: Independent offline launch after GitHub Pages removal and loss of browser cache.
UNKNOWN: Whether every possible runtime route is offline; only the tested inference route passed.
Do not delete GitHub repo or overwrite stable V14. Shadow/canary remains separately accessible.

## Next
Prioritize recoverability and durable launch independent of browser cache without APK, Android Studio, or extra apps; content:// module limitations remain. Test incremental changes, not historical V14 baseline again.
