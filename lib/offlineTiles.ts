import type { Site } from "@/app/page";
const CACHE = "bhuvedh-v1"; // same cache the service worker reads from
const Z = [10, 11, 12, 13, 14], MAX_TILES = 400;
const x = (lon: number, z: number) => Math.floor(((lon + 180) / 360) * 2 ** z);
const y = (lat: number, z: number) => { const r = (lat * Math.PI) / 180; return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z); };

/** Tile URLs covering all springs plus ~1 km margin, zoom 10-14. */
export function tileUrls(sites: Site[]): string[] {
  if (!sites.length) return [];
  const lats = sites.map((s) => s.spring.lat), lons = sites.map((s) => s.spring.lon);
  const [s, n, w, e] = [Math.min(...lats) - 0.01, Math.max(...lats) + 0.01, Math.min(...lons) - 0.01, Math.max(...lons) + 0.01];
  const out: string[] = [];
  for (const z of Z) for (let i = x(w, z); i <= x(e, z); i++) for (let j = y(n, z); j <= y(s, z); j++) out.push(`https://tile.openstreetmap.org/${z}/${i}/${j}.png`);
  return out.slice(0, MAX_TILES);
}

export async function saveArea(urls: string[], onProgress: (done: number) => void) {
  const c = await caches.open(CACHE);
  let done = 0;
  for (const u of urls) {
    if (!(await c.match(u))) { try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch { /* skip; retry later */ } }
    onProgress(++done);
    await new Promise((r) => setTimeout(r, 120)); // go gently on the public tile server
  }
}
