# BhuVedh (slice 1: map + assessment engine)
npm install && npx prisma generate && npm run db:setup && npm run dev

- lib/engine.ts: surface watershed (follows slope aspect) vs. recharge hypothesis (follows up-dip, fracture, lineaments); divergence = 1 - IoU; priority = benefit x evidence x (1 - risk).
- prisma/seed.ts: 36 synthetic Himalayan springs near Almora.
- Next slices: field verification PWA (service worker + IndexedDB queue -> /api/observations), hydrogeologist review hub.
