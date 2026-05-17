import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { getDashboardAnalytics } from "@/lib/services/analytics-service";

export async function GET() {
  try {
    const user = await requireUser();
    const dashboard = await getDashboardAnalytics(user.id);
    return NextResponse.json({ dashboard });
  } catch (error) {
    return handleApiError(error);
  }
}
