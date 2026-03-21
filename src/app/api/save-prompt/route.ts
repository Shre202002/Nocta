import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { readKnowledge, writeKnowledge } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { content } = await req.json();
  const existing = readKnowledge(userId);
  writeKnowledge(userId, { ...existing, content });
  return NextResponse.json({ success: true });
}