import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { updateAudioProgress } from "@/lib/services/audio-service";
import { audioProgressSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, audioProgressSchema);
    const progress = await updateAudioProgress({
      userId: user.id,
      trackId: input.trackId,
      slug: input.slug,
      positionSeconds: input.positionSeconds,
      listeningSeconds: input.listeningSeconds,
      completed: input.completed
    });
    return NextResponse.json({ progress });
  } catch (error) {
    return handleApiError(error);
  }
}
