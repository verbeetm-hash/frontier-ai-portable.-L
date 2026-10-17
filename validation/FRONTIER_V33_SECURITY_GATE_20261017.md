# Frontier V3.3 SHADOW security gate - 2026-10-17

Parent: shadow/frontier-v32-integrated-20261015
Classification: SHADOW ONLY. Production config stays fail-closed; no signing key, release URL, deployment, or automatic promotion.

## Code review findings requiring regression coverage
1. CacheStorage state is an untrusted mutable record. Current sequence/active/previous fields are not authenticated against a durable monotonic trusted anchor. A corrupted or deleted control record can enable replay or downgrade despite a valid signature. HOLD.
2. In installUnlocked, successful readback precedes one state put, but a crash during the state put and subsequent Service Worker activation has no proven end-to-end recovery transaction. HOLD.
3. rollbackUnlocked verifies cached bytes against previousAssets stored in the same mutable state; it does not independently reverify the original signed release manifest. The integrity claim is bounded to stored hashes, not trusted provenance. HOLD.
4. The standalone PWA refresh writes destination cache entries one by one, attempts compensation on errors, and has no durable crash recovery journal. Calling this fully atomic would overstate the evidence. HOLD.
5. V3.2 update and PWA refresh use different Web Lock names, so they do not mutually exclude one another. Cross-flow races need tests. HOLD.
6. checkAndInstall checks same-origin HTTPS for manifest; assets are checked same-origin against baseURL. Add explicit origin binding and response URL/content length limits, and test redirects, network aborts, malformed JSON, quota failures, and interrupted writes.
7. Production key and manifest URL are null by design; keep them null until independent authorization and provisioning.

## Required next bounded test batch
- Negative cases: deleted, truncated, reordered, forged and stale control state; valid older signed manifest after state loss; duplicate version with changed sequence or hashes.
- Interruption points: every asset fetch, every staging.put, staging readback, state put, Service Worker switch, browser restart.
- Previous release: missing cache, tampered previousAssets, manipulated previous ID, rollback followed by replay attempt.
- Concurrency: installer, rollback, and PWA refresh under a shared lock or explicit exclusion.
- Signed trust anchor: monotonic sequence and prior signed release metadata outside mutable cache state; fail closed if unavailable.
- Run independent Node regression and browser tests, preserve logs and hashes, then test real Android separately.

This is a source-based engineering assessment, not a claim that tests have passed.
