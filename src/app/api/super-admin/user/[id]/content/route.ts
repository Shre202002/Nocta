import { NextRequest, NextResponse } from "next/server";
import { readKnowledge } from "@/lib/storage";

function isSuperAdmin(req: NextRequest) {
  return req.cookies.get("sa_token")?.value === process.env.SUPER_ADMIN_PASSWORD;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const knowledge = readKnowledge(params.id);
  return NextResponse.json({
    content: knowledge.content || "",
    systemPrompt: knowledge.systemPrompt || "",
    url: knowledge.url || "",
  });
}