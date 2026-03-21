import { NextRequest, NextResponse } from "next/server";
import {
  readAccounts,
  writeAccount,
  readKnowledge,
  writeKnowledge,
  deleteAccount,
  deleteKnowledge,
} from "@/lib/storage";

function isSuperAdmin(req: NextRequest) {
  return req.cookies.get("sa_token")?.value === process.env.SUPER_ADMIN_PASSWORD;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { plan, systemPrompt } = await req.json();

  if (plan) {
    const accounts = await readAccounts();
    const account = accounts.find((a) => a.id === id);
    if (!account)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    await writeAccount({ ...account, plan });
  }

  if (systemPrompt !== undefined) {
    const knowledge = await readKnowledge(id);
    await writeKnowledge(id, { ...knowledge, systemPrompt });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await deleteAccount(id);
  await deleteKnowledge(id);

  return NextResponse.json({ success: true });
}