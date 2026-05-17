import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireUser();
    const [insights, moodEntries, sessions] = await Promise.all([
      prisma.insight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10
      }),
      prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 14
      }),
      prisma.chatSession.count({ where: { userId: user.id, archivedAt: null } })
    ]);

    return NextResponse.json({
      insights,
      metrics: {
        moodEntries: moodEntries.length,
        averageMood:
          moodEntries.length > 0
            ? Math.round(moodEntries.reduce((sum, entry) => sum + entry.score, 0) / moodEntries.length)
            : null,
        sessions
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
