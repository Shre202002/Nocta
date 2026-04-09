import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { findAccount, writeAccount, readAccounts } from "@/lib/storage";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const account = await findAccount(email);

    // Always return success to prevent email enumeration
    if (!account) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(
      Date.now() + 60 * 60 * 1000 // 1 hour
    ).toISOString();

    // Save token to account
    await writeAccount({
      ...account,
      resetToken,
      resetTokenExpiry,
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: `"Nocta" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your Nocta password",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#000;color:#FAFAFA;font-family:Inter,sans-serif;padding:40px;margin:0;">
          <div style="max-width:480px;margin:0 auto;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
              <div style="width:28px;height:28px;background:#0D0D0D;border:1px solid #7C3AED;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#7C3AED;font-size:14px;font-weight:800;">N</span>
              </div>
              <span style="font-size:18px;font-weight:700;">NOCTA</span>
            </div>
            <h1 style="font-size:24px;font-weight:700;margin-bottom:12px;">Reset your password</h1>
            <p style="color:#71717A;font-size:15px;line-height:1.6;margin-bottom:32px;">
              We received a request to reset your Nocta password. Click the button below to create a new password. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600;font-size:14px;">
              Reset Password
            </a>
            <p style="color:#3F3F46;font-size:13px;margin-top:32px;line-height:1.6;">
              If you didn't request this, you can safely ignore this email. Your password will not be changed.
            </p>
            <p style="color:#3F3F46;font-size:12px;margin-top:24px;">
              Or copy this link: <span style="color:#7C3AED;">${resetUrl}</span>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}