import { createHmac } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, key } = await req.json();
  const users = Object.fromEntries((process.env.REVIEWER_KEYS ?? "").split(",").map((p) => p.trim().split(":")));
  const secret = process.env.SESSION_SECRET;
  const n = String(name ?? "").trim().toLowerCase();
  if (!secret || !n || users[n] !== key) return NextResponse.json({ error: "Wrong name or key" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("bv_rev", `${n}.${createHmac("sha256", secret).update(n).digest("hex")}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
