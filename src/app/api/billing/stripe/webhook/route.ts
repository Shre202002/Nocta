import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findAccountById, writeAccount } from "@/lib/storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const { userId, plan } = session.metadata!;

    const account = await findAccountById(userId);
    if (account) {
      await writeAccount({
        ...account,
        plan: plan as "starter" | "pro",
        subscription: {
          provider: "stripe",
          subscriptionId: session.subscription as string,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    // downgrade to free
  }

  return NextResponse.json({ received: true });
}