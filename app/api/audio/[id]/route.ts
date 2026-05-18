import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { getAudioTrack } from "@/lib/services/audio-service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const track = await getAudioTrack(user.id, id);
    return NextResponse.json({ track });
  } catch (error) {
    return handleApiError(error);
  }
}
