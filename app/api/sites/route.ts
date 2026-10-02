import { PrismaClient } from "@prisma/client";
import { assess } from "@/lib/engine";
export const dynamic = "force-dynamic";
const db = new PrismaClient();

export async function GET() {
  const rows = await db.spring.findMany();
  const sites = rows.map((s) => {
    const a = assess(s);
    return { spring: s, ...a };
  }).sort((x, y) => y.assessment.priority - x.assessment.priority);
  return Response.json(sites);
}
