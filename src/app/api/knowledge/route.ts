import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { readKnowledge } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") ||
    await getUserIdFromCookie();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const knowledge = await readKnowledge(userId);

  return NextResponse.json(knowledge);
}