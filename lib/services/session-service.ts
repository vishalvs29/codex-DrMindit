import { Prisma } from "@prisma/client";
import { notFound } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/security";

const sessionSelect = {
  id: true,
  title: true,
  summary: true,
  riskLevel: true,
  lastMood: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      messages: true
    }
  }
} satisfies Prisma.ChatSessionSelect;

export async function createChatSession(userId: string, title = "New reflection") {
  return prisma.chatSession.create({
    data: {
      userId,
      title: sanitizeText(title, 120) || "New reflection"
    },
    select: sessionSelect
  });
}

export async function listChatSessions(userId: string) {
  return prisma.chatSession.findMany({
    where: {
      userId,
      archivedAt: null
    },
    orderBy: { updatedAt: "desc" },
    select: sessionSelect,
    take: 50
  });
}

export async function getChatSessionForUser(userId: string, sessionId: string) {
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
      archivedAt: null
    }
  });

  if (!session) {
    throw notFound("Chat session not found.");
  }

  return session;
}

export async function updateChatSession(userId: string, sessionId: string, input: { title?: string; archived?: boolean }) {
  await getChatSessionForUser(userId, sessionId);

  return prisma.chatSession.update({
    where: { id: sessionId },
    data: {
      ...(input.title ? { title: sanitizeText(input.title, 120) } : {}),
      ...(typeof input.archived === "boolean" ? { archivedAt: input.archived ? new Date() : null } : {})
    },
    select: sessionSelect
  });
}

export async function deleteChatSession(userId: string, sessionId: string) {
  await getChatSessionForUser(userId, sessionId);

  await prisma.chatSession.delete({
    where: { id: sessionId }
  });
}
