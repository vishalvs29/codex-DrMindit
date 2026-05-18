import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/services/subscription-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    await handleStripeWebhook(payload, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook failed." }, { status: 400 });
  }
}
