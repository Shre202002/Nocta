import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserIdFromCookie } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  starter: "price_starter_id_from_stripe",
  pro: "price_pro_id_from_stripe",
};

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromCookie();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const origin = req.headers.get("origin") || "https://nocta-6pfc.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 }],
    success_url: `${origin}/dashboard?payment=success`,
    cancel_url: `${origin}/dashboard?payment=cancelled`,
    metadata: { userId, plan },
  });

  return NextResponse.json({ url: session.url });
}