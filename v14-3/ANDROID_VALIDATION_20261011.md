# Frontier V14.3 Android validation - 2026-10-11

Evidence: user-provided Android Chrome screenshots in conversation (not publicly embedded).
- HTTPS: true; WebAssembly: true.
- Service worker active: true; page controlled: true.
- PASS cached: v14-3/index.html, v14-3/sw.js, esm/index.js, esm/wasm/wllama.wasm, manifest.webmanifest.
- navigator.storage.persist() result: NOT GRANTED; persisted() false.
- Local qwen2.5-0.5b Q2_K GGUF selected.
- App displayed PASS: inference executed and model output 42 for 17+25.
- The model file is locally selected; no evidence of upload.
- V14.3 OFFLINE RELOAD / offline inference: NOT YET TESTED.
- V14 stable root SHA 77f550b0f26be086a04268d1bb6a2c8fd07cc64b before validation.
- Persistent storage refusal does not by itself block offline functionality.
- Cache inventory proves cached resources, not that all runtime dynamic dependencies are cached.
- No basis to delete GitHub repository.

Next falsification: airplane mode with Wi-Fi off, close tab, reopen V14.3 from Chrome history, reselect GGUF and regenerate 42. Repeat after Chrome force-stop/device restart when convenient. Treat actual results independently.

Methodology: risk-based 8x8x8x8x8x8, canary/shadow isolation, failure-mode analysis, independent verification. No fictional 262144 hardware tests.
Sources: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers ; https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching .
