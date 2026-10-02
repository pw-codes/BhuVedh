import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";
const db = new PrismaClient();

export async function POST(req: Request) {
  const items = (await req.json()) as any[];
  const saved: string[] = [];
  for (const o of items) {
    await db.observation.upsert({
      where: { clientId: o.clientId }, update: {},
      create: { clientId: o.clientId, springId: o.springId, kind: o.kind, value: String(o.value), note: o.note ?? "", photo: o.photo ?? null,
        lat: o.lat, lon: o.lon, observedAt: new Date(o.observedAt) },
    });
    saved.push(o.clientId);
  }
  return Response.json({ saved });
}

export async function GET(req: Request) {
  const status = new URL(req.url).searchParams.get("status") ?? undefined;
  return Response.json(await db.observation.findMany({ where: { status }, include: { spring: { select: { name: true } } }, orderBy: { observedAt: "desc" } }));
}
