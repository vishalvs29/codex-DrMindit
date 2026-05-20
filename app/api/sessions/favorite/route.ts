import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { setFavoriteTrack } from "@/lib/services/audio-service";
import { audioFavoriteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, audioFavoriteSchema);
    await setFavoriteTrack({
      userId: user.id,
      trackId: input.trackId,
      slug: input.slug,
      favorite: input.favorite
    });
    return NextResponse.json({ favorite: input.favorite });
  } catch (error) {
    return handleApiError(error);
  }
}
