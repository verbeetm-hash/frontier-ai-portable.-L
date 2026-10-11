# Frontier V14.5 batch audit - 2026-10-11

## Repository verification
PASS GitHub fetch: index.html, sw.js, v14-3/index.html, v14-3/sw.js, v14-5/index.html, v14-5/sw.js.
PASS V14 root HTML SHA 77f550b0f26be086a04268d1bb6a2c8fd07cc64b and SW SHA 78342c368d30b41897eed1a4f9159de7a85b00c0 unchanged.
PASS V14.3 HTML SHA cc5b5d35d3ca0cdda39fc35c4668bf91f9a8b44c and SW SHA 42a2a2d1f8cd8b352ac66a496645a93ccfda211e unchanged.
PASS V14.5 HTML contains loadModel, createChatCompletion, cache repair and nonempty-answer validation.
PASS V14.5 SW source contains install precache verification.
PASS (user Android screenshot) SW active, page controlled, five cached files, cache repair returned PASS.
NOT GRANTED Android Chrome persistent storage.

## NOT YET VERIFIED
UNKNOWN V14.5 GGUF model load on Android.
UNKNOWN V14.5 inference result.
UNKNOWN V14.5 airplane mode reload and inference.
UNKNOWN Chrome cache retention after reboot/storage eviction.
UNKNOWN GitHub-independent recovery.
Static text inspection is not runtime test. Do not promote V14.5 to stable.

## Risk
The repair process copies cache entries from staging into active cache. If a put fails partway, it can leave a partial active cache; existing valid entries should remain for unaffected files. Cache presence alone does not prove successful runtime.
Staging cache currently not cleaned after success, consuming additional storage. Improvement candidate: transactional manifest/version approach, cleanup after verified promotion, never delete stable caches.

## Next
Use the existing Android screenshot evidence, minimize repeated tests, and only ask for V14.5 GGUF/inference/offline checks if promotion is intended. Stable V14 and proven V14.3 must remain unchanged.
