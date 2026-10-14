# Frontier V2.1 integrity report (SHADOW)

2026-10-15. Source ZIP saved in Drive `Meta Veld/Frontier AI Portable - MASTER/frontier-v2.1-integrity-shadow.zip`.

Local tests: 55/55 passed (13 installer + 10 signing + 11 automation + 8 security + 7 end-to-end simulations + 6 integrity).

New: same-version identity bound to sequence and hashes; cache collision fails closed.

Browser check attempted with Chromium; local HTTP access blocked by ERR_BLOCKED_BY_ADMINISTRATOR. Android skipped per user request.

Production HOLD: trusted signing key, immutable versioned HTTPS release endpoint, real browser integration, key rotation. No Cloudflare deployment or production changes.
