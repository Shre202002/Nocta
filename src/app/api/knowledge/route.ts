import { NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { readKnowledge } from "@/lib/storage";

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readKnowledge(userId));
}