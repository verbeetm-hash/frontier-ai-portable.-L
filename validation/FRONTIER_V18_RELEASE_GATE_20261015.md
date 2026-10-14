# Frontier V1.8 release gate (SHADOW only)

Date: 2026-10-15

This branch is isolated from main. It is **not** a production deployment.

Verified locally in a separate working environment:
- 13 installer tests
- 10 signing tests
- 11 automation and locking tests

The full source package is held separately in the Frontier AI Portable - MASTER Drive folder / conversation artifact, not checked into this branch.

Deployment gate:
- [ ] Approved portable-only content; exclude private Meta Veld
- [ ] Independent source review and version provenance
- [ ] Owner-controlled Ed25519 private key provisioned securely (never commit or put in portable ZIP)
- [ ] Public key pinned in installer and release signing verified end to end
- [ ] Same-origin HTTPS immutable release asset hosting
- [ ] Browser preview and crash recovery integration tests (Android explicitly excluded)
- [ ] Explicit production promotion approval

HOLD: Do not configure production deployment or automatic release publication based on this document alone.
