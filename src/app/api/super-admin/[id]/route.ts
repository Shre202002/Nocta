import { NextRequest, NextResponse } from "next/server";
import {
  readAccounts, writeAccounts, readKnowledge, writeKnowledge,
} from "@/lib/storage";
import fs from "fs";
import path from "path";

function isSuperAdmin(req: NextRequest) {
  return req.cookies.get("sa_token")?.value === process.env.SUPER_ADMIN_PASSWORD;
}

// Update user (plan or system prompt)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, systemPrompt } = await req.json();
  const { id } = params;

  if (plan) {
    const accounts = readAccounts();
    const idx = accounts.findIndex((a) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });
    accounts[idx].plan = plan;
    writeAccounts(accounts);
  }

  if (systemPrompt !== undefined) {
    const knowledge = readKnowledge(id);
    writeKnowledge(id, { ...knowledge, systemPrompt });
  }

  return NextResponse.json({ success: true });
}

// Delete user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const accounts = readAccounts();
  const filtered = accounts.filter((a) => a.id !== id);
  writeAccounts(filtered);

  // Delete knowledge file
  const file = path.join(process.cwd(), "data", "users", `${id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);

  return NextResponse.json({ success: true });
}