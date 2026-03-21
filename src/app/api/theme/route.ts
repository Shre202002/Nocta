import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { readKnowledge, writeKnowledge } from "@/lib/storage";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "No userId" }, { status: 400, headers: corsHeaders });

  const knowledge = await readKnowledge(userId);  // ← await added

  return NextResponse.json(
    { theme: knowledge.theme || null },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

  const { theme } = await req.json();

  const existing = await readKnowledge(userId);  // ← await added
  await writeKnowledge(userId, { ...existing, theme });  // ← await added

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}