import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { getProgramBySlug } from "@/lib/services/program-service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const program = await getProgramBySlug(user.id, id);
    return NextResponse.json({ program });
  } catch (error) {
    return handleApiError(error);
  }
}
