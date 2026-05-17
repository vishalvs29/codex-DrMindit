import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { estimateTokenCount, sanitizeText } from "@/lib/security";
import { getChatSessionForUser } from "@/lib/services/session-service";

const messageSelect = {
  id: true,
  chatSessionId: true,
  role: true,
  content: true,
  metadata: true,
  tokenCount: true,
  createdAt: true
} satisfies Prisma.MessageSelect;

export async function listMessages(userId: string, sessionId: string, limit = 50, cursor?: string) {
  await getChatSessionForUser(userId, sessionId);

  return prisma.message.findMany({
    where: { chatSessionId: sessionId },
    orderBy: { createdAt: "asc" },
    select: messageSelect,
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
  });
}

export async function createMessage(input: {
  sessionId: string;
  role: Role;
  content: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const content = sanitizeText(input.content, 8000);

  return prisma.message.create({
    data: {
      chatSessionId: input.sessionId,
      role: input.role,
      content,
      tokenCount: estimateTokenCount(content),
      metadata: input.metadata
    },
    select: messageSelect
  });
}
