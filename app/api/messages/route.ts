import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { createMessage, listMessages } from "@/lib/services/message-service";
import { messageQuerySchema, messagesPostSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const input = messageQuerySchema.parse({
      sessionId: searchParams.get("sessionId"),
      limit: searchParams.get("limit") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined
    });

    const messages = await listMessages(user.id, input.sessionId, input.limit, input.cursor);
    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, messagesPostSchema);
    await listMessages(user.id, input.sessionId, 1);
    const message = await createMessage({
      sessionId: input.sessionId,
      role: "USER",
      content: input.message
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
