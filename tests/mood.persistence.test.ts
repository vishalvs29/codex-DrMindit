import { afterAll, beforeAll, describe, expect, test } from "vitest";

if (!process.env.TEST_DATABASE_URL) {
  test.skip("Mood persistence integration tests", () => {
    expect(true).toBe(true);
  });
} else {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

import { prisma } from "@/lib/prisma";
import { createMoodEntry, listMoodEntries } from "@/lib/services/mood-service";

let userId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      clerkId: `test-${Date.now()}`,
      email: `test-${Date.now()}@example.com`
    }
  });
  userId = user.id;
});

afterAll(async () => {
  await prisma.moodEntry.deleteMany({ where: { userId } });
  await prisma.insight.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.$disconnect();
});

describe("Mood persistence", () => {
  test("creates a mood entry and related insight", async () => {
    const entry = await createMoodEntry(userId, {
      mood: "Calm",
      score: 74,
      stress: 35,
      sleep: 72,
      journal: "Feeling grounded after a brief walk.",
      tags: ["daily-check-in"]
    });

    expect(entry.userId).toBe(userId);
    expect(entry.mood).toBe("Calm");
    expect(entry.score).toBe(74);

    const entries = await listMoodEntries(userId);
    expect(entries[0]?.id).toBe(entry.id);
  });
});
