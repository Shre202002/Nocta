import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readAccounts, writeAccount } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Find account with this reset token
    const accounts = await readAccounts();
    const account = accounts.find(
      (a) =>
        a.resetToken === token &&
        a.resetTokenExpiry &&
        new Date(a.resetTokenExpiry) > new Date()
    );

    if (!account) {
      return NextResponse.json(
        { error: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const passwordHash = await bcrypt.hash(password, 10);
    await writeAccount({
      ...account,
      passwordHash,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}