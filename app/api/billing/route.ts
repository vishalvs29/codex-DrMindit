import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { createStripeCheckoutSession, getActiveSubscription } from "@/lib/services/subscription-service";

export async function GET() {
  try {
    const user = await requireUser();
    const subscription = await getActiveSubscription(user.id);
    return NextResponse.json({ active: Boolean(subscription), subscription });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  try {
    const user = await requireUser();
    const session = await createStripeCheckoutSession(user);
    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
