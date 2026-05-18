import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { listAudioTracks } from "@/lib/services/audio-service";

export async function GET() {
  try {
    const user = await requireUser();
    const audio = await listAudioTracks(user.id);
    return NextResponse.json(audio);
  } catch (error) {
    return handleApiError(error);
  }
}
