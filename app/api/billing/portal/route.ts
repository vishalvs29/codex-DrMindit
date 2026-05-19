import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { createStripeCustomerPortalSession } from "@/lib/services/subscription-service";

export async function POST() {
  try {
    const user = await requireUser();
    const session = await createStripeCustomerPortalSession(user);
    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
