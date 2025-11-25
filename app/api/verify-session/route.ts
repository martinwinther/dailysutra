import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { config } from "../../../lib/config";

const stripe = new Stripe(config.stripe.secretKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body as { sessionId?: string };

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed", verified: false },
        { status: 400 }
      );
    }

    const firebaseUid = session.metadata?.firebaseUid;
    if (!firebaseUid) {
      return NextResponse.json(
        { error: "Missing firebaseUid in session", verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      firebaseUid,
      paymentStatus: session.payment_status,
    });
  } catch (error: any) {
    console.error("[verify-session] error", error);
    return NextResponse.json(
      { error: "Failed to verify session", verified: false },
      { status: 500 }
    );
  }
}

