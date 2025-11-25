import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY must be set in env");
}

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET must be set in env");
}

const stripe = new Stripe(stripeSecretKey);

function getFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be set in env (JSON string)");
  }

  try {
    const serviceAccountJson = JSON.parse(serviceAccount);
    return initializeApp({
      credential: cert(serviceAccountJson),
    });
  } catch (error) {
    throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON");
  }
}

const db = getFirestore(getFirebaseAdmin());

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error("[webhook] Signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${error.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      console.warn("[webhook] Session not paid:", session.id);
      return NextResponse.json({ received: true });
    }

    const firebaseUid = session.metadata?.firebaseUid;
    if (!firebaseUid) {
      console.error("[webhook] Missing firebaseUid in session metadata:", session.id);
      return NextResponse.json(
        { error: "Missing firebaseUid in session metadata" },
        { status: 400 }
      );
    }

    try {
      const userRef = db.collection("users").doc(firebaseUid);
      await userRef.set(
        {
          subscriptionStatus: "active",
          upgradedAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log("[webhook] Updated user subscription:", firebaseUid);
    } catch (error) {
      console.error("[webhook] Failed to update user:", error);
      return NextResponse.json(
        { error: "Failed to update user subscription" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

