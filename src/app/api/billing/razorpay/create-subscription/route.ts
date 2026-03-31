import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getUserIdFromCookie } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Razorpay Plan IDs (create these in Razorpay dashboard)
const PLANS = {
  starter: "plan_starter_id_from_razorpay",
  pro: "plan_pro_id_from_razorpay",
};

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();

  const subscription = await razorpay.subscriptions.create({
    plan_id: PLANS[plan as keyof typeof PLANS],
    customer_notify: 1,
    total_count: 12, // 12 months
  });

  return NextResponse.json({
    subscriptionId: subscription.id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}