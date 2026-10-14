# Frontier V1.7 update pipeline - SHADOW

Status: HOLD (not deployed). Production `main`, V14.6 and V14.8 remain unchanged.

The complete V1.7 source ZIP was uploaded to the existing Google Drive folder `Meta Veld/Frontier AI Portable - MASTER` as `frontier-v1.7-update-pipeline-shadow.zip` (Drive ID `1ha0eBYBl2FlNXaV2gsGnIdmQ7caQ6JZV`).

Local test suites: installer 13/13, release 10/10. Source based on verified pinned V14.6 candidate. No Android testing by request.

Implemented: Ed25519 release signatures, SHA-256 asset verification, staging cache, readback before activation, single state pointer, previous-release rollback, CI workflow template in ZIP.

NOT validated: production key management, real browser serviceworker activation, multi-tab concurrency, durable storage across crashes, Cloudflare release hosting, V14.8 integration. The update endpoint and trusted public key remain unset, so live installation fails closed.

Review the ZIP and run CI in an isolated branch before any merge. Do not copy private Meta Veld material into a transferable app.
