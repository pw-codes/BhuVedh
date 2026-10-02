import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
let s = 7;
const r = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
const villages = ["Dhaula","Kafalta","Siror","Bhatkot","Naula","Chaukori","Dwarahat","Sunkiya","Jageshwar","Mehra","Talla Gaon","Binsar"];
async function main() {
  await db.observation.deleteMany();
  await db.spring.deleteMany();
  for (let i = 0; i < 36; i++) {
    const aspect = r() * 360;
    await db.spring.create({ data: {
      name: `${pick(villages)} Naula ${i + 1}`,
      lat: 29.55 + r() * 0.2, lon: 79.55 + r() * 0.25,
      elevation: Math.round(1300 + r() * 1100),
      lithology: pick(["quartzite","limestone","schist","phyllite","shale"]),
      dipDeg: 10 + r() * 50, dipAzimuth: (aspect + (r() - 0.5) * 220 + 360) % 360, aspect,
      fractureDensity: +r().toFixed(2), lineamentDistM: Math.round(r() * 3000),
      dischargeLps: +(0.1 + r() * 3).toFixed(2), declinePct: Math.round(r() * 70),
      evidenceCount: Math.floor(r() * 6), slopeDeg: Math.round(8 + r() * 35),
      landslideRisk: +r().toFixed(2), tenure: pick(["community","community","forest","disputed"]),
    }});
  }
}
main().finally(() => db.$disconnect());
