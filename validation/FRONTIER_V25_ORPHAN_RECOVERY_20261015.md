# Frontier V2.5 - SHADOW verification

77/77 local tests passed across 9 suites.

New code: when a staging cache exists for an unreferenced release version, the installer removes it under the exclusive Web Lock and can retry. Active and previous rollback caches are protected.

Cloudflare Pages existing two-file cryptographic smoke deployment confirmed successful via Cloudflare API; nine-asset complete release not deployed. The 8.4 MB WASM is below the Pages per-file limit; connector transfer is the remaining publishing limitation.

ZIP: `frontier-v2.5-shadow.zip`, SHA256 `e98b9bf0dfc8181349ae7f34d0a47fc7f48961b7c0489dec64190e2ae869b01b`, saved to Google Drive Frontier AI Portable - MASTER.

HOLD: browser integration of nine assets, production owner-controlled signing key, rotation, immutable versioned URLs, real rollback test. Production untouched.
