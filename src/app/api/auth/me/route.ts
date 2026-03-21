import { NextResponse } from "next/server";
import { getUserIdFromCookie } from "@/lib/auth";
import { findAccountById } from "@/lib/storage";

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const account = findAccountById(userId);
  if (!account) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ id: account.id, email: account.email, plan: account.plan });
}