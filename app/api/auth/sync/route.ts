import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";

export async function POST() {
  try {
    const user = await requireUser();
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
