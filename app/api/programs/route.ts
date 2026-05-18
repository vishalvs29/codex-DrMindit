import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { listPrograms } from "@/lib/services/program-service";

export async function GET() {
  try {
    const user = await requireUser();
    const programs = await listPrograms(user.id);
    return NextResponse.json({ programs });
  } catch (error) {
    return handleApiError(error);
  }
}
