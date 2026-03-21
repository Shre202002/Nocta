import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findAccount } from "@/lib/storage";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const account = findAccount(email);

  if (!account || !(await bcrypt.compare(password, account.passwordHash)))
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const token = signToken(account.id);
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}