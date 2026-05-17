import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { createChatSession, listChatSessions } from "@/lib/services/session-service";
import { createSessionSchema } from "@/lib/validators";

export async function GET() {
  try {
    const user = await requireUser();
    const sessions = await listChatSessions(user.id);
    return NextResponse.json({ sessions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, createSessionSchema);
    const session = await createChatSession(user.id, input.title);
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
