import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { findAccount, writeAccount } from "@/lib/storage";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });

  if (await findAccount(email))
    return NextResponse.json({ error: "Email already registered." }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuid();

  await writeAccount({
    id, email, passwordHash,
    createdAt: new Date().toISOString(),
    plan: "free",
    crawlCount: 0,
  });

  const token = signToken(id);
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}