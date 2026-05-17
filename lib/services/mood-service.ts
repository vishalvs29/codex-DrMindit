import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/security";
import type { moodEntrySchema } from "@/lib/validators";
import type { z } from "zod";

type MoodInput = z.infer<typeof moodEntrySchema>;

export async function createMoodEntry(userId: string, input: MoodInput) {
  const entry = await prisma.moodEntry.create({
    data: {
      userId,
      mood: sanitizeText(input.mood, 32),
      score: input.score,
      sleep: input.sleep,
      stress: input.stress,
      journal: input.journal ? sanitizeText(input.journal, 4000) : undefined,
      tags: input.tags.map((tag) => sanitizeText(tag, 32)).filter(Boolean)
    }
  });

  await Promise.all([
    prisma.insight.create({
      data: {
        userId,
        title: "Mood check-in captured",
        body: `Your ${entry.mood.toLowerCase()} check-in was saved with a ${entry.score}/100 emotional score.`,
        score: entry.score,
        source: "mood-entry"
      }
    }),
    prisma.chatSession.updateMany({
      where: { userId, archivedAt: null },
      data: { lastMood: entry.mood }
    })
  ]);

  return entry;
}

export async function listMoodEntries(userId: string, take = 30) {
  return prisma.moodEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take
  });
}

export function buildMoodAnalytics(entries: Awaited<ReturnType<typeof listMoodEntries>>) {
  const chronological = [...entries].reverse();
  const averageScore =
    entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) : null;

  const stressValues = entries.map((entry) => entry.stress).filter((value): value is number => typeof value === "number");
  const averageStress =
    stressValues.length > 0 ? Math.round(stressValues.reduce((sum, value) => sum + value, 0) / stressValues.length) : null;

  const trend = chronological.map((entry) => ({
    date: entry.createdAt.toISOString().slice(0, 10),
    mood: entry.mood,
    score: entry.score,
    stress: entry.stress,
    sleep: entry.sleep
  }));

  const delta =
    chronological.length >= 2 ? chronological[chronological.length - 1].score - chronological[0].score : 0;

  return {
    count: entries.length,
    averageScore,
    averageStress,
    latest: entries[0] ?? null,
    delta,
    trend,
    recommendation:
      averageStress && averageStress > 65
        ? "Stress is elevated across recent check-ins. Try a short grounding session before the next demanding task."
        : "Your recent check-ins look steady. Keep pairing journaling with short breathing practices."
  };
}
