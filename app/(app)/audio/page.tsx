import { requireUser } from "@/lib/auth";
import { listAudioTracks } from "@/lib/services/audio-service";
import { AudioLibrary } from "@/components/audio/audio-library";

export default async function AudioPage() {
  const user = await requireUser();
  const audio = await listAudioTracks(user.id);

  return <AudioLibrary categories={audio.categories} tracks={audio.tracks} recentlyPlayed={audio.recentlyPlayed} />;
}
