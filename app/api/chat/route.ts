import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { assertRateLimit } from "@/lib/api/rate-limit";
import { parseJson } from "@/lib/api/request";
import { createChatCompletionStream } from "@/lib/services/ai-chat-service";
import { chatRequestSchema } from "@/lib/validators";
import { buildCrisisResourceMessage, detectCrisisSignal } from "@/lib/ai/prompts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    await assertRateLimit(`chat:${user.id}`, 20, 60_000);
    const input = await parseJson(request, chatRequestSchema);

    if (detectCrisisSignal(input.message)) {
      const crisisMessage = buildCrisisResourceMessage();
      return new Response(crisisMessage, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "x-crisis-detected": "true"
        }
      });
    }

    const { sessionId, stream } = await createChatCompletionStream({
      userId: user.id,
      preferredTone: user.preferredTone,
      sessionId: input.sessionId,
      message: input.message
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "x-session-id": sessionId
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
