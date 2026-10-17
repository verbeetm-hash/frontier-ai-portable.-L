# V3.3 integration test scope - 2026-10-17

The V3.3 pure guard was previously tested locally (31/31). A new isolated, simulated transaction harness produced 10/10 PASS for interruptions, state corruption, replay, and commit ordering. This is NOT the real V3.2 installer, CacheStorage, Web Locks, Service Worker, or Android. Do not count simulated results as integrated runtime PASS.

Attempt to modify integration/frontier-v32/frontier-update-installer.mjs on the V3.3 SHADOW branch was blocked by tool safety controls. No installer edit is claimed. V3.3 guard remains unconnected to the real installer.

Critical unresolved issue: the monotonic anchor is not independently trusted or provisioned; local CacheStorage-only sequence cannot prove anti-replay after deletion. Production remains fail-closed.

Next: integrate through authorized path; execute real installer under a deterministic mocked CacheStorage and fetcher, then browser and Android tests separately. Keep PRIMARY, main, E8, production and scheduled tasks untouched.
