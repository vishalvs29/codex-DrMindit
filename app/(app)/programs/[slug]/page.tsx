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
    anxiety: ["anxiety-relief", "deep-breathing", "nervous-system-reset", "meditation"],
    sleep: ["sleep-stories", "meditation", "soundscape"],
    focus: ["focus-sessions", "meditation", "productivity"],
    reset: ["nervous-system-reset", "deep-breathing", "meditation", "soundscape"]
  };

  const keywordMap: Record<string, string[]> = {
    anxiety: ["anxiety", "nervous", "worry", "stress", "panic"],
    sleep: ["sleep", "rest", "wind-down", "insomnia"],
    focus: ["focus", "attention", "productivity", "clarity"],
    reset: ["reset", "balance", "breath", "calm"]
  };

  const recommendedTracks = audio.tracks
    .filter((track) => {
      const categoryMatch = categoryMap[program.category]?.includes(track.category.slug);
      const tagMatch = track.tags.some((tag) => keywordMap[program.category]?.includes(tag));
      const titleMatch = keywordMap[program.category]?.some((keyword) => track.title.toLowerCase().includes(keyword));
      return categoryMatch || tagMatch || titleMatch;
    })
    .slice(0, 4);

  return <ProgramDetail program={program} recommendedTracks={recommendedTracks} />;
}
