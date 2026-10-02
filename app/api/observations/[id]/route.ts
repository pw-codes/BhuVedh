import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status, reviewerNote } = await req.json();
  if (!["accepted", "rejected"].includes(status)) return Response.json({ error: "status must be accepted or rejected" }, { status: 400 });
  const o = await db.observation.update({ where: { id: Number(params.id) }, data: { status, reviewerNote: reviewerNote ?? "", reviewedAt: new Date(), reviewedBy: req.headers.get("x-reviewer") } });
  return Response.json(o);
}
