import { subDays } from "@/lib/time";
import { prisma } from "@/lib/prisma";
import { buildMoodAnalytics } from "@/lib/services/mood-service";

function calculateStreak(dates: Date[]) {
  const days = new Set(dates.map((date) => date.toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getDashboardAnalytics(userId: string) {
  const since = subDays(new Date(), 30);
  const weekStart = subDays(new Date(), 7);

  const [moodEntries, sessionCount, messageCount, audioSessions, insights, programProgress] = await Promise.all([
    prisma.moodEntry.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 60
    }),
    prisma.chatSession.count({ where: { userId, archivedAt: null } }),
    prisma.message.count({
      where: {
        chatSession: {
          userId
        }
      }
    }),
    prisma.audioSession.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.insight.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.programProgress.findMany({
      where: { userId },
      include: { program: true },
      orderBy: { updatedAt: "desc" },
      take: 5
    })
  ]);

  const moodAnalytics = buildMoodAnalytics(moodEntries);
  const weeklyEntries = moodEntries.filter((entry) => entry.createdAt >= weekStart);
  const streak = calculateStreak(moodEntries.map((entry) => entry.createdAt));
  const completedAudioMinutes = audioSessions
    .filter((session) => session.completed)
    .reduce((sum, session) => sum + session.duration, 0);

  return {
    emotionalScore: moodAnalytics.averageScore ?? 0,
    moodDelta: moodAnalytics.delta,
    streak,
    weeklyMoodEntries: weeklyEntries.length,
    sessionCount,
    messageCount,
    completedAudioMinutes,
    mood: moodAnalytics,
    insights,
    programs: programProgress.map((progress) => ({
      id: progress.id,
      title: progress.program.title,
      day: progress.day,
      duration: progress.program.duration,
      completed: progress.completed
    }))
  };
}
