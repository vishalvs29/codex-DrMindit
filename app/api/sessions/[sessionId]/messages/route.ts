import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { listMessages } from "@/lib/services/message-service";

type Context = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { sessionId } = await context.params;
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 50);
    const messages = await listMessages(user.id, sessionId, Number.isFinite(limit) ? limit : 50);
    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}
