import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { buildMoodAnalytics, createMoodEntry, listMoodEntries } from "@/lib/services/mood-service";
import { moodEntrySchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, moodEntrySchema);
    const entry = await createMoodEntry(user.id, input);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const entries = await listMoodEntries(user.id);
    return NextResponse.json({ entries, analytics: buildMoodAnalytics(entries) });
  } catch (error) {
    return handleApiError(error);
  }
}
