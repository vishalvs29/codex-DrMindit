import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    prisma.session.count({ where: { userId: user.id } })
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
}
