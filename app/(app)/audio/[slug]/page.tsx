import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAudioTrack } from "@/lib/services/audio-service";
import { AudioDetail } from "@/components/audio/audio-detail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioDetailPage({ params }: PageProps) {
  const user = await requireUser();
  const { slug } = await params;
  const track = await getAudioTrack(user.id, slug).catch(() => null);

  if (!track) notFound();

  return <AudioDetail track={track} />;
}
