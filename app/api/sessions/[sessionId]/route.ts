import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { deleteChatSession, getChatSessionForUser, updateChatSession } from "@/lib/services/session-service";
import { updateSessionSchema } from "@/lib/validators";

type Context = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function GET(_request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { sessionId } = await context.params;
    const session = await getChatSessionForUser(user.id, sessionId);
    return NextResponse.json({ session });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { sessionId } = await context.params;
    const input = await parseJson(request, updateSessionSchema);
    const session = await updateChatSession(user.id, sessionId, input);
    return NextResponse.json({ session });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { sessionId } = await context.params;
    await deleteChatSession(user.id, sessionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
