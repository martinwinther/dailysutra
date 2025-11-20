import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_ID;

if (!stripeSecretKey || !stripePriceId) {
  throw new Error("STRIPE_SECRET_KEY and STRIPE_PRICE_ID must be set in env");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const body = await request.json();
    const { uid, email } = body as { uid?: string; email?: string | null };

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing uid or email" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        firebaseUid: uid,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("[create-checkout-session] error", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
