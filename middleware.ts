import { NextRequest, NextResponse } from "next/server";
export const config = { matcher: ["/review", "/api/observations/:path*"] };

const hmac = async (msg: string, secret: string) => {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg)))].map((b) => b.toString(16).padStart(2, "0")).join("");
};

/** Field uploads (POST /api/observations) stay open so offline sync never gets blocked. Everything else needs a signed reviewer session. */
export async function middleware(req: NextRequest) {
  if (req.method === "POST" && req.nextUrl.pathname === "/api/observations") return NextResponse.next();
  const secret = process.env.SESSION_SECRET, [name, sig] = (req.cookies.get("bv_rev")?.value ?? "").split(".");
  if (secret && name && sig === (await hmac(name, secret))) {
    const h = new Headers(req.headers); h.set("x-reviewer", name);
    return NextResponse.next({ request: { headers: h } });
  }
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.json({ error: "Reviewer sign-in required" }, { status: 401 });
  return NextResponse.redirect(new URL("/login", req.url));
}
