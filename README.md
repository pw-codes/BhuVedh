# BhuVedh (slice 1: map + assessment engine)
npm install && npx prisma generate && npm run db:setup && npm run dev

- lib/engine.ts: surface watershed (follows slope aspect) vs. recharge hypothesis (follows up-dip, fracture, lineaments); divergence = 1 - IoU; priority = benefit x evidence x (1 - risk).
- prisma/seed.ts: 36 synthetic Himalayan springs near Almora.
- Field PWA at /field (service worker + IndexedDB queue -> POST /api/observations, idempotent on clientId); review hub at /review (accepted evidence raises confidence).

## Auth and evidence weights
- Set REVIEWER_KEYS (name:key pairs) and SESSION_SECRET in .env. Reviewers sign in at /login with a name; sessions are HMAC-signed cookies (12 h) and every decision records reviewedBy + reviewedAt. Field uploads stay open so offline sync never fails.
- lib/evidence.ts: dye 1.0, isotope 0.8, discharge 0.4, EC/temp 0.3, lineament 0.3 per accepted observation.

## Photos and offline maps
- Field photos are compressed on-device (lib/photo.ts), queued in IndexedDB, synced, and shown in the review hub.
- "Save map area" on /field caches OSM tiles (z10-14, capped at 400, throttled) around all springs. For larger or heavier use, switch to your own tile server or a licensed provider; OSM policy discourages bulk downloads.
- Schema changed: rerun npm run db:setup (re-seeds springs and clears observations).

## Site report
/report/<springId> is a print-ready brief (verdict, scores, accepted evidence, next steps). Link is in the map detail panel. Schema changed again: rerun npm run db:setup.
