# Alif v1
## Illustrated storybook revamp
- [ ] Verify and ingest genuine licensed StoryWeaver Urdu books, pages, images and attribution; report inaccessible books
- [ ] Replace library and reader with illustrated page reading, preserving narration and recognition
- [ ] Add persisted English/Urdu instructions, original avatars, stars and rewards milestones
- [ ] Test reward rules, existing learning regressions and desktop/mobile reading flows with narration failures

## Runtime resilience
- [x] Verify forced narration failures and browser fallback on all learning screens; optional client requests never reject, synchronous prewarm/playback failures isolated (77 tests; forced 503 all screens, simulated browser voice on lessons/read/stories)
- [x] Diagnose storage 503 and verify the saved key with a real Google synthesis call (HEAD missing-file check returned 400; bounded exact-name listing fixes cache misses; Google HTTP 200, 7488 MP3 bytes)
- [x] Diagnose home-screen errors and guard local progress, optional audio, and learning data (invalid saved placement and blocked storage reproduced)
- [x] Verify home, lessons, read-aloud, stories, and worksheets without cloud narration (67 tests passed; desktop/mobile checks and blocked-storage lesson completion passed)

## Story library
- [x] Seed four illustrated beginner stories with localized content
- [x] Add library and reader navigation; reuse speech recognition and audio
- [x] Award sentence XP and story completion streaks; verify rules and mobile flows (59 tests; desktop/mobile reading and simulated recognition verified)

- [x] Vibrant multilingual welcome, placement, challenge, lessons, profile
- [x] Read-aloud feedback and printable worksheets (simulated recognition and fallback verified)
- [x] Local progress, rewards, rules tests
- [x] Installation manifest, generated offline shell, and phone/desktop checks (offline installation requires publication)

## Google Urdu narration
- [x] Upgrade default to Aoede with Charon/Kore/Puck alternates and legacy Wavenet support; verified MP3-only retry, voice fallback and separate storage hashes (68 narration/resilience tests passed); live پانی اور روٹی returned HTTP 200 with actual voice ur-IN-Chirp3-HD-Aoede, signed audio HTTP 200, 7392 valid MP3 bytes, 1.848 seconds.
- [x] Make storage optional and support inline MP3 responses with safe client caching (bounded optional lookup/upload/link operations; 86 tests passed)
- [x] Verify live Google synthesis with blocked storage and failure resilience across all screens (real Google + simulated blocked bucket: HTTP 200, 7488 inline MP3 bytes; lesson/story playing events; forced 503/401/network/invalid-key responses across all nine screens, zero uncaught errors and browser fallback)
- [x] Replace Azure synthesis with Google TTS and update voice rules and tests; preserve storage and frontend playback
- [x] Secure narration endpoint and SHA-256 storage cache (private links; public buckets blocked by workspace policy)
- [x] URL cache, button loading states, quiet seeded-content prewarm, browser fallback
- [x] Audio rule tests and unchanged playback regression checks (46 tests passed)
- [x] Live Google narration verification and seeded-content prewarm (endpoint 200; private signed URL 200 audio/mpeg, 7488 bytes for پانی; real MP3 playback initiated on lesson/story/read buttons without browser fallback; all 130 seeded texts cached)