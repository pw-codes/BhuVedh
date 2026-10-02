export type SpringRow = {
  id: number; name: string; lat: number; lon: number; elevation: number; lithology: string;
  dipDeg: number; dipAzimuth: number; aspect: number; fractureDensity: number; lineamentDistM: number;
  dischargeLps: number; declinePct: number; evidenceCount: number; slopeDeg: number;
  landslideRisk: number; tenure: string;
};
export type Verdict = "Prioritize" | "Verify first" | "Defer";
export type Assessment = {
  suitability: number; need: number; confidence: number; risk: number; divergence: number;
  priority: number; verdict: Verdict; guidance: string; drivers: string[];
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const M = 111320;
const LITH: Record<string, number> = { quartzite: 0.9, limestone: 0.8, schist: 0.5, phyllite: 0.35, shale: 0.2 };
type Ell = { e: number; n: number; a: number; b: number; az: number }; // metres from spring; az = major-axis bearing

const offset = (bearing: number, d: number) => ({ e: Math.sin((bearing * Math.PI) / 180) * d, n: Math.cos((bearing * Math.PI) / 180) * d });
const inside = (x: number, y: number, el: Ell) => {
  const t = ((90 - el.az) * Math.PI) / 180, dx = x - el.e, dy = y - el.n;
  const u = dx * Math.cos(t) + dy * Math.sin(t), v = -dx * Math.sin(t) + dy * Math.cos(t);
  return (u / el.a) ** 2 + (v / el.b) ** 2 <= 1;
};
const ring = (s: SpringRow, el: Ell) => {
  const t = ((90 - el.az) * Math.PI) / 180, pts: number[][] = [];
  for (let i = 0; i <= 48; i++) {
    const p = (i / 48) * 2 * Math.PI, u = el.a * Math.cos(p), v = el.b * Math.sin(p);
    const e = el.e + u * Math.cos(t) - v * Math.sin(t), n = el.n + u * Math.sin(t) + v * Math.cos(t);
    pts.push([s.lon + e / (M * Math.cos((s.lat * Math.PI) / 180)), s.lat + n / M]);
  }
  return [pts];
};

/** Surface watershed: topographic, follows the slope aspect. */
export const surfaceWatershed = (s: SpringRow): Ell => {
  const o = offset((s.aspect + 180) % 360, 500 + s.slopeDeg * 12);
  return { ...o, a: 900 + s.slopeDeg * 15, b: 450, az: s.aspect };
};
/** Sub-surface recharge hypothesis: follows up-dip direction, widened by fracture density and lineaments. */
export const rechargeHypothesis = (s: SpringRow): Ell => {
  const o = offset((s.dipAzimuth + 180) % 360, 400 + 1200 * s.fractureDensity);
  return { ...o, a: 700 + 1200 * s.fractureDensity, b: 350 + 300 * clamp(1 - s.lineamentDistM / 2000), az: s.dipAzimuth };
};

const overlapIoU = (a: Ell, b: Ell) => {
  let inter = 0, uni = 0;
  for (let x = -3500; x <= 3500; x += 100) for (let y = -3500; y <= 3500; y += 100) {
    const ia = inside(x, y, a), ib = inside(x, y, b);
    if (ia && ib) inter++;
    if (ia || ib) uni++;
  }
  return uni ? inter / uni : 0;
};

export function assess(s: SpringRow): { assessment: Assessment; watershed: number[][][]; recharge: number[][][] } {
  const ws = surfaceWatershed(s), rh = rechargeHypothesis(s);
  const divergence = 1 - overlapIoU(ws, rh);
  const suitability = 0.4 * (LITH[s.lithology] ?? 0.3) + 0.35 * s.fractureDensity + 0.25 * clamp(1 - s.lineamentDistM / 2000);
  const need = 0.6 * clamp(s.declinePct / 60) + 0.4 * clamp(1 - s.dischargeLps / 3);
  const confidence = clamp(0.2 + 0.15 * s.evidenceCount);
  const risk = 0.5 * s.landslideRisk + 0.3 * clamp(s.slopeDeg / 45) + 0.2 * (s.tenure === "disputed" ? 1 : 0);
  const benefit = 0.55 * suitability + 0.45 * need;
  const priority = benefit * (0.5 + 0.5 * confidence) * (1 - 0.7 * risk);
  const verdict: Verdict = confidence < 0.5 && priority > 0.25 ? "Verify first" : priority >= 0.38 ? "Prioritize" : "Defer";

  const drivers: string[] = [];
  if (divergence > 0.5) drivers.push("Recharge hypothesis diverges from the surface watershed");
  if (suitability > 0.6) drivers.push(`${s.lithology} with fracture and lineament support`);
  if (s.declinePct > 40) drivers.push(`Discharge down ${s.declinePct}%`);
  if (confidence < 0.5) drivers.push(`Only ${s.evidenceCount} evidence item(s); hypothesis is unconfirmed`);
  if (risk > 0.5) drivers.push("Slope, landslide or tenure risk is high");
  const guidance = divergence > 0.5
    ? "Place structures on the up-dip recharge zone, not at the watershed outlet. Confirm with a dye trace or isotope sample."
    : "Surface watershed and sub-surface hypothesis agree. Standard catchment treatment applies.";
  return { assessment: { suitability, need, confidence, risk, divergence, priority, verdict, guidance, drivers }, watershed: ring(s, ws), recharge: ring(s, rh) };
}
