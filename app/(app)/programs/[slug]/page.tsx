import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProgramBySlug } from "@/lib/services/program-service";
import { listAudioTracks } from "@/lib/services/audio-service";
import { ProgramDetail } from "@/components/programs/program-detail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProgramDetailPage({ params }: PageProps) {
  const user = await requireUser();
  const { slug } = await params;
  const [program, audio] = await Promise.all([
    getProgramBySlug(user.id, slug).catch(() => null),
    listAudioTracks(user.id)
  ]);

  if (!program) notFound();

  const categoryMap: Record<string, string[]> = {
    anxiety: ["anxiety-relief", "deep-breathing", "nervous-system-reset"],
    sleep: ["sleep-stories", "meditation"],
    focus: ["focus-sessions", "meditation"],
    reset: ["nervous-system-reset", "deep-breathing", "meditation"]
  };

  const recommendedTracks = audio.tracks
    .filter((track) => categoryMap[program.category]?.includes(track.category.slug))
    .slice(0, 3);

  return <ProgramDetail program={program} recommendedTracks={recommendedTracks} />;
}
