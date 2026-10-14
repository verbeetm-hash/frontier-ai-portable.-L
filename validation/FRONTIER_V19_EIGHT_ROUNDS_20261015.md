# Frontier V1.9 - eight-rounds SHADOW verification

Date: 2026-10-15

The complete source package is archived in Google Drive at:
`Meta Veld/Frontier AI Portable - MASTER/frontier-v1.9-eight-rounds-shadow.zip`

Local verification: 13 installer + 10 signing + 11 automation + 8 adversarial tests = **42/42 passing**; 3 JavaScript syntax checks passing.

Security fixes: trusted bootstrap files no longer routed to incomplete signed-release cache; rollback now checks every previous-release SHA-256 digest. Tests include concurrent updates, mid-download interruption, corrupted previous release, invalid signatures, and downgrade rejection.

HOLD: Production Ed25519 signing key and HTTPS release distribution not configured. Browser and Cloudflare end-to-end release installation not verified. Android tests deliberately omitted. This is not a deployable production approval.

No private Meta Veld research is included in the portable package. No change to main or existing production deployments.
