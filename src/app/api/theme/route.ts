import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { readKnowledge, writeKnowledge } from "@/lib/storage";

export const dynamic = "force-dynamic"; // ← ADD THIS — disables Next.js caching

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "No userId" }, { status: 400 });
  const knowledge = readKnowledge(userId);
  return NextResponse.json(
    { theme: knowledge.theme || null },
    {
      headers: {
        // Tell browser and CDN never to cache this
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { theme } = await req.json();
  const existing = readKnowledge(userId);
  writeKnowledge(userId, { ...existing, theme });
  return NextResponse.json({ success: true });
}