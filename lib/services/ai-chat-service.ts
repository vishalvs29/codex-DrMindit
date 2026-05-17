import type OpenAI from "openai";
import { Role } from "@prisma/client";
import { ApiError } from "@/lib/api/errors";
import { getOpenAIClient, getOpenAIModel } from "@/lib/ai/openai";
import { buildMoodContext, buildSystemPrompt, detectRiskLevel } from "@/lib/ai/prompts";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/security";
import { createMessage } from "@/lib/services/message-service";
import { createChatSession, getChatSessionForUser } from "@/lib/services/session-service";

type ChatStreamResult = {
  sessionId: string;
  stream: ReadableStream<Uint8Array>;
};

function toOpenAIRole(role: Role): "assistant" | "user" | "system" {
  if (role === "ASSISTANT") return "assistant";
  if (role === "SYSTEM") return "system";
  return "user";
}

export async function createChatCompletionStream({
  userId,
  preferredTone,
  sessionId,
  message
}: {
  userId: string;
  preferredTone: string;
  sessionId?: string;
  message: string;
}): Promise<ChatStreamResult> {
  const cleanMessage = sanitizeText(message, 5000);
  const session = sessionId
    ? await getChatSessionForUser(userId, sessionId)
    : await createChatSession(userId, cleanMessage.slice(0, 80) || "New reflection");

  const riskLevel = detectRiskLevel(cleanMessage);

  await createMessage({
    sessionId: session.id,
    role: "USER",
    content: cleanMessage,
    metadata: { riskLevel }
  });

  const [history, moodEntries] = await Promise.all([
    prisma.message.findMany({
      where: { chatSessionId: session.id },
      orderBy: { createdAt: "desc" },
      take: 16
    }),
    prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 7
    })
  ]);

  const systemPrompt = buildSystemPrompt({
    preferredTone,
    moodContext: buildMoodContext(moodEntries),
    riskLevel
  });

  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError("OPENAI_API_KEY is not configured.", 503, "AI_NOT_CONFIGURED");
  }

  const encoder = new TextEncoder();
  const openai = getOpenAIClient();
  let assistantContent = "";

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.reverse().map((item) => ({
      role: toOpenAIRole(item.role),
      content: item.content
    }))
  ];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: getOpenAIModel(),
          stream: true,
          temperature: riskLevel === "CRISIS" ? 0.3 : 0.7,
          messages
        });

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content ?? "";
          assistantContent += token;
          controller.enqueue(encoder.encode(token));
        }

        await createMessage({
          sessionId: session.id,
          role: "ASSISTANT",
          content: assistantContent,
          metadata: { model: getOpenAIModel(), riskLevel }
        });

        await prisma.chatSession.update({
          where: { id: session.id },
          data: {
            summary: assistantContent.slice(0, 280),
            riskLevel,
            ...(session.title === "New reflection" ? { title: cleanMessage.slice(0, 80) } : {})
          }
        });
      } catch (error) {
        console.error(error);
        controller.enqueue(
          encoder.encode(
            "I am having trouble connecting right now. If this is urgent or you may not be safe, please contact local emergency services or 988 in the United States now."
          )
        );
      } finally {
        controller.close();
      }
    }
  });

  return {
    sessionId: session.id,
    stream
  };
}
