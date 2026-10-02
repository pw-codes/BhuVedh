// Network-first for every GET (pages, scripts, /api/sites, map tiles); falls back to cache offline.
const C = "bhuvedh-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.pathname.startsWith("/api/observations")) return;
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(C).then((k) => k.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request).then((m) => m || new Response("Offline and not cached yet.", { status: 503 }))));
});
