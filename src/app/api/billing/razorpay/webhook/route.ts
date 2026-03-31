import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findAccountById, writeAccount } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Verify webhook is from Razorpay
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "subscription.activated") {
    const { notes, id, current_end } = event.payload.subscription.entity;
    const userId = notes.userId;

    const account = await findAccountById(userId);
    if (account) {
      await writeAccount({
        ...account,
        plan: notes.plan,
        subscription: {
          provider: "razorpay",
          subscriptionId: id,
          status: "active",
          currentPeriodEnd: new Date(current_end * 1000).toISOString(),
        },
      });
    }
  }

  if (event.event === "subscription.cancelled") {
    const { notes } = event.payload.subscription.entity;
    const account = await findAccountById(notes.userId);
    if (account) {
      await writeAccount({
        ...account,
        plan: "free",
        subscription: { ...account.subscription!, status: "cancelled" },
      });
    }
  }

  return NextResponse.json({ received: true });
}