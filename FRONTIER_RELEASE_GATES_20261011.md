# Frontier AI Portable - verified release gates (2026-10-11)

## Proven on user's Android Chrome
- V14 served via GitHub Pages HTTPS.
- Local GGUF loaded and Qwen generated 42 for 17+25.
- In airplane mode, inference worked.
- After closing and reopening Chrome tab while offline, GGUF was selected and 42 was generated.
These are user-reported, screenshot-supported tests, not independent device-lab tests.

## Verified in GitHub
- V14 main index.html retained.
- V14.1 and V14.2 isolated under /v14-1/ and /v14-2/.
- V14.2 includes cache inspection, storage persistence request, inference and report export.

## Important technical limitations
- Offline Cache Storage is browser-managed and can be cleared, even after persistence grant.
- navigator.storage.persist() is not a guarantee of indefinite storage.
- Service workers registered under /v14-2/ cannot intercept /esm/ requests outside their scope. Their cache may still contain the root engine files, but an independent, tested distribution must explicitly validate all network and worker dependencies.
- Cache presence is not proof of correct inference or complete offline restart.
- GitHub Pages hosting cannot be safely removed until an alternative trusted launch origin and restore mechanism are verified.
- content:// local HTML launch was not reliable on Android Chrome with ES module and module worker constraints.
- GGUF is not bundled in GitHub; local selection is still required.

## Release gates
1. Verify assets and versions from authoritative sources.
2. Validate JavaScript syntax and file existence.
3. Validate service-worker install, scope and complete cache inventory.
4. Validate offline reload and network request independence.
5. Validate GGUF selection and actual token generation.
6. Validate persistence after browser process termination and device restart.
7. Validate recovery after storage eviction using an independent copy.
8. Only then consider removing the GitHub repository.

## Change safety
- Never overwrite stable V14 before new version passes user Android tests.
- No destructive repository operations.
- No false PASS: distinguish requested, cached, controlled, loaded and inferred.
- Each candidate remains a shadow release until independently validated.
