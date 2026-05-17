import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { moodEntrySchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = moodEntrySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const entry = await prisma.moodEntry.create({
    data: {
      userId: user.id,
      ...parsed.data
    }
  });

  await prisma.insight.create({
    data: {
      userId: user.id,
      title: "Mood check-in captured",
      body: `Your ${parsed.data.mood.toLowerCase()} check-in was saved with a ${parsed.data.score}/100 emotional score.`,
      score: parsed.data.score,
      source: "mood-entry"
    }
  });

  return NextResponse.json({ entry });
}

export async function GET() {
  const user = await getOrCreateUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.moodEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30
  });

  return NextResponse.json({ entries });
}
