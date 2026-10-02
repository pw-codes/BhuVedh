import { PrismaClient } from "@prisma/client";
import { assess } from "@/lib/engine";
import { weightOf } from "@/lib/evidence";
export const dynamic = "force-dynamic";
const db = new PrismaClient();

export async function GET() {
  const rows = await db.spring.findMany({ include: { observations: { where: { status: "accepted" }, select: { kind: true } } } });
  const sites = rows.map((s) => {
    const evidence = +(s.evidenceCount + s.observations.reduce((t, o) => t + weightOf(o.kind), 0)).toFixed(2);
    const a = assess({ ...s, evidenceCount: evidence });
    const { observations, ...spring } = s;
    return { spring: { ...spring, evidenceCount: evidence }, ...a };
  }).sort((x, y) => y.assessment.priority - x.assessment.priority);
  return Response.json(sites);
}
